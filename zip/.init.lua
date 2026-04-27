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

	common.replaceSaveSecretsUsers(db)
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
		local valid, error = common.usernamePasswordValidator(r.params)

		if valid then
			-- validate turnstile
			local cf_response = tostring(r.params["cf-turnstile-response"]) or ""
			local turnstileValid = common.validateTurnstileKey(cf_response) == "true"
			
			if turnstileValid then
				-- check user and pass combo
				valid, error = common.checkUserPass(r.params.username, r.params.password)
			else
				valid = false
				error = "cloudflare turnstile invalid?"
			end
		end

		if valid then -- success
			r.session.user = r.params.username
			return fm.serveRedirect(302, "/") 
		else -- fail
			return fm.serveContent("routes/login", {message = error})
		end
	end
)

-- logout
fm.setRoute({"/logout", method = {"POST"}},
	function (r)
		r.session = {}

		return fm.serveRedirect(302, "/") 
	end
)

-- signup
fm.setRoute({"/signup", method = {"GET"}},
	function (r)
		return fm.serveContent("routes/signup", {signup1 = true})
	end
)

fm.setRoute({"/signup", method = {"POST"}},
	function(r)
		-- if already logged in
		if r.session and r.session.user then
			return fm.serveContent("routes/logout", {message = "You are already logged in with '%s'. Log out!!! NOWWWWWW!!!!! ROOOOOOAAAARRRRRRRRR O.o YYYYYEEEEAAAAAAHHHHHH" % {r.session.user}})
		end

		-- make sure email and username are goody good
		local valid, error = common.emailUsernameValidate(r.params.email, r.params.username)

		if valid then
			-- validate turnstile
			local cf_response = tostring(r.params["cf-turnstile-response"]) or ""
			local turnstileValid = common.validateTurnstileKey(cf_response).success
			
			if turnstileValid then
				local db <close> = common.getSqlConnection()
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
		if valid then
			valid, error = common.signup.sendNewSignupCode(r.params.email, r.params.username)
		end

		if valid then -- success
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

-- signupCodeResend
fm.setRoute({"/signupCodeResend", method = {"POST"}},
	function (r)
		-- sendNewSignupCode can fail cus the cooldown
		valid, error = common.signup.sendNewSignupCode(r.params.email, r.params.username)

		if valid then
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
	end
)

-- signupCode
fm.setRoute({"/signupCode", method = {"POST"}},
	function (r)
		-- try to validate the code
		valid, error = common.signup.validateCode(r.params.username, r.params.code)

		-- if valid code send them to next step
		if valid then
			return fm.serveContent("routes/signup", {
				message = "Code is valid! Now type your password to create your account." % {r.params.username},
				email = r.params.email,
				username = r.params.username,
				code = r.params.code,
				signup3 = true
			})
		else -- otherwise show the error
			return fm.serveContent("routes/signup", {message = error,
				email = r.params.email,
				username = r.params.username,
				signup2 = true})
		end

	end
)

-- signupPassword
fm.setRoute({"/signupPassword", method = {"POST"}},
	function (r)
		-- validate passwords
		valid, error = common.signup.validatePasswords(r.params.password1, r.params.password2)

		-- serve error
		if valid == false then
			return fm.serveContent("routes/signup", {message = error,
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

			return fm.serveRedirect(302, "/")
		else -- otherwise show the error
			return fm.serveContent("routes/signup", {message = error,
				email = r.params.email,
				username = r.params.username,
				code = r.params.code,
				signup3 = true})
		end
	end
)

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
    assert(unix.setrlimit(unix.RLIMIT_CPU, 2))
	
	-- restrict file system
	assert(unix.unveil(".", "rwc"))
	assert(unix.unveil("/tmp", "rwc"))
	assert(unix.unveil("/etc", "r"))
	assert(unix.unveil("/proc/self/mounts", "rc"))
	assert(unix.unveil("/run/current-system/sw/bin", "rx"))
	assert(unix.unveil("/nix/store", "rx"))
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
	-- promises = "debug stdio proc vminfo unveil tmppath id dpath settime exec prot_exec settime rpath cpath wpath inet anet dns fattr tty flock recvfd sendfd chown"

	-- if unix.fork() == 0 then
	-- 	-- assert(unix.pledge(promises))
	-- 	id = "/run/current-system/sw/bin/id"
	-- 	bash = "/run/current-system/sw/bin/bash"
	-- 	sh = "/bin/sh"
	-- 	coretuils = "coreutils"
	-- 	echo = "/run/current-system/sw/bin/echo"
	-- 	-- unix.execve(echo, {echo, "hello"})
	-- 	-- unix.execve(strace, {strace, echo, "hello"})
	-- 	-- unix.execve(sh, {sh, "-c", "echo hello"})
	-- 	-- unix.execve(bash, {bash, "-c", "echo hello"})
	-- 	-- unix.execve(echo, {echo, "hello"})
	-- 	-- unix.execve(coretuils, {coretuils, "--coreutils-prog=echo", "hello"})
	-- 	unix.exit(127)
	-- end
	-- unix.wait()
end

common.sendNtfy("davidpineiro.xyz","Ready!")

fm.run()