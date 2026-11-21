import { z } from "zod";

export const createVisibleAsciiSchema = (errorMsg) => {
  return z.string().refine(
    (val) => {
      const test = /^[!-~]+$/.test(val);
      // console.log(val, test);
      return test;
    },
    { message: errorMsg }
  );
}

export const createPrintableAsciiSchema = (errorMsg) => {
  return z.string().refine(
    (val) => {
      const test = /^[ -~]+$/.test(val);
      // console.log(val, test);
      return test;
    },
    { message: errorMsg }
  );
}

export const UsernameSchema =
  createVisibleAsciiSchema("Username must contain only visible ascii")
  .pipe( z
    .string()
    .trim().toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be no more than 30 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers")
  )
  ;

export const EmailSchema =
  createVisibleAsciiSchema("Email must contain only visible ascii")
  .pipe(
    z
    .string()
    .trim().toLowerCase()
    .pipe(z.email("Please enter a valid email address"))
  )
  ;

export const PasswordSchema =
  createPrintableAsciiSchema("Password must contain only printable ascii")
  .pipe(
    z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be no more than 100 characters")
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, "Password must contain at least one letter and one number")
  )
  ;

export const PasswordHashSchema = 
  createPrintableAsciiSchema("PasswordHash must contain only printable ascii")
  ;