local function starts_with(str, start)
   return str:sub(1, #start) == start
end

local function ends_with(str, ending)
   return ending == "" or str:sub(-#ending) == ending
end

local function exec(prog, args, env)
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

local fm = require "fullmoon"
local unix = require 'unix'

date = assert(unix.commandv('date'))
local dateString = exec(date)
dateString = dateString:sub(1, #dateString - 1) -- remove last char

Log(kLogInfo, "got date string '%s'" % {dateString})

fm.setTemplate("printStartDate", dateString)

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