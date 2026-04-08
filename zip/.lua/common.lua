local common = {}

local fm = require "fullmoon"
local argon2 = require 'argon2'

common.databaseFile = 'database.db'

-- local db <close> = common.getSqlConnection()
function common.getSqlConnection()
    return fm.makeStorage(common.databaseFile, [[PRAGMA journal_mode=WAL;PRAGMA synchronous=NORMAL;]])
end

function common.sqlInit(db)
    db:exec([[CREATE TABLE users (username TEXT PRIMARY KEY, password TEXT NOT NULL);]])
end

function common.userReplaceSave(db, username, cleartextPassword)
    local hashedPass, passSalt = common.generateHashedFromClear(cleartextPassword)
    -- local hashedUser, userSalt = common.generateHashedFromClear(username)

    local changed = db:exec("INSERT INTO users VALUES ('%s', '%s');" % {username, hashedPass}) or 0
    changed = changed + (db:exec("UPDATE users SET password='%s' WHERE username='%s';" % {hashedPass, username}) or 0)
    
    if changed == 0 then
        fm.logInfo("failed to generate: username '%s', password '%s'" % {username, hashedPass})
    else
        fm.logInfo("generated user: username '%s', password '%s'" % {username, hashedPass})
    end
end

function common.userVerify(db, username, cleartextPass)
    -- local result = assert(db:fetchAll[[SELECT password FROM users;]])

    -- fm.logInfo("SELECT password FROM users WHERE username='david':")
    -- for k,v in pairs(result) do
    --     if type(v) == "table" then
    --         fm.logInfo(k.." is table:")
    --         for k,v in pairs(v) do
    --             fm.logInfo("    "..k.." = "..tostring(v))
    --         end
    --     else
    --         fm.logInfo(k.." = "..tostring(v))
    --     end
    -- end

    local hashed = db:fetchOne("SELECT password FROM users WHERE username='%s';" % {username})
    
    hashed = hashed and tostring(hashed.password) or Nil

    -- fm.logInfo("found hashed %s" % {tostring(hashed)})

    if hashed == Nil then return false end

    return common.verifyClearWithHashed(hashed, cleartextPass)
end

function common.starts_with(str, start)
   return str:sub(1, #start) == start
end

function common.ends_with(str, ending)
   return ending == "" or str:sub(-#ending) == ending
end

common.stringtobool={ ["true"]=true, ["false"]=false }

function common.exec(prog, args, env)
	reader, writer = assert(unix.pipe())
	if assert(unix.fork()) == 0 then
		unix.close(1)
		unix.dup(writer)
		unix.close(writer)
		unix.close(reader)
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

-- curl = assert(unix.commandv('curl'))
-- Log(kLogInfo, "found curl %s" % {curl})

local secrets = Slurp("/zip/secrets.json")
if secrets == Nil then secrets = {
        email="test@test.test",
        linkedin="https://linkedin.com/david",
        resume="/caca/resume.caca",
        turnstile_key="1x0000000000000000000000000000000AA",
        users = {
            test = "123123123"
        }
    }
else
    secrets = DecodeJson(secrets)
end

function common.loadSecretsUsers(db)
    for k,v in pairs(secrets.users) do
        common.userReplaceSave(db, k, v)
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

function common.usernamePasswordValidator(params)
    local valid, error = fm.makeValidator({
        {"username", minlen = 1, maxlen = 64, msg = "Username must be between 1 and 64 length."},
        {"username", test = function(user) return user:match("^%w+$") end, msg = "Username must only contain numbers and/or letters."},
        {"password", minlen = 8, maxlen = 128, msg = "Password must be between 8 and 128 length."},
        ["all"] = true
    })(params)

    -- local fullError = ""
    -- if valid ~= true then
    --     for k,v in pairs(error) do
    --         fullError = fullError.." "..tostring(v)
    --     end
    --     --remove final \n
    --     fullError = fullError:sub(1, #fullError - 1)
    --     error = fullError
    -- end
    return valid, error
end

return common