import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { z } from "zod";
import { hashPassword, verifyPassword } from './auth';


// Zod schema for user validation
const UserSchema = z.object({
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

// Zod schema for updating user (username required, email and password optional)
const UpdateUserSchema = z.object({
  username: UserSchema.shape.username,
  email: UserSchema.shape.email.optional(),
  password: UserSchema.shape.password.optional(),
});

// Zod schema for reading user (only username required, no email/password validation)
const ReadUserSchema = z.object({
  username: UserSchema.shape.username,
});

const DeleteUserSchema = z.object({
  username: UserSchema.shape.username,
});

const VerifyUserSchema = z.object({
  username: UserSchema.shape.username,
  password: UserSchema.shape.password,
});

import { parseArgs } from "node:util";

const options = {
  httport: { type: "string", short: "h" },
};

const { values, positionals } = parseArgs({ options });

const httpPORT = Number.parseInt(values.httport || "3002");

const app = express();
const PORT = httpPORT;

// Enable CORS for every route
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.use(express.static("./public/"));

const serveZodValidationError = (res, error) => {
  const errorMessages = error.issues.map((issue) => issue.message);
  console.error("Validation error:", errorMessages);
  res.status(400).json({ isError:true, messages: errorMessages });
};

// Create a new user
app.post("/users", async (req, res) => {
  try {
    // Validate input with Zod
    var validatedData = UserSchema.parse(req.body);

    validatedData.password = await hashPassword(validatedData.password);

    const user = await prisma.user.create({
      data: validatedData,
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      serveZodValidationError(res, error);
    } else {
      console.error("Create error:", error);
      res.status(400).json({ error: "Failed to create user" });
    }
  }
});

// Read all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        password: false,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Read error:", error);
    res.status(400).json({ error: "Failed to read users" });
  }
});

// Read a single user
app.get("/users/:username", async (req, res) => {
  try {
    // Validate the request parameter against ReadUserSchema
    const validatedParams = ReadUserSchema.parse({ username: req.params.username });

    const user = await prisma.user.findUnique({
      where: { username: validatedParams.username },
      select: {
        username: true,
        email: true,
        password: false,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error);
      res.status(400).json({ error: error.errors });
    } else {
      console.error("Read unique error:", error);
      res.status(400).json({ error: "Failed to read user" });
    }
  }
});

// Update a user
app.put("/users/:username", async (req, res) => {
  try {
    // Validate input with Zod (allowing partial updates)
    const validatedData = UpdateUserSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { username: req.params.username },
      data: validatedData,
      select: {
        username: true,
        email: true,
        password: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      serveZodValidationError(res, error);
    } else {
      console.error("Update error:", error);
      res.status(400).json({ error: "Failed to update user" });
    }
  }
});

// Delete a user
app.delete("/users/:username", async (req, res) => {
  try {
    // Validate the request parameter against DeleteUserSchema
    const validatedParams = DeleteUserSchema.parse({ username: req.params.username });

    // Perform the deletion using the validated username
    const deleted = await prisma.user.delete({
      where: { username: validatedParams.username },
    });

    res.json({ message: "User deleted", deleted });
  } catch (error) {
    if (error instanceof z.ZodError) {
      serveZodValidationError(res, error);
    } else {
      console.error("Delete error:", error);
      res.status(400).json({ error: "Failed to delete user" });
    }
  }
});

// Verify a user (New Endpoint)
app.post("/users/verify", async (req, res) => {
  try {
    // Validate input with VerifyUserSchema
    const validatedData = VerifyUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify the provided password against the stored hashed password
    const isValid = await verifyPassword(user.password, validatedData.password);

    if (isValid) {
      return res.status(200).json({ message: "Authentication successful", username: validatedData.username });
    } else {
      return res.status(401).json({ error: "Failed to verify user" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      serveZodValidationError(res, error);
    } else {
      console.error("Verify error:", error);
      res.status(400).json({ error: "Failed to verify user" });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("User API available at /users");
});

process.on("SIGINT", async () => {
  if (prisma && prisma.$disconnect) {
    await prisma.$disconnect();
  }
  process.exit();
});

process.on("SIGTERM", async () => {
  if (prisma && prisma.$disconnect) {
    await prisma.$disconnect();
  }
  process.exit();
});