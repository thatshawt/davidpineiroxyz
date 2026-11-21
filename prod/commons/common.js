import dotenv from "dotenv";

dotenv.config();

export const USER_SERVICE_HTTP_PORT = process.env.USER_SERVICE_HTTP_PORT || "3002";

export const SIGNUP_SERVICE_HTTP_PORT = process.env.SIGNUP_SERVICE_HTTP_PORT || "3003";

export const CHAT_SERVICE_WS_PORT = process.env.CHAT_SERVICE_WS_PORT || "3001";
export const CHAT_SERVICE_HTTP_PORT = process.env.CHAT_SERVICE_HTTP_PORT || "3000";

export const USER_SESSION_SERVICE_HTTP_PORT = process.env.USER_SESSION_SERVICE_HTTP_PORT || "3004";
    
export const ErrorResponseObject = (messages) => {
  return { isError:true, messages: messages }
};

export const SuccessResponseObject = (message) => {
  return { isError:false, messages: [message] }
};

export const serveZodValidationError = (res, error) => {
  const errorMessages = error.issues.map((issue) => issue.message);
  console.error("Validation error:", errorMessages);
  return res.status(400).json(ErrorResponseObject(errorMessages));
};

const cf_secret = process.env.CF_TURNSTILE_SECRET;
// console.log(process.env);
export async function validateTurnstileKey(key){
  if(key && key.length < 2048){
    const response = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${cf_secret}&response=${key}`
    });

    // console.log(cf_secret,key,response);

    if(response.status == 200){
      const responseJson = await response.json();
      console.log(responseJson);

      const successResult = responseJson.success ? responseJson.success == true : false;

      return successResult;

    }
    // else{

    // }
  }
  // else{

  // }

  return false;
}