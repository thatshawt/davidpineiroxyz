export const USER_SERVICE_HTTP_PORT = process.env.USER_SERVICE_HTTP_PORT || "3002";

export const SIGNUP_SERVICE_HTTP_PORT = process.env.SIGNUP_SERVICE_HTTP_PORT || "3003";

export const CHAT_SERVICE_WS_PORT = process.env.CHAT_SERVICE_WS_PORT || "3001";
export const CHAT_SERVICE_HTTP_PORT = process.env.CHAT_SERVICE_HTTP_PORT || "3000";

import { z } from "zod";

export const UsernameSchema = z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be no more than 30 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers")
    .toLowerCase();

export const EmailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Please enter a valid email address"));

export const PasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be no more than 100 characters")
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, "Password must contain at least one letter and one number");

export const PasswordHashSchema = z.string();
    
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

export async function validateTurnstileKey(key){
  if(key && key.length < 2048){
    const response = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${cf_secret}&response=${key}`
    });

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

// TODO add a turnstile validator here.