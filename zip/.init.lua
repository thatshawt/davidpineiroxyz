local common = require "common"

local fm = require "fullmoon"
local unix = require 'unix'

date = assert(unix.commandv('date'))
local dateString = common.exec(date)
dateString = dateString:sub(1, #dateString - 1) -- remove last char


Log(kLogInfo, "got date string '%s'" % {dateString})

devMode = common.isDevmode()
Log(kLogInfo, "devmode '%s'" % {tostring(devMode)})
if devMode then
	fm.setTemplateVar("turnstile_key", "1x00000000000000000000AA")
else
	fm.setTemplateVar("turnstile_key", "0x4AAAAAACwAfT1Q_QwaUX-3")
end

-- load users from secrets and init sql
do
	local db <close> = common.getSqlConnection()
    common.sqlInit(db)

	-- print("id=1 message ",db:fetchOne([[select message from chats where id=1;]]).message)
	
	common.replaceSaveSecretsUsers(db)

	common.chat.setTestMessages(db)
	-- print("id=1 message ",db:fetchOne([[select message from chats where id=1;]]).message)
end

fm.setTemplateVar("serverStartDate", dateString)

-- .fmt files loaded from /views/ folder
local thing = fm.setTemplate({"/views/", fmt = "fmt"})

-- add all the routes .fmt templates from the /views/routes folder
for k,v in pairs(thing) do
	-- fm.logInfo(k.." = "..tostring(v))
	if common.starts_with(k, "routes/") then
		local routePath = "/"..k:sub(- (#k - #"routes/"))
		-- fm.logInfo("adding route: "..routePath.." -> "..k)
		fm.setRoute({routePath, method = {"GET"}}, fm.serveContent(k))
    end
end

fm.setRoute({"/", method = {"GET"}}, fm.serveContent("routes/index"))
fm.setRoute({"/index.html", method = {"GET"}}, fm.serveContent("routes/index"))

-- static files like css and fonts
fm.setRoute("/static/*", fm.serveAsset)

-- validate the email cloudlflare turnstile
fm.setRoute({"/getInfo", method = {"POST"}},
  function(r)
	cf_response = tostring(r.params["cf-turnstile-response"]) or ""
	
	postResponse = common.validatePrivateInfoTurnstile(cf_response)
	
	-- fm.logInfo("returned '%s'" % {postResponse})
	return postResponse
end)

-- login
fm.setRoute({"/login", method = {"POST"}},
	function(r)
		-- if already logged in
		if r.session and r.session.user then
			return fm.serveContent("routes/login", {message = "You are already logged in with '%s'. Log out if you want to login to another account." % {r.session.user}})
		end

		-- make sure username and password are alphanumeric and stuff
		local valid, error = common.validate.usernamePasswordValidator(r.params)

		if valid == true then
			-- validate turnstile
			local cf_response = tostring(r.params["cf-turnstile-response"]) or ""
			local turnstileValid = common.validateTurnstileKey(cf_response).success
			
			if turnstileValid then
				-- check user and pass combo
				valid, error = common.checkUserPass(r.params.username, r.params.password)
			else
				valid = false
				error = "cloudflare turnstile invalid?"
			end
		end

		if valid == true then -- success
			r.session.chatSession = Nil
			r.session.user = r.params.username

			if r.session.user == 'david' then
				r.session.isAdmin = true
			end

			return fm.serveRedirect(302, "/") 
		else -- fail
			return fm.serveContent("routes/login", {message = error})
		end
	end
)

-- logout
fm.setRoute({"/logout", method = {"POST"}},
	function (r)
		-- r.session.user = {}
		r.session = {}

		return fm.serveRedirect(302, "/") 
	end
)

-- signup
fm.setRoute({"/signup", method = {"GET"}},
	function (r)
		return fm.serveContent("routes/signup", {signup1 = true})
	end)

fm.setRoute({"/signup", method = {"POST"}},
	function(r)
		-- if already logged in
		if r.session and r.session.user then
			return fm.serveContent("routes/logout", {message = "You are already logged in with '%s'. Log out!!! NOWWWWWW!!!!! ROOOOOOAAAARRRRRRRRR O.o YYYYYEEEEAAAAAAHHHHHH" % {r.session.user}})
		end

		r.params.email = common.trim(r.params.email:lower())

		-- make sure email and username are goody good
		local valid, error = common.validate.emailUsernameValidate(r.params.email, r.params.username)

		if valid == true then
			-- validate turnstile
			local cf_response = tostring(r.params["cf-turnstile-response"]) or ""
			local turnstileValid = common.validateTurnstileKey(cf_response).success
			
			local db <close> = common.getSqlConnection()
			if turnstileValid or common.signup.isEmailWhitelisted(db, r.params.email) then
				-- check if email or username exists
				local existsAlready, msg = common.emailOrUsernameExists(db, r.params.email, r.params.username)

				if existsAlready then
					valid = false
				end
				error = msg
			else
				valid = false
				error = "cloudflare turnstile invalid?"
			end
		end

		-- try to send email code
		if valid == true then
			valid, error = common.signup.sendNewSignupCode(r.params.email, r.params.username, FormatIp(GetRemoteAddr()))
		end

		if valid == true then -- success
			r.session.signupStage = "code"
			return fm.serveContent("routes/signup", {
				message = "Check your email for the code and paste it below.",
				email = r.params.email,
				username = r.params.username,
				signup2 = true
			})
		else -- fail
			return fm.serveContent("routes/signup", {message = error, signup1 = true})
		end
	end
)

--TODO user reset password

-- chat requestOld
fm.setRoute({"/chat/requestOld", method = {"POST"}},
	function (r)
		local chatSession = r.session.chatSession
		if chatSession ~= Nil and chatSession ~= "" then
			local db <close> = common.getSqlConnection()

			common.chat.setRequestsPast(db, chatSession, true)

			return fm.serveResponse(200, Nil, "")
		else
			return fm.serveResponse(400, Nil, "It broke. Please refresh the page :P")
		end
	end
)

-- chat requestOld
fm.setRoute({"/chat/heartbeat", method = {"POST"}},
	function (r)
		local chatSession = r.session.chatSession
		if chatSession ~= Nil and chatSession ~= "" then
			local db <close> = common.getSqlConnection()

			common.chat.beatHeart(db, chatSession)

			return fm.serveResponse(200, Nil, "")
		else
			return fm.serveResponse(400, Nil, "It broke. Please refresh the page :P")
		end
	end)

-- TODO: add a profile page for users where they can set their bio i suppose.

-- sse
fm.setRoute("/sse",
	function (r)
		local db <close> = common.getSqlConnection()

		-- TODO, self redact option, client can ask server to redact messages sent by user logged into client.
		-- /chat/selfRedact
		-- common.chat.trySelfRedact(db, username, messageChatId)

		local chatSession = common.chat.createSession(db)
		r.session.chatSession = chatSession

		local msgsPerThing = 20 -- messages sent per sse event thing
		local currentFutureId = math.max(1, common.chat.getLastId(db) - msgsPerThing) -- start behind a little so we send some to start
		common.chat.setFutureId(db, chatSession, currentFutureId)

		local currentPastId = math.max(1, currentFutureId)
		common.chat.setPastId(db, chatSession, currentPastId)
		while(true) do
			local sessionData = common.chat.getSession(db, chatSession)
			currentPastId = sessionData.pastid
			currentFutureId = sessionData.futureid

			-- get next latest id as far as msgsPerThing ids after current one.
			local futureId = math.min(common.chat.getLastId(db), currentFutureId+msgsPerThing)
			local pastId = math.max(1, currentPastId-msgsPerThing)

			local data = {}

			-- print("futureid %d currentid %d" % {futureId, currentMsgId})
			-- send new messages in real time
			if futureId ~= currentFutureId then
				-- print("sending between %d and %d" % {currentFutureId, futureId})
				local messages
				if currentFutureId == 1 then
					messages = common.chat.retrieveMessagesBetweenIds(db, currentFutureId, futureId)
				else
					messages = common.chat.retrieveMessagesBetweenIds(db, currentFutureId+1, futureId)
					-- currentFutureId+1 because if not, then it will include the previous message
				end
	
				currentFutureId = futureId
				common.chat.setFutureId(db, chatSession, currentFutureId)
	
				data.future = messages
			end

			-- only send older messages if requested
			-- print("chatsession", chatSession, "currentPastId", currentPastId)
			if common.chat.requestsPast(db, chatSession) and currentPastId ~= pastId then
				common.chat.setRequestsPast(db, chatSession, false)
				local messages = common.chat.retrieveMessagesBetweenIds(db, pastId, currentPastId-1, true)

				currentPastId = pastId
				common.chat.setPastId(db, chatSession, currentPastId)

				data.past = messages
			end

			local updatedMessages = common.chat.getSessionUpdatedMessages(db, chatSession)
			-- print("updates:",tostring(updatedMessages), #updatedMessages)
			-- for k,v in pairs(updatedMessages) do
			-- 	print(tostring(k)," ",tostring(v))
			-- end
			if #updatedMessages > 0 then
				print("updated messages detected!", chatSession)
				data.updates = updatedMessages

				common.chat.clearSessionUpdates(db, chatSession)
				print("cleared session updates!", chatSession)
			end

			local sessionCount = db:fetchOne([[SELECT data FROM globals WHERE id='chatSessions';]]).data
			data.sessionCount = sessionCount

			-- send the data
			if data ~= {} then
				fm.streamContent("sse", {
					data = EncodeJson(data)
				})
			end

			-- exit if heartbeat is dead
			if common.chat.isHeartbeatDead(db, chatSession) then
				print("session %s heartbeat died" % {chatSession})
				break
			end

			-- wait 1 second
      		local remseconds, remnanos = unix.nanosleep(1)
			if remseconds == Nil then -- interrupted
				print("chat session interrupted")
				break
			end
		end

		print("removed chatsession %s" % {chatSession})

		common.chat.removeSession(db, chatSession)

		-- http 204 is supposed to stop sse i think...
		return fm.serve204
	end)

-- user chat send message
fm.setRoute({"/chat/sendMessage", method = {"POST"}},
	function (r)
		-- print("invalid is %s" % {tostring(r.session._invalid)})
		-- print("user is %s" % {tostring(r.session.user)})

		if r.session.user == Nil then
			return fm.serveResponse(400, Nil, "Log in to chat!")
		end

		if r.params.message == Nil or #tostring(r.params.message) == 0 then
			return fm.serveResponse(400, Nil, "Message required!")
		end

		local db <close> = common.getSqlConnection()

		local userBanned = common.chat.isUserBanned(db, r.session.user)
		if userBanned then
			return fm.serveResponse(400, Nil, "You are banned ;-;")
		end

		-- TODO rate limit here

		-- print("sent message %s" % {(r.params.message)})
		common.chat.insertNewMessage(db, r.session.user, tostring(r.params.message:sub(1,90)))

		return fm.serveResponse(200, Nil, "")
	end)

-- signupCodeResend
fm.setRoute({"/signupCodeResend", method = {"POST"}},
	function (r)
		if r.session.signupStage ~= "code" then
			return fm.serveContent("routes/signup", {
				signup1 = true})
		end

		r.params.email = common.trim(r.params.email:lower())

		-- sendNewSignupCode can fail cus the cooldown
		valid, error = common.signup.sendNewSignupCode(r.params.email, r.params.username, FormatIp(GetRemoteAddr()))

		if valid == true then
			return fm.serveContent("routes/signup", {
				message = "Sent email again. It might take a few minutes to send, also dont forget to check spam folder just incase.",
				email=r.params.email,
				username=r.params.username,
				signup2 = true})
		else
			return fm.serveContent("routes/signup", {
				message = error,
				email=r.params.email,
				username=r.params.username,
				signup2 = true})
		end
	end)

-- signupCode
fm.setRoute({"/signupCode", method = {"POST"}},
	function (r)
		if r.session.signupStage ~= "code" then
			return fm.serveContent("routes/signup", {
				signup1 = true})
		end

		r.params.email = common.trim(r.params.email:lower())

		-- try to validate the code
		valid, error = common.signup.validateCode(r.params.email, r.params.username, r.params.code)

		-- if valid code send them to next step
		if valid == true then
			r.session.signupStage = "pass"
			return fm.serveContent("routes/signup", {
				message = "Code is valid! Now type your password to create your account." % {r.params.username},
				email = r.params.email,
				username = r.params.username,
				code = r.params.code,
				signup3 = true
			})
		else -- otherwise show the error
			return fm.serveContent("routes/signup", {
				message = error,
				email = r.params.email,
				username = r.params.username,
				signup2 = true})
		end

	end)

-- signupPassword
fm.setRoute({"/signupPassword", method = {"POST"}},
	function (r)
		if r.session.signupStage ~= "pass" then
			return fm.serveContent("routes/signup", {
				signup1 = true})
		end

		r.params.email = common.trim(r.params.email:lower())

		-- validate passwords
		valid, error = common.signup.validatePasswords(r.params.password1, r.params.password2)

		-- print("we got", tostring(valid), tostring(error))

		-- serve error
		if valid == false then
			return fm.serveContent("routes/signup", {
				message = error,
				email = r.params.email,
				username = r.params.username,
				code = r.params.code,
				signup3 = true})
		end

		-- try to create account
		valid, error = common.signup.tryCreateAccount(r.params.email, r.params.username, r.params.password1)

		-- if account created, log them in
		if valid then
			r.session.user = r.params.username
			r.session.signupStage = Nil

			return fm.serveRedirect(302, "/")
		else -- otherwise show the error
			return fm.serveContent("routes/signup", {
				message = error,
				email = r.params.email,
				username = r.params.username,
				code = r.params.code,
				signup3 = true})
		end
	end)

-- post admin routes
fm.setRoute({"/admin/:action", method = {"POST"}},
	function (r)
		if r.session.isAdmin ~= true then
			return fm.serveRedirect(302, "/")
		end

		local db <close> = common.getSqlConnection()

		local actions = {
			["unbanSelfSignupIp"] = function ()
				local ip = FormatIp(GetRemoteAddr())
				db:execute([[DELETE FROM dailyIpSignups WHERE ip=?;]], ip)
				return fm.serveContent("routes/admin", {message="unbanned '%s'" % {ip}})
			end,
			["deleteUser"] = function ()
				local username = r.params.username

				if username == Nil or username == '' then
					return fm.serveContent("routes/admin", {message="You didnt specify a user."})
				end

				local userExists, msg = common.usernameExists(db, username)

				if userExists == false then
					return fm.serveContent("routes/admin", {message="User '%s' doesnt exist!" % {username}})
				end

				common.deleteUser(db, username)

				return fm.serveContent("routes/admin", {message="Deleted user '%s'!" % {username}})
			end,
			["whitelistEmailSignup"] = function ()
				local email = r.params.email

				if type(email) ~= "string" or email == '' then
					return fm.serveContent("routes/admin", {message="you didnt put an email to whitelist :/"})
				end

				local valid, msg = common.validate.emailValidate(email)

				if valid == false then
					return fm.serveContent("routes/admin", {message=msg})
				end

				db:execute([[INSERT OR REPLACE INTO signupEmailWhitelist (email) VALUES (?);]], email)
				
				return fm.serveContent("routes/admin", {message="whitelisted %s" % {email}})
			end,
			["chatBanUser"] = function ()
				local username = r.params.username

				if username == Nil or username == '' then
					return fm.serveContent("routes/admin", {message="You didnt specify a user."})
				end

				common.chat.banUser(db, username)

				return fm.serveContent("routes/admin", {message="banned user from chatting if they exist"})
			end,

			["chatUnbanUser"] = function ()
				local username = r.params.username

				if username == Nil or username == '' then
					return fm.serveContent("routes/admin", {message="You didnt specify a user."})
				end

				common.chat.unbanUser(db, username)

				return fm.serveContent("routes/admin", {message="UNbanned user from chatting if they exist"})
			end,
			["redactUserChats"] = function ()
				local username = r.params.username

				if username == Nil or username == '' then
					return fm.serveContent("routes/admin", {message="You didnt specify a user."})
				end

				common.chat.replaceAllUserMessages(db, username, "█REDACTED█")

				return fm.serveContent("routes/admin", {message="redacted user %s chat messages!" % {username}})
			end,
			["redactChatsFromTo"] = function ()
				local from = r.params.from
				local to = r.params.to

				if from == Nil or to == Nil or from == '' or to == '' then
					return fm.serveContent("routes/admin", {message="missing 'from' or 'to'"})
				end

				common.chat.replaceMessagesFromTo(db, from, to, "█REDACTED█")

				return fm.serveContent("routes/admin", {message="redacted from %s to %s" % {from, to}})
			end,
		}

		local action = r.params.action

		if actions[action] then
			return actions[action]()
		else
			return fm.serveRedirect(302, "/")
		end

	end)

-- get admin routes
fm.setRoute({"/admin/:action", method = {"GET"}},
	function (r)
		if r.session.isAdmin ~= true then
			return fm.serveRedirect(302, "/")
		end

		local db <close> = common.getSqlConnection()

		local actions = {
			["listAllGlobals"] = function ()
				local globals = db:fetchAll([[SELECT * FROM globals;]])

				local message = ""

				for k,v in pairs(globals) do
					-- for k,v in pairs(v) do
					-- 	print("%s %s" % {tostring(k),tostring(v)})
					-- end
					message = message.."\nid: '%s', data:'%s'" % {tostring(v.id), tostring(v.data)}
				end

				return fm.serveContent("routes/admin", {message=message})
			end,
			["userCount"] = function ()
				local userCount = db:fetchOne([[SELECT count(*) FROM users;]])["count(*)"]
				return fm.serveResponse(200, Nil, tostring(userCount))
			end,
			["listAllUsers"] = function ()
				local users = db:fetchAll([[
					SELECT
						users.username AS userUsername,
						users.email AS email,
						bannedChatUsers.username AS bannedUser
					FROM users
					LEFT JOIN bannedChatUsers ON userUsername = bannedUser
					;]])

				local message = ""

				for k,v in pairs(users) do
					-- for k,v in pairs(v) do
					-- 	print("%s %s" % {tostring(k),tostring(v)})
					-- end
					message = message.."\nuser:'%s' email:'%s' bannedFromChat:'%s'" % {tostring(v.userUsername), tostring(v.email), tostring(v.bannedUser)}
				end

				return fm.serveContent("routes/admin", {message=message})
			end,
			["listSingleUser"] = function ()
				local username = r.params.username

				if username == Nil or username == '' then
					return fm.serveContent("routes/admin", {message="You didnt specify a user."})
				end

				local userInfo = db:fetchOne([[
					SELECT
						users.username AS userUsername,
						users.email AS email,
						bannedChatUsers.username AS bannedUser
					FROM users
					LEFT JOIN bannedChatUsers ON userUsername = bannedUser
					WHERE userUsername=?
					;]], username)

				local message = "user:'%s' email:'%s' banned:'%s'" % {tostring(userInfo.userUsername), tostring(userInfo.email), tostring(userInfo.bannedUser)}

				return fm.serveContent("routes/admin", {message=message})
			end,
			["chatMessagesFromTo"] = function ()
				local from = r.params.from
				local to = r.params.to

				if from == Nil or to == Nil or from == '' or to == '' then
					return fm.serveContent("routes/admin", {message="missing 'from' or 'to'"})
				end

				local chats = common.chat.retrieveMessagesBetweenIds(db, from, to)

				local message = ""

				for k,v in pairs(chats) do
					message = message.."\n%s,%s~%s | %s" % {v.id, v.username, v.message, v.timestamp}
				end

				return fm.serveContent("routes/admin", {message=message})
			end,
		}
		
		local action = r.params.action

		if actions[action] then
			return actions[action]()
		else
			return fm.serveRedirect(302, "/")
		end

	end)

echo = assert(unix.commandv('echo'))

-- start copyparty
local copyPartyPort = "8082"
common.forkCopyParty(copyPartyPort)
-- common.sendNtfy("copyparty", "started!")

-- /copyparty -> /copyparty/*
fm.setRoute("/copyparty", "/copyparty/")
-- /copyparty/* |rvrs-proxy> http://internalcopyparty/
fm.setRoute("/copyparty/*copyparty",
	function(r)
		-- local path = EscapePath(r.params.splat and r.params.splat or "/")
		local parsedGetUrl = ParseUrl(GetUrl())
		-- print(GetUrl())
		local replaceUrl
		if parsedGetUrl.port then
			replaceUrl = "%s://%s:%s"%{parsedGetUrl.scheme, parsedGetUrl.host, parsedGetUrl.port}
		else
			replaceUrl = "%s://%s"%{parsedGetUrl.scheme, parsedGetUrl.host}
		end
		-- print(replaceUrl)
		-- local path = EscapePath(r.params.copyparty and r.params.copyparty or "/")
		local path = string.gsub(GetUrl(), replaceUrl, "", 1)
		if common.starts_with(path, "/") == false then path = "/"..path end
		-- print("serving reverse proxy path %s" % {path})
		common.serveReverseProxy("http://127.0.0.1:%s%s" % {copyPartyPort, path}, GetBody() )
		return true
	end)

-- catch requests from copyparty forked server
fm.setRoute("/*copyparty",
	function(r)
		local referer = GetHeader('Referer')
		-- print("got referer %s" % {referer})
		if referer == Nil or referer == "" then return false end
		-- print("catchall copyparty referer'%s' path'%s'" % {GetUrl(),referer})

		referer = ParseUrl(referer).path
		-- print("got referer path %s" % {referer})
		-- print("ParseUrl(GetHeader('Referer')):")
		-- for k,v in pairs(ParseUrl(GetHeader('Referer'))) do
		-- 	print("%s = %s"%{k,v})
		-- end
		if referer == Nil then return false end

		-- skip unsafe urls i think...
		if IsAcceptablePath(referer) == false then return false end
		-- print("acceptable")

		local copyparty = common.starts_with(referer, '/copyparty/') or referer == "/copyparty"
		if copyparty == false then return false end
		
		-- print("GetUrl() = %s" % {GetUrl()})
		-- print("ParseUrl(GetUrl()):")
		-- for k,v in pairs(ParseUrl(GetUrl()))
		-- 	do print("%s = %s"%{k,v}) end

		-- print("r.params:")
		-- for k,v in pairs(r.params)
		-- 	do print("%s = %s" % {k,v}) end

		local parsedGetUrl = ParseUrl(GetUrl())
		-- local path = EscapePath(r.params.copyparty and r.params.copyparty or "/")
		local path
		if parsedGetUrl.port then
			path = string.gsub(GetUrl(), "%s://%s:%s"%{parsedGetUrl.scheme, parsedGetUrl.host, parsedGetUrl.port}, "", 1)
		else
			path = string.gsub(GetUrl(), "%s://%s"%{parsedGetUrl.scheme, parsedGetUrl.host}, "", 1)
		end
		if common.starts_with(path, "/") == false then path = "/"..path end

		local internalPath = "/copyparty%s" % {path}
		-- print("serving internal %s" % {internalPath})
		common.serveReverseProxy("http://127.0.0.1:8080%s" % {internalPath})
		
		return true
	end)

function OnWorkerStart()
    -- set limits on memory and cpu just in case
    assert(unix.setrlimit(unix.RLIMIT_RSS, 2*1024*1024)) -- 2 megabytes
    assert(unix.setrlimit(unix.RLIMIT_CPU, 5, 10))
	
	-- restrict file system
	assert(unix.unveil(".", "rwc"))
	assert(unix.unveil("/tmp", "rwc"))
	assert(unix.unveil("/etc", "rc"))
	assert(unix.unveil("/proc/self/mounts", "rc"))
	assert(unix.unveil("/run/current-system/sw/bin", "rx"))
	assert(unix.unveil("/nix/store", "rx"))
	assert(unix.unveil("/dev/null", "rw"))
	assert(unix.unveil(nil, nil))

	-- restrict system calls
	-- promises = "stdio vminfo unveil tmppath id dpath settime exec prot_exec proc settime rpath cpath wpath inet anet dns fattr tty flock recvfd sendfd chown"
	-- promises = "stdio rpath cpath wpath inet dns flock recvfd sendfd"
	-- promises = "rpath exec prot_exec"
	-- execpromises = "stdio rpath cpath wpath inet dns unix flock recvfd sendfd"
	-- execpromises = promises
	-- assert(unix.pledge())
	-- assert(unix.pledge(promises, execpromises, PLEDGE_PENALTY_RETURN_EPERM))
end

-- strace = assert(unix.commandv('strace'))
function OnWorkerStop()
end

fm.setSchedule("0-59/15 * * * *", function()
	local db <close> = common.getSqlConnection()

	-- "refresh" email lookup cache
	db:execute([[DELETE FROM emailLookups;]])
end)

fm.setSchedule("* * * * *", function()
	local db <close> = common.getSqlConnection()

	common.chat.deleteSuperDeadSessions(db)

	common.updateGlobals(db)
end)

do
	local db <close> = common.getSqlConnection()
	common.chat.deleteSuperDeadSessions(db)
	common.updateGlobals(db)
end

common.sendNtfy("davidpineiro.xyz","Ready!")
-- print("id=1 message ",db:fetchOne([[select message from chats where id=1;]]).message)

fm.run()