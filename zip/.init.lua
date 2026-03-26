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
		fm.setRoute(routePath, fm.serveContent(k))
    end
end

fm.setRoute("/", fm.serveContent("routes/index"))
fm.setRoute("/index.html", fm.serveContent("routes/index"))

-- static files like css and fonts
fm.setRoute("/static/*", fm.serveAsset)

-- validate the email cloudlflare turnstile
fm.setRoute({"/getEmail", method = {"POST"}},
  function(r)
	cf_response = tostring(r.params["cf-turnstile-response"]) or ""
	
	postResponse = common.validateTurnstileKey(cf_response)
	
	-- fm.logInfo("returned '%s'" % {postResponse})
	return postResponse
end)

fm.run()