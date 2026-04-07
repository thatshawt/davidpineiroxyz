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
local usernamePasswordValidator = fm.makeValidator{
  {"username", minlen = 1, maxlen = 64, msg = "Username must be between 1 and 64 length."},
  {"password", minlen = 8, maxlen = 128, msg = "Password must be between 8 and 128 length."},
}
fm.setRoute({"/login", method = {"POST"}},
	function(r)
		local valid, error = usernamePasswordValidator(r.params)

		-- check user and pass combo
		if valid then
			valid, error = common.checkUserPass(r.params.username, r.params.password)
		end

		if valid then
			r.session.user = r.params.username
			return fm.serveRedirect(302, "/")
		else
			return fm.serveContent("routes/login", {message = error})
		end
	end
)

-- logout

fm.setRoute({"/logout", method = {"POST","GET"}},
	function (r)
		r.session = {}
		
		return [[ <meta http-equiv="refresh" content="0; url=/"> ]]
	end
)

fm.run()