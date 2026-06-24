import { z as zod } from "zod";

import {
    UsernameSchema, EmailSchema, PasswordSchema, PasswordHashSchema,
} from '../commons/common.js';


export const UpdateUserSchema = zod.object({
  username: UsernameSchema,
  email: EmailSchema.optional(),
  oldPassword: PasswordSchema.optional(),
  newPassword: PasswordSchema.optional(),
});

export const CreateUserSchema = zod.union([
  zod.object({
    username: UsernameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    // passwordHash: zod.undefined()
  }),
  zod.object({
    username: UsernameSchema,
    email: EmailSchema,
    // password: zod.undefined(),
    passwordHash: PasswordHashSchema
  })
]);

export const ReadUserSchema = zod.object({
  username: UsernameSchema,
});

export const DeleteUserSchema = zod.object({
  username: UsernameSchema,
});

export const VerifyUserSchema = zod.object({
  username: UsernameSchema,
  password: PasswordSchema,
});

export const EmailUsedSchema = zod.object({
  email: EmailSchema
});
