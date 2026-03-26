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

curl = assert(unix.commandv('curl'))
Log(kLogInfo, "found curl %s" % {curl})

local turnstileSecret = "1x0000000000000000000000000000000AA"
if path.exists("/zip/turnstileSecret.txt") then
    turnstileSecret = slurp("/zip/turnstileSecret.txt")
    Log(kLogInfo, "found turnstileSecret.txt")
end

local emailSecret = "test@test.test"
if path.exists("/zip/emailSecret.txt") then
    emailSecret = slurp("/zip/emailSecret.txt")
    Log(kLogInfo, "found emailSecret.txt")
end

local function validateTurnstileKey(cf_response)
    successResult = "false"

    if type(cf_response) == "string" and #cf_response < 2048 then
        Log(kLogInfo, "cf validate. doing curl exec. response is %s chars long" % {#cf_response})
        response = exec(curl , {curl,
        "-d", "secret="..turnstileSecret,
        "-d", "response="..cf_response,
        "https://challenges.cloudflare.com/turnstile/v0/siteverify"})

        response = DecodeJson(response)

        successResult = response.success and tostring(response.success) or "false"
        Log(kLogInfo, "cf validate. performed curl exec.")
    end

    emailResult = ""
    if successResult == "true" then
        emailResult = emailSecret
    end

    response = {
        success=successResult,
        email=emailResult
    }

    return EncodeJson(response)
end

return {
    exec=exec,
    starts_with=starts_with,
    ends_with=ends_with,
    validateTurnstileKey=validateTurnstileKey
}