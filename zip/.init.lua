local common = require "common"

local fm = require "fullmoon"
local unix = require 'unix'

date = assert(unix.commandv('date'))
local dateString = common.exec(date)
dateString = dateString:sub(1, #dateString - 1) -- remove last char

devMode = false
for k,v in pairs(arg) do
	fm.logInfo(k.." = "..tostring(v))
	if v == "devmode" then
		devMode = true
	end
end

Log(kLogInfo, "devmode '%s'" % {tostring(devMode)})
Log(kLogInfo, "got date string '%s'" % {dateString})

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

		local valid, error = common.usernamePasswordValidator(r.params)

		-- check user and pass combo
		if valid then
			valid, error = common.checkUserPass(r.params.username, r.params.password)
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

-- fork copyparty
-- python3 = assert(unix.commandv('python3'))
-- strace = assert(unix.commandv('strace'))
-- echo = assert(unix.commandv('echo'))
-- echo = "/nix/store/3sdbmzgasq0yji85zhm1rjdhi17ya64c-coreutils-full-9.7/bin/echo"
-- if assert(unix.fork()) == 0 then
	-- set limits on memory and cpu just in case
    -- assert(unix.setrlimit(unix.RLIMIT_RSS, 2*1024*1024)) -- is this 2097152 bytes? kilobytes?
    -- assert(unix.setrlimit(unix.RLIMIT_CPU, 2))

	-- restrict file system
	-- assert(unix.unveil("./copyparty", "rwc"))
	-- assert(unix.unveil("/etc", "rxc"))
	-- assert(unix.unveil("/tmp", "rwc"))
	-- assert(unix.unveil("/nix", "rx"))
	-- assert(unix.unveil("/proc", "r"))
	-- assert(unix.unveil(nil, nil))
	
	-- promises = "stdio vminfo tmppath id dpath settime exec prot_exec proc settime rpath cpath wpath inet anet dns fattr tty flock recvfd sendfd chown"
	-- execpromises = "stdio exec rpath cpath wpath inet dns flock recvfd sendfd"
	-- execpromises = promises
	-- execpromises = Nil
	-- assert(unix.pledge(promises, Nil, PLEDGE_PENALTY_RETURN_EPERM)) -- restrict system calls

	-- unix.execve(strace, {strace, python3, "copyparty/copyparty.pyz", "--grid", "-v", "./copyparty/stuff::r", "-p", "8083", "--ses-db", "./copyparty/sessions.db", "--unsafe-state"})
	-- unix.execve(strace, {strace, echo, "hello"}, {})

	-- common.sendNtfy("copyparty", "Closed!")
	-- unix.exit(127)
-- end
-- unix.wait()
-- unix.exit(127)

function OnWorkerStart()
    -- set limits on memory and cpu just in case
    assert(unix.setrlimit(unix.RLIMIT_RSS, 2*1024*1024)) -- is this 2097152 bytes? kilobytes?
    assert(unix.setrlimit(unix.RLIMIT_CPU, 2))

	-- restrict file system
	assert(unix.unveil(".", "rwc"))
	assert(unix.unveil("/etc", "r"))
	-- assert(unix.unveil("/etc", "r"))
	-- assert(unix.unveil("/run/current-system/sw/bin", "rcx"))
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

-- function OnWorkerStop()
	-- promises = "proc stdio exec prot_exec rpath"
	-- execpromises = "stdio rpath cpath wpath inet dns unix flock recvfd sendfd"
	-- execpromises = promises
	-- assert(unix.pledge())
	
	-- TODO: patch redbean pledge so that it allows PR_SET_MM for prctl.
	-- when pledging proc AND stdio, then we have to allow all of prctl and not just some parameters for the first one.
	-- see https://github.com/jart/cosmopolitan/blob/eedf7d2db6e5ee0e228862690339c166a3f003a7/libc/calls/pledge-linux.c#L2073

	-- if unix.fork() == 0 then
	-- 	assert(unix.pledge(promises, Nil, PLEDGE_PENALTY_RETURN_EPERM))
	-- 	unix.execve(strace, {strace, echo, "hello"}, {})
	-- 	-- unix.execve(echo, {echo, "hello"}, {})
	-- end
	-- unix.wait()
-- end

common.sendNtfy("davidpineiro.xyz","Ready!")

fm.run()