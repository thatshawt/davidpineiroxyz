export const USER_SERVICE_HTTP_PORT = process.env.USER_SERVICE_HTTP_PORT || "3002";

export const SIGNUP_SERVICE_HTTP_PORT = process.env.SIGNUP_SERVICE_HTTP_PORT || "3003";

export const CHAT_SERVICE_WS_PORT = process.env.CHAT_SERVICE_WS_PORT || "3001";
export const CHAT_SERVICE_HTTP_PORT = process.env.CHAT_SERVICE_HTTP_PORT || "3000";

import { z } from "zod";
export const UserSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be no more than 30 characters")
        .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers")
        .toLowerCase(),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .pipe(z.email("Please enter a valid email address")),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be no more than 100 characters")
        .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, "Password must contain at least one letter and one number"),
});

export const ErrorResponseObject = (messages) => {
  return { isError:true, messages: messages }
};

export const serveZodValidationError = (res, error) => {
  const errorMessages = error.issues.map((issue) => issue.message);
  console.error("Validation error:", errorMessages);
  return res.status(400).json(ErrorResponseObject(errorMessages));
};