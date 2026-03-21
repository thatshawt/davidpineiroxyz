local function starts_with(str, start)
   return str:sub(1, #start) == start
end

local function ends_with(str, ending)
   return ending == "" or str:sub(-#ending) == ending
end

local fm = require "fullmoon"

-- .fmt files loaded from /views/ folder
local thing = fm.setTemplate({"/views/", fmt = "fmt"})

-- add all the routes .fmt templates from the /views/routes folder
for k,v in pairs(thing) do
	fm.logInfo(k.." = "..tostring(v))
	if starts_with(k, "routes/") then
		local routePath = "/"..k:sub(- (#k - #"routes/"))
		fm.logInfo("adding route: "..routePath.." -> "..k)
		fm.setRoute(routePath, fm.serveContent(k))
    end
end

fm.setRoute("/", fm.serveContent("routes/index"))
fm.setRoute("/index.html", fm.serveContent("routes/index"))

-- static files like css and fonts
fm.setRoute("/static/*", fm.serveAsset)

fm.run()