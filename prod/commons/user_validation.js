import {
  UsernameSchema, EmailSchema, PasswordSchema, PasswordHashSchema,
} from './zod_primitives.js';

import { z } from "zod";

// TODO this is not finalized yet...
export const UpdateUserSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema.optional(),
  oldPassword: PasswordSchema.optional(),
  newPassword: PasswordSchema.optional(),
});

export const CreateUserSchema = z.union([
  z.object({
    username: UsernameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    // passwordHash: z.undefined()
  }),
  z.object({
    username: UsernameSchema,
    email: EmailSchema,
    // password: z.undefined(),
    passwordHash: PasswordHashSchema
  })
]);

export const ReadUserSchema = z.object({
  username: UsernameSchema,
});

export const DeleteUserSchema = z.object({
  username: UsernameSchema,
});

export const VerifyUserSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema,
});

export const EmailUsedSchema = z.object({
  email: EmailSchema
});
