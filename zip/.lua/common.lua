local common = {}
common.unsafe = {}

local fm = require "fullmoon"
local argon2 = require 'argon2'
local re = require 're'
local math = require 'math'

common.databaseFile = 'database.db'

function common.mday()
    unixsec, nanos = unix.clock_gettime()
    year,mon,mday,hour,min,sec = unix.localtime(unixsec)

    return mday
end

function common.month()
    unixsec, nanos = unix.clock_gettime()
    year,mon,mday,hour,min,sec = unix.localtime(unixsec)

    return mon
end

-- local db <close> = common.getSqlConnection()
function common.getSqlConnection()
    return fm.makeStorage(common.databaseFile, [[PRAGMA foreign_keys=ON;PRAGMA journal_mode=WAL;PRAGMA synchronous=NORMAL;]])
end

function common.sqlInit(db)
    -- user stuff
        db:exec([[CREATE TABLE users (
            username TEXT COLLATE NOCASE check(length(username <= 64)) PRIMARY KEY,
            password TEXT NOT NULL,
            email TEXT COLLATE NOCASE NOT NULL check(length(email <= 200))
        );]])

    -- chat stuff
        db:exec([[CREATE TABLE chats (
            id INTEGER PRIMARY KEY,
            username TEXT COLLATE NOCASE check(length(username <= 64)),
            timestamp INTEGER NOT NULL,
            message TEXT NOT NULL check(length(message <= 90)),
            FOREIGN KEY(username) REFERENCES users(username) ON DELETE SET NULL ON UPDATE CASCADE
        );]])

        db:exec([[CREATE TABLE chatSessions (
            sessionid INTEGER PRIMARY KEY,
            lastHeartBeat INTEGER NOT NULL,
            futureid INTEGER,
            pastid INTEGER,
            FOREIGN KEY(futureid) REFERENCES chats(id) ON DELETE SET NULL,
            FOREIGN KEY(pastid) REFERENCES chats(id) ON DELETE SET NULL
        );]])

        db:exec([[CREATE TABLE chatMsgUpdates (
            sessionid INTEGER NOT NULL,
            id INTEGER NOT NULL,

            FOREIGN KEY(sessionid) REFERENCES chatSessions(sessionid) ON DELETE CASCADE,
            FOREIGN KEY(id) REFERENCES chats(id) ON DELETE CASCADE,
            PRIMARY KEY (sessionid, id)
        );]])

        db:exec([[CREATE TABLE chatRequests (
            sessionid INTEGER PRIMARY KEY,
            FOREIGN KEY(sessionid) REFERENCES chatSessions(sessionid) ON DELETE CASCADE
        );]])

        db:exec([[CREATE TABLE bannedChatUsers (
            username TEXT COLLATE NOCASE PRIMARY KEY,
            FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE
        );]])

    -- signup stuff
        db:exec([[CREATE TABLE dailyEmailSends (
            email TEXT COLLATE NOCASE NOT NULL check(length(email <= 200)) PRIMARY KEY,
            sends INTEGER DEFAULT 0
        );]])

        db:exec([[CREATE TABLE monthlyEmailSends (
            email TEXT COLLATE NOCASE NOT NULL check(length(email <= 200)) PRIMARY KEY,
            sends INTEGER DEFAULT 0
        );]])

        db:exec([[CREATE TABLE dailyIpSignups (ip TEXT PRIMARY KEY, signups INTEGER DEFAULT 0);]])
        db:exec([[CREATE TABLE signupEmailWhitelist (
            email TEXT COLLATE NOCASE NOT NULL check(length(email <= 200)) PRIMARY KEY
        );]])

        db:exec([[CREATE TABLE signups (
            email TEXT COLLATE NOCASE NOT NULL check(length(email <= 200)),
            username TEXT COLLATE NOCASE check(length(username <= 64)),
            lastAttempt INTEGER DEFAULT 0,
            code TEXT,
            PRIMARY KEY (email,username)
        );]])

    -- others
        db:exec([[CREATE TABLE globals (id TEXT PRIMARY KEY, data TEXT);]])

        db:exec([[CREATE TABLE emailLookups (domain TEXT COLLATE NOCASE PRIMARY KEY, result TEXT NOT NULL);]])
end

--[[
    TODO take out all "insert or replace" with upsert...

    example:
        INSERT OR REPLACE INTO chats (id,username,timestamp,message) VALUES
            (1,'david',1,'hi there')
            (2,'david',1,'caca much?!')
            ;
    =>
        INSERT INTO chats (id,username,timestamp,message) VALUES
            (1,'david',1,'hi there')
            (2,'david',1,'caca much?!')
        ${common.onConflictUpsert('id', {'username','timestamp','message'})}
            ;
]]

function common.onConflictUpsert(conflictColumsStr, columns)
    local updatesStr = ""
    for k,v in pairs(columns) do
        updatesStr = updatesStr..[[%s = excluded.%s%s]] % {v,v, k==#columns and "" or ","}
    end

    local statement = [[ON CONFLICT(%s) DO UPDATE SET %s]]
        % {conflictColumsStr, updatesStr}

    -- print("upsert partial: '%s'" % {statement})

    return statement
end

function common.userReplaceSave(db, username, cleartextPassword, email)
    local hashedPass, passSalt = common.generateHashedFromClear(cleartextPassword)
    
    db:execute([[INSERT INTO users (username, password, email) VALUES (?,?,?) %s ;]]
        % {common.onConflictUpsert("username", {"password", "email"})},
        username, hashedPass, email)    

    fm.logInfo("saved user: username '%s'" % {username})
end

function common.deleteUser(db, username)
    db:execute([[DELETE FROM users WHERE username=?;]], username)
end

function common.userVerify(db, username, cleartextPass)

    local hashed = db:fetchOne("SELECT password FROM users WHERE username=?;", username)
    hashed = hashed and tostring(hashed.password) or Nil

    if hashed == Nil then return false end

    return common.verifyClearWithHashed(hashed, cleartextPass)
end

function common.starts_with(str, start)
   return str:sub(1, #start) == start
end

function common.ends_with(str, ending)
   return ending == "" or str:sub(-#ending) == ending
end

function common.trim(str)
    return str:match("^%s*(.-)%s*$")
end

function common.rmWhitespace(str)
    return str:gsub("%s+", "")
end

function common.isDevmode()
    for k,v in pairs(arg) do
        -- fm.logInfo(k.." = "..tostring(v))
        if v == "--devmode" then
            return true
        end
    end
    return false
end

common.chat = {}
common.chat.heartbeatThresholdSeconds = 50
common.chat.heartbeatSuperDeadSeconds = 60

function common.chat.createSession(db)
    local sessionid = db:fetchOne([[INSERT INTO chatSessions (lastHeartBeat) VALUES (?) RETURNING *;]], math.floor(GetTime())).sessionid
    print("CREATED SESSION", sessionid)
    return sessionid
end

function common.chat.getSession(db, sessionid)
    local data = db:fetchOne([[SELECT * from chatSessions WHERE sessionid=?;]], sessionid)
    return data
end

function common.chat.removeSession(db, sessionid)
    db:execute([[DELETE FROM chatSessions WHERE sessionid=?;]], sessionid)
    print("DELTED SESSION", sessionid)
end

function common.chat.beatHeart(db, sessionid)
    db:execute([[UPDATE chatSessions SET lastHeartBeat=? WHERE sessionid=?;]], math.floor(GetTime()), sessionid)
end

function common.chat.getFutureId(db, sessionid)
    return db:fetchOne([[SELECT futureid FROM chatSessions WHERE sessionid=?;]], sessionid).futureid
end

function common.chat.setFutureId(db, sessionid, futureid)
    print("setfutureid %s" % {tostring(futureid)})
    db:execute([[UPDATE chatSessions SET futureid=? WHERE sessionid=?;]], futureid, sessionid)
end

function common.chat.getPastId(db, sessionid)
    return db:fetchOne([[SELECT pastid FROM chatSessions WHERE sessionid=?;]], sessionid).pastid
end

function common.chat.setPastId(db, sessionid, pastid)
    db:execute([[UPDATE chatSessions SET pastid=? WHERE sessionid=?;]], pastid, sessionid)
end

-- function common.chat.deleteDeadSessions(db)
--     db:execute([[DELETE FROM chatSessions WHERE (? - lastHeartBeat) > ?;]],
--         GetTime(), common.chat.heartbeatThresholdSeconds)
-- end

function common.chat.deleteSuperDeadSessions(db)
    db:execute([[DELETE FROM chatSessions WHERE (? - lastHeartBeat) > ?;]],
        GetTime(), common.chat.heartbeatSuperDeadSeconds)
    print("deleted old sessions")
end

-- DELETE FROM chatSessions WHERE (1779141866 - lastHeartBeat) > 300;

function common.chat.isHeartbeatDead(db, sessionid)
    local now = GetTime()
    local lastHeartBeat = db:fetchOne([[SELECT lastHeartBeat FROM chatSessions WHERE sessionid=?;]], sessionid).lastHeartBeat or 0
    return now - lastHeartBeat > common.chat.heartbeatThresholdSeconds
end

function common.chat.addSessionUpdateIdFromTo(db, sessionid, from, to)
    db:execute([[
        INSERT INTO chatMsgUpdates (sessionid, id)
        SELECT ?, id FROM chats
        INNER JOIN chatSessions ON sessionid=?
        WHERE
            id BETWEEN ? AND ?
            AND c.id BETWEEN (cs.pastid-1) AND (cs.futureid+1)
        %s
        ;]] % {common.onConflictUpsert('sessionid', {'id'})}, sessionid, sessionid, from, to)
end

function common.chat.addAllSessionsUpdateIdFromTo(db, from, to)
    db:execute([[
        INSERT INTO chatMsgUpdates (sessionid, id)
        SELECT cs.sessionid as sessionid, c.id
        FROM chats c
        CROSS JOIN chatSessions cs
        WHERE c.id BETWEEN ? AND ?
        AND c.id BETWEEN (cs.pastid-1) AND (cs.futureid+1)
        %s
        ;]] % {common.onConflictUpsert('sessionid', {'id'})}, from, to)
end

--[[
INSERT OR REPLACE INTO chatMsgUpdates (sessionid, id)
        SELECT cs.sessionid as sessionid, c.id
        FROM chats c
        CROSS JOIN chatSessions cs
        WHERE c.id BETWEEN 1 AND 1
        AND c.id BETWEEN cs.pastid AND cs.futureid
        ;
]]

function common.chat.addAllSessionsUpdateIdFromUser(db, username)
    db:execute([[
        INSERT INTO chatMsgUpdates (sessionid, id)
        SELECT cs.sessionid, c.id
        FROM chats c
        CROSS JOIN chatSessions cs
        WHERE c.username = ?
        AND c.id BETWEEN (cs.pastid-1) AND (cs.futureid+1)
        %s
        ;]] % {common.onConflictUpsert('sessionid', {'id'})}, username)
end

function common.chat.clearSessionUpdates(db, sessionid)
    db:execute([[DELETE FROM chatMsgUpdates WHERE sessionid=?;]], sessionid)
end

function common.chat.getSessionUpdatedMessages(db, sessionid)
    return db:fetchAll([[
        SELECT chats.id AS id,username,timestamp,message FROM chats
        INNER JOIN chatMsgUpdates ON chatMsgUpdates.sessionid = ? AND chatMsgUpdates.id=chats.id
        ;
        ]], sessionid)
end

function common.chat.banUser(db, username)
    db:execute([[INSERT OR REPLACE INTO bannedChatUsers (username) VALUES (?);]], username)
end

function common.chat.unbanUser(db, username)
    db:execute([[DELETE FROM bannedChatUsers WHERE username=?;]], username)
end

function common.chat.isUserBanned(db, username)
    return db:fetchOne([[SELECT username FROM bannedChatUsers WHERE username=?;]],username).username ~= Nil
end

function common.chat.insertNewMessage(db, username, message)
    db:execute([[INSERT INTO chats (username, timestamp, message) VALUES (?,?,?);]], username, math.floor(GetTime()), message)
end

function common.chat.setTestMessages(db)
    if db:fetchOne([[SELECT id from chats WHERE id=1;]]).id == Nil then
        print("adding test messags, chat is empty")
        db:execute([[REPLACE INTO chats (id, username, timestamp, message) VALUES 
            (1,'david',1337,'First of all...'),
            (2,'david',1337,'Second of all...'),
            (3,'david',1337,'Last but not least...')
            ;]])
    end
    print("set test messages")
end

function common.chat.getLastId(db)
    local id = math.floor(tonumber(db:fetchOne([[SELECT id FROM chats ORDER BY id DESC LIMIT 1;]]).id or 0))
    -- print("got id %d" % {id})
    return id
end

function common.chat.retrieveMessagesBetweenIds(db, id1, id2, reverse)
    print("retrieve betwwen %s and %s" % {tostring(id1), tostring(id2)})
    if reverse == true then
        return db:fetchAll([[SELECT * FROM chats WHERE id BETWEEN ? AND ? ORDER BY id DESC;]], id1, id2)
    else
        return db:fetchAll([[SELECT * FROM chats WHERE id BETWEEN ? AND ? ORDER BY id ASC;]], id1, id2)
    end
end

function common.chat.replaceAllUserMessages(db, username, message)
    db:execute([[UPDATE chats SET message=? WHERE username=?;]], message, username)
    common.chat.addAllSessionsUpdateIdFromUser(db, username)
    print("replaced user messages and set updates", username)
end

function common.chat.replaceMessagesFromTo(db, from, to, message)
    db:execute([[UPDATE chats SET message=? WHERE id BETWEEN ? and ?;]], message,from,to)
    common.chat.addAllSessionsUpdateIdFromTo(db, from, to)
    print("replaced fromto messages and set updates", from, to)

end

function common.chat.retrieveLastNMessages(db, n)
    local lastId = common.chat.getLastId(db)
    return common.chat.retrieveMessagesBetweenIds(db, lastId - n, lastId)
end

function common.chat.setRequestsPast(db, sessionid, val)
    if tostring(val) == "true" then
        db:execute([[INSERT OR REPLACE INTO chatRequests (sessionid) VALUES (?);]], sessionid)
        print(sessionid, "requested old")
    else
        db:execute([[DELETE FROM chatRequests WHERE sessionid=?;]], sessionid)
        print("delted request from", sessionid)
    end
end

function common.chat.requestsPast(db, sessionid)
    return (db:fetchOne([[SELECT sessionid FROM chatRequests WHERE sessionid=?;]], sessionid) or {}).sessionid ~= Nil
end

local python3 = assert(unix.commandv('python3'))
-- capsh = assert(unix.commandv('capsh'))

local bash = assert(unix.commandv('bash'))
local strace
if common.isDevmode() then
    strace = assert(unix.commandv('strace'))
    bash = assert(unix.commandv('bash'))
end

function common.exec(prog, args, env, stderr)
	reader, writer = assert(unix.pipe())
	if assert(unix.fork()) == 0 then
        -- collect stdin
		unix.close(1)
		unix.dup(writer)

        -- collect stderr as well
        if stderr then
            unix.close(2)
            unix.dup(writer)
        end

        -- idk
        unix.close(writer)
		unix.close(reader)

        -- spawn process
		unix.execve(prog, args, env)
		unix.exit(127)
	else
		unix.close(writer)

		returnStr = ""

		while true do
			data, err = unix.read(reader)
			if data then
				if data ~= '' then
					returnStr = returnStr..data
				else
					break
				end
			elseif err:errno() ~= EINTR then
				Log(kLogWarn, tostring(err))
				break
			end
		end
		assert(unix.close(reader))
		assert(unix.wait())

		return returnStr
	end
end

function common.exec_with_stderr(prog, args, env)
    return common.exec(prog, args, env, true)
end

-- curl = assert(unix.commandv('curl'))
-- Log(kLogInfo, "found curl %s" % {curl})

local secrets = Slurp("/zip/secrets.json")
if secrets == Nil then secrets = {
        email="test@test.test",
        linkedin="https://linkedin.com/david",
        resume="/caca/resume.caca",
        turnstile_key="1x0000000000000000000000000000000AA",
        users = {
            test = "123123123",
            david = "123123123"
        },
        ntfyUrl = Nil
    }
else
    secrets = DecodeJson(secrets)
end

function common.replaceSaveSecretsUsers(db)
    for k,v in pairs(secrets.users) do
        common.userReplaceSave(db, k, v, "test@test.test")
    end
end

function common.sendNtfy(title, body)
    if secrets.ntfyUrl then
        Fetch(secrets.ntfyUrl,
            {
                method="POST",
                headers={
                    ["Title"] = title or "davidpineiro.xyz"
                },
                body=body
            }
        )
    else
        print("sendNtfy: %s, %s" % {title or "davidpineiro.xyz", body})
    end
end

common.validate = {}

function common.validate.passwordValidator(password)
    local valid, error = fm.makeValidator({
        {"password", minlen = 8, maxlen = 128, msg = "Password must be between 8 and 128 length."},
        ["all"] = true
    })({password=password})

    return valid or false, error
end

function common.validate.usernameValidator(username)
    local valid, error = fm.makeValidator({
        {"username", minlen = 1, maxlen = 64, msg = "Username must be between 1 and 64 length."},
        {"username", test = function(user) return user:match("^%w+$") end, msg = "Username must only contain numbers and/or letters."},
        ["all"] = true
    })({username=username})

    return valid or false, error
end

-- simpler, POSIX-safe regex
local emailRegex, err = re.compile(
  [[^[a-z0-9_'+.-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$]]
)

if err then
    print(string.format("email regex error '%s'", err:doc()))
end


function common.validate.emailValidate(email)
    if type(email) ~= "string" then
        return false, "Server error: email is not a string"
    end

    if #email > 200 then
        return false, "Email too long! Has to be shorter than 200 characters."
    end

    -- rule 1: no leading dot
    if email:match("^%.") then
        return false, "Email is invalid (starts with dot)"
    end

    -- rule 2: no consecutive dots
    if email:match("%.%.") then
        return false, "Email is invalid (contains consecutive dots)"
    end

    -- rule 3: basic structure via regex
    local search = emailRegex:search(email)
    if search ~= nil then
        return true, "Email is valid."
    else
        return false, "Email is invalid."
    end
end

function common.validate.emailUsernameValidate(email, username)
    -- print("%s %s" % {email, username})
    local valid, error = common.validate.emailValidate(email)

    if not valid then
        return valid, error
    else
        valid, error = common.validate.usernameValidator(username)

        return valid or false, error
    end
end

function common.validate.usernamePasswordValidator(params)
    local valid, error = fm.makeValidator({
        {"username", minlen = 1, maxlen = 64, msg = "Username must be between 1 and 64 length."},
        {"username", test = function(user) return user:match("^%w+$") end, msg = "Username must only contain numbers and/or letters."},
        {"password", minlen = 8, maxlen = 128, msg = "Password must be between 8 and 128 length."},
        ["all"] = true
    })(params)

    return valid or false, error
end

function common.usernameExists(db, username)
    local fetchUser = db:fetchOne("SELECT username FROM users WHERE username=?;", username)
    fetchUser = fetchUser.username and tostring(fetchUser.username) or Nil

    if fetchUser then
        return true, "Username exists."
    end

    return false, "Username does not exist."
end

function common.emailOrUsernameExists(db, email, username)
    local exists, msg = common.usernameExists(db, username)

    if exists then
        return true, msg
    end

    local fetchUser = db:fetchOne("SELECT email FROM users WHERE email=?;", email)
    fetchUser = fetchUser.email and tostring(fetchUser.email) or Nil

    if fetchUser then
        return true, "Email exists."
    end
    
    return false, "Email and username do not exist."
end

function common.getGlobal(db, id)
    return db:fetchOne([[SELECT data FROM globals WHERE id=?;]], id).data
end

function common.setGlobal(db, id, val)
    db:execute([[INSERT INTO globals (id, data) VALUES (?,?) %s ;]] % {common.onConflictUpsert('id', {'data'})}, id, val)
end

function common.updateGlobals(db)
    print('updating globals...')

    -- time-related things

    local mday = tostring(common.mday())
    local globalMday = common.getGlobal(db, "mday")
    if mday ~= globalMday then
        common.setGlobal(db, "mday", mday)
        db:execute([[DELETE FROM dailyEmailSends;]])
        db:execute([[DELETE FROM signups;]])
        db:execute([[DELETE FROM dailyIpSignups;]])

        common.setGlobal(db, "dailyGlobalSignups", 0)
    end

    local mon = tostring(common.month())
    local globalMon = common.getGlobal(db, "mon")
    if mon ~= globalMon then
        common.setGlobal(db, "mon", mon)
        db:execute([[DELETE FROM monthlyEmailSends;]])
    end

    -- chat things
    local chatSessionsCount = db:fetchOne([[SELECT count(*) FROM chatSessions;]])["count(*)"] or 0
    common.setGlobal(db, "chatSessions", chatSessionsCount)
    
end

local dig = assert(unix.commandv('dig'))
function common.unsafe.mxLookup(domain)
    local db <close> = common.getSqlConnection()

    domain = common.trim(domain:lower())

    local cachedResult = db:fetchOne([[SELECT result FROM emailLookups WHERE domain=?;]], domain).result

    if cachedResult ~= Nil then
        if cachedResult == 'true' then
            return true, "Domain has email server."
        else
            return false, "%s does not have an email dns record. Double check the email is correct pretty please. Or, you can send me an email and I can figure it out in due time (my email is on the home page in 'Socials')." % {domain}
        end
    end

    local digCommand = {dig, "mx", domain, "+short"}

    -- print("right before dig exec")
    local result = common.exec(dig, digCommand)

    print("dig command got '%s'" % {result})

    if result:match('no servers') or common.rmWhitespace(result) == '' then
        db:execute([[INSERT OR REPLACE INTO emailLookups (domain,result) VALUES (?,?);]], domain, 'false')
        return false, "%s does not have an email dns record. Double check the email is correct pretty please. Or, you can send me an email and I can figure it out in due time (my email is on the home page in 'Socials')." % {domain}
    else
        db:execute([[INSERT OR REPLACE INTO emailLookups (domain,result) VALUES (?,?);]], domain, 'true')
        return true, result
    end
end

-- NOTE: we need 'getmail6', 'msmtp', 'dig' from nixpkgs in path
local msmtp = assert(unix.commandv('msmtp'))
local printf = assert(unix.commandv('printf'))
function common.unsafe.sendEmail(recipient, subject, body)
    recipient = common.trim(recipient:lower())

    local valid, msg = common.validate.emailValidate(recipient)

    if valid then
        -- check domain to see if it has an mx record
        local domain = string.match(recipient, "@(%w+%.%w+)")
        valid, msg = common.unsafe.mxLookup(domain)

        if valid then
            local emailText = "Subject: %s\\n\\n%s" % {subject, body}
            local bashCommand = "cd mailer; %s '%s' | %s -C ./.msmtprc %s" % {printf, emailText, msmtp, recipient}
        
            print("ran bash command '%s'" % {bashCommand})

            local result = common.exec_with_stderr(bash, {bash, '-c', bashCommand})

            print("command result -> '%s'" % {result})
            -- idk yet
            if result == '' then
                return true, "Email sent."
            else
                return false, result
            end
        else
            return false, msg
        end
    else
        return false, msg
    end
end

common.signup = {}

function common.signup.fromEmailUsername(db, email, username)
    local result = db:fetchOne([[SELECT email, username, lastAttempt, code FROM signups WHERE email=? AND username=?;]],
    email, username) or {}

    return result.email or email, result.username or username, math.floor(tonumber(result.lastAttempt or 0)), result.code
end

function common.signup.setSignup(db, email, username, lastAttempt, code)
    db:execute([[INSERT OR REPLACE INTO signups (email, username, lastAttempt, code) VALUES (?,?,?,?);]],
    email, username, lastAttempt, code)
end

-- cooldowns per email
common.signup.cooldownSeconds = 30
common.signup.dailyEmailQuota = 5
common.signup.monthlyEmailQuota = 20

-- cooldowns for global signups
common.signup.dailyGlobalSignupQuota = 200

-- cooldowns per ip
common.signup.dailyIpSignupsQuota = 10

function common.signup.isEmailWhitelisted(db, email)
    return db:fetchOne([[SELECT email FROM signupEmailWhitelist WHERE email=?;]], email).email ~= Nil
end

function common.signup.sendNewSignupCode(email, username, ip)
    local db <close> = common.getSqlConnection()

    local whitelisted = common.signup.isEmailWhitelisted(db, email)

    local globalEmailSignups = 0
    local ipSignups = 0
    local dailyEmailSends = 0
    local monthlyEmailSends = 0

    if whitelisted == false then
        globalEmailSignups = tonumber(common.getGlobal(db, "dailyGlobalSignups") or 0)
        if globalEmailSignups > common.signup.dailyGlobalSignupQuota then
            return false, "Lots of people signed up today! Try again tomorrow! If this keeps happening email me with your email and I will whitelist you so you can signup without problems."
        end

        ipSignups = tonumber(db:fetchOne([[SELECT signups FROM dailyIpSignups WHERE ip=?;]], ip).signups or 0)
        if ipSignups > common.signup.dailyIpSignupsQuota then
            return false, "Hit maximum daily signup codes for your ip!. You can try again when the clock hits 12 PM!!"
        end

        dailyEmailSends = tonumber(db:fetchOne([[SELECT sends FROM dailyEmailSends WHERE email=?;]], email).sends or 0)
        if dailyEmailSends > common.signup.dailyEmailQuota then
            return false, "Hit maximum email sends for the day!"
        end

        monthlyEmailSends = tonumber(db:fetchOne([[SELECT sends FROM monthlyEmailSends WHERE email=?;]], email).sends or 0)
        if monthlyEmailSends > common.signup.monthlyEmailQuota then
            return false, "Hit maximum email sends for the whole MONTH!!!!!! Try again next month."
        end
    end

    local _, _, lastAttempt, code = common.signup.fromEmailUsername(db, email, username)

    local currentTime = math.floor(GetTime())

    -- print("usercode %s, usercooldown %d, now() %d, dailyEmailSends %d" % {code or "", lastAttempt, currentTime, dailyEmailSends or 0})
    
    local cooldownDiff = currentTime - lastAttempt

    -- print("code cooldownDiff seconds " .. tostring(cooldownDiff))
    
    if cooldownDiff > common.signup.cooldownSeconds then
        -- generate new code
        local code = tostring(math.abs(Rand64()) % 999999)

        common.signup.setSignup(db, email, username, currentTime, code)

        local emailBody = 
[[Hi,
This is an automated message.

The code for your account is: %s.

Thanks,
DavidPineiro.xyz.

-------------------------
If you did not register an account with https://davidpineiro.xyz then you can ignore this email. If you are still curious, then you can email me at %s with any questions.

Signup details
    email: %s
    username: %s
    ip: %s
]]
        emailBody = emailBody:gsub("\\","\\\\"):gsub("\n", "\\n"):format(code, secrets.email, email, username, ip)

        local emailSent, msg =
            common.unsafe.sendEmail(email, "Account Code", emailBody)
        --     true, "DEBUG"
        -- print("SEND EMAIL CODE email %s username %s send code %s" % {email, username, code})

        if emailSent then
            -- increment email sends
            db:execute([[INSERT OR REPLACE INTO dailyEmailSends (email, sends) VALUES (?,?);]],
                email, math.floor((dailyEmailSends)+1))

            db:execute([[INSERT OR REPLACE INTO monthlyEmailSends (email, sends) VALUES (?,?);]],
                email, math.floor((monthlyEmailSends)+1))

            db:execute([[INSERT OR REPLACE INTO dailyIpSignups (ip, signups) VALUES (?,?);]],
                ip, math.floor((ipSignups)+1))

            return true, "Sent email code."
        else
            return false, "Email might not have been sent. Error message: '%s'" % {msg}
        end

    else
        return false, "Wait %s seconds before sending new code." % {tostring(common.signup.cooldownSeconds - cooldownDiff)}
    end
end

function common.signup.validateCode(email, username, code)
    local db <close> = common.getSqlConnection()

    local _, _, lastAttempt, userCode = common.signup.fromEmailUsername(db, email, username)

    if userCode == code then
        return true, "Success, same code!"
    else
        return false, "Not the same code as in the email."
    end
end

function common.signup.validatePasswords(password1, password2)
    if password1 ~= password2 then
        return false, "Passwords need to be the same!"
    else
        passwordOk, passwordError = common.validate.passwordValidator(password1)
        if passwordOk ~= true then
            return false, passwordError
        end

        return true, "Passwords are both equal and valid!"
    end
end

function common.signup.tryCreateAccount(email, username, password)
    local db <close> = common.getSqlConnection()
    local accountExists, accountErrorMsg = common.emailOrUsernameExists(db, email, username)

    if accountExists == false then
        local valid, msg = common.signup.validatePasswords(password, password)

        if valid == true then
            common.userReplaceSave(db, username, password, email)
            
            local globalEmailSignups = tonumber(common.getGlobal(db, "dailyGlobalSignups") or 0)
            common.setGlobal(db, "dailyGlobalSignups", globalEmailSignups+1)
            
            db:execute([[DELETE FROM signupEmailWhitelist WHERE email=?;]], email)
            db:execute([[DELETE FROM signups WHERE email=?;]], email)

            return true, "Created Account"
        else
            return false, msg
        end

    else
        return false, accountErrorMsg
    end
end

function common.validateTurnstileKey(cf_response)
    successResult = false

    if type(cf_response) == "string" and #cf_response < 2048 then
        -- Log(kLogInfo, "cf validate. doing curl exec. response is %s chars long" % {#cf_response})
        fetchurl = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        fetchbody = "secret=%s&response=%s" % {secrets.turnstile_key, cf_response}

        -- Log(kLogInfo, "fetchurl '%s', fetchbody '%s'" % {fetchurl,fetchbody})

        status,errOrHeaders,body = Fetch(fetchurl,
            {
                method="POST",
                headers={
                    ["Content-Type"]="application/x-www-form-urlencoded"
                },
                body=fetchbody
            }
        )
        if status == 200 then
            -- Log(kLogInfo, "got status %s body '%s'" % {tostring(status), body})

            response = DecodeJson(body)

            successResult = response.success and tostring(response.success) or "false"
            -- Log(kLogInfo, "cf validate. performed curl exec. success '%s'" % {response.success})
        else
            Log(kLogInfo, "status %s, errOrHeaders '%s', body '%s'" % {tostring(status), errOrHeaders, tostring(body)})
        end
        
    end

    response = {
        success=successResult
    }

    return response
end

function common.validatePrivateInfoTurnstile(cf_response)
    response = common.validateTurnstileKey(cf_response)

    -- Log(kLogInfo, "success '%s'" % {response.success})

    if response.success == "true" then
        response.email = secrets.email
        response.linkedin = secrets.linkedin
        response.resume = secrets.resume
        -- Log(kLogInfo, "emailSecret '%s'" % {emailSecret})
    end

    return EncodeJson(response)
end

function common.generateHashedFromClear(clear)
    local salt = GetRandomBytes(16)
    local hashed = assert(argon2.hash_encoded(clear, salt, {
       variant = argon2.variants.argon2_id,
       m_cost = 65536,
       hash_len = 32,
       parallelism = 2,
       t_cost = 3,
     }))
     return hashed,EncodeBase64(salt)
end

function common.verifyClearWithHashed(hashed, clear)
    return argon2.verify(hashed, clear)
end

function common.checkUserPass(user, password)
    local db <close> = common.getSqlConnection()

    if type(user) ~= "string" then return false, "Username is not a string?" end
    if type(password) ~= "string" then return false, "Password is not a string?" end

    if common.userVerify(db, user, password) then
        return true, ""
    end
    return false, "That username and password does not exist!"
end

function common.check_caps()
    -- check if we have NET_ADMIN or NET_RAW
    -- local cap = common.exec(bash, {bash, "-c", "cat /proc/self/status | grep CapEff"})
    -- print(cap)q
    return {unsafe=false} end
--     cap = tonumber(cap:gsub("%D", ""))

--     local NET_ADMIN = (1 << 12)
--     local NET_RAW   = (1 << 13)

--     return {
--         net_admin = (cap & NET_ADMIN) ~= 0,
--         net_raw = (cap & NET_RAW) ~= 0,
--         unsafe = ((cap & NET_ADMIN) ~= 0) or ((cap & NET_RAW) ~= 0)
--     }
-- end

function common.forkCopyParty(port_)
    if unix.fork() == 0 then
        local port = port_ and port_ or "8082"

        -- check if we have "admin" privileges for netlink
        -- we need to make sure we DONT have those for safety >:)
        if common.check_caps().unsafe then
            print("unsafe! not starting copy party! we have NET_ADMIN or NET_RAW caps!")
            exit(127)
        end

        -- set limits on memory and cpu just in case
        assert(unix.setrlimit(unix.RLIMIT_RSS, 700*1024*1024)) -- 700 megabytes
        assert(unix.setrlimit(unix.RLIMIT_CPU, 10, 30)) -- soft 10 cpu seconds, hard 30 cpu seconds

        -- restrict file system
        assert(unix.unveil("./copyparty", "rwc"))
        assert(unix.unveil("/tmp", "rwc"))
        assert(unix.unveil("/etc", "r"))    
        assert(unix.unveil("/proc/self/mounts", "rc"))
        assert(unix.unveil("/run/current-system/sw/bin", "rx"))
        assert(unix.unveil("/nix/store", "rx"))
        assert(unix.unveil(nil, nil))

        -- syscall filtering
        promises =  "netlink unix inet anet tty stdio exec prot_exec proc rpath cpath wpath fattr flock"
        -- BUG: adding dns crashed the pledge call
        execpromises = promises

        -- TODO:
        -- [25218971.186136]audit: 
        -- type=1326 
        -- audit(1776209985.282:154): auid=4294967295 
        -- uid=1000 
        -- gid=994 
        -- ses=4294967295 
        -- subj=kernel 
        -- pid=2492144 
        -- comm="python3" 
        -- exe="/nix/store/dksjvr69ckglyw1k2ss1qgshhcix73p8-python3-3.12.8/bin/python3.12" 
        -- sig=31 
        -- arch=c000003e 
        -- syscall=16 
        -- compat=0 
        -- ip=0x7ff624d1368f 
        -- code=0x0

        print("before pledge")
		assert(unix.pledge(promises, execpromises,
            PLEDGE_PENALTY_RETURN_EPERM
            -- PLEDGE_PENALTY_KILL_THREAD
        ))

        -- unix.prctl_NO_NEW_PRIVS() -- this might be redundant cus pledge does this i think
		-- id = "/run/current-system/sw/bin/id"
		-- bash = "/run/current-system/sw/bin/bash"
		-- sh = "/bin/sh"
		-- coretuils = "coreutils"
		-- echo = "/run/current-system/sw/bin/echo"

        -- unix.execve(strace, {strace, bash, "-c", "echo hello"})

        print("starting copyparty")
		unix.execve(python3, {python3, "./copyparty/copyparty.pyz",
            "--rp-loc=/copyparty",
            "--xff-src=lan",
            "--rproxy", "1",
            "--no-fnugg",
            "--grid",
            "-v", "./copyparty/stuff::r",
            "-p", port,
            "--ses-db", "./copyparty/sessions.db",
            "--xf-proto-fb=http",
        })
        -- unix.execve(strace, {strace, "-f", "-e", "trace=ioctl",
        --     python3, "./copyparty/copyparty.pyz",
        --     "--rp-loc=/copyparty",
        --     "--xff-src=lan",
        --     "--rproxy", "1",
        --     "--no-fnugg",
        --     "--grid",
        --     "-v", "./copyparty/stuff::r",
        --     "-p", port,
        --     "--ses-db", "./copyparty/sessions.db",
        --     "--xf-proto-fb=http",
        -- })
	end
end

function common.serveReverseProxy(BACKEND, requestBody)
    local ip = GetRemoteAddr()
    local url = BACKEND
    local status, headers, body =
        Fetch(url,
            {method = GetMethod(),
            headers = {
                ['Accept'] = GetHeader('Accept'),
                ['CF-IPCountry'] = GetHeader('CF-IPCountry'),
                ['If-Modified-Since'] = GetHeader('If-Modified-Since'),
                ['Referer'] = GetHeader('Referer'),
                ['Sec-CH-UA-Platform'] = GetHeader('Sec-CH-UA-Platform'),
                ['User-Agent'] = GetHeader('User-Agent'),
                ['Content-Type'] = GetHeader('Content-Type'),
                ['X-Forwarded-For'] = FormatIp(ip)
            },
            body=requestBody
            })

    local RELAY_HEADERS_TO_CLIENT = {
        'Access-Control-Allow-Origin',
        'Cache-Control',
        'Connection',
        'Content-Type',
        'Accept',
        'Last-Modified',
        'Referrer-Policy',
    }

    if status then
        SetStatus(status)
        for k,v in pairs(RELAY_HEADERS_TO_CLIENT) do
            SetHeader(v, headers[v])
        end
        Write(body)
    else
        local err = headers
        Log(kLogError, "proxy failed %s, url %s" % {err, url})
        ServeError(503)
    end
end

return common