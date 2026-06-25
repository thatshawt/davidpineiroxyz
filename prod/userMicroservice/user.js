import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { z as zod } from "zod";
import { hashPassword, verifyPassword } from '../commons/auth.js';

import { USER_SERVICE_HTTP_PORT,
  serveZodValidationError, ErrorResponseObject} from '../commons/common.js';

import {
  CreateUserSchema,DeleteUserSchema,EmailUsedSchema,ReadUserSchema,UpdateUserSchema,VerifyUserSchema
} from './validation.js';

import { parseArgs } from "node:util";

const options = {
  httport: { type: "string", short: "h" },
};

const { values, positionals } = parseArgs({ options });

// const httpPORT = Number.parseInt(values.httport || "3002");
const httpPORT = USER_SERVICE_HTTP_PORT;

const app = express();
const PORT = httpPORT;

// Enable CORS for every route
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.use(express.static("./public/"));

// Create a new user
app.post("/api/users", async (req, res) => {
  try {
    // Validate input with Zod
    console.log(req.body);
    var validatedData = CreateUserSchema.parse(req.body);

    if(validatedData.password){
      validatedData.password = await hashPassword(validatedData.password);
    }else if(validatedData.passwordHash){
      validatedData.password = validatedData.passwordHash;
      validatedData.passwordHash = undefined;
    }

    const user = await prisma.user.create({
      data: validatedData,
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      serveZodValidationError(res, error);
    } else {
      console.error("Create error:", error);
      res.status(400).json(ErrorResponseObject(["Failed to create user"]));
    }
  }
});

// Read all users
app.get("/api/users", async (req, res) => {
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
    res.status(400).json(ErrorResponseObject(["Failed to read users"]));
  }
});

// Read a single user
app.get("/api/users/:username", async (req, res) => {
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
      return res.status(404).json(ErrorResponseObject(["User not found"]));
    }

    res.json(user);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      serveZodValidationError(res, error);
    } else {
      console.error("Read unique error:", error);
      res.status(400).json(ErrorResponseObject(["Failed to read user"]));
    }
  }
});

// Update a user
app.put("/api/users/:username", async (req, res) => {
  try {
    // Validate input with Zod (allowing partial updates)
    const validatedData = UpdateUserSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { username: req.params.username },
      data: validatedData,
      select: {
        username: true,
        email: true,
        password: false,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      serveZodValidationError(res, error);
    } else {
      console.error("Update error:", error);
      res.status(400).json(ErrorResponseObject(["Failed to update user"]));
    }
  }
});

// Delete a user
app.delete("/api/users/:username", async (req, res) => {
  try {
    // Validate the request parameter against DeleteUserSchema
    const validatedParams = DeleteUserSchema.parse({ username: req.params.username });

    // Perform the deletion using the validated username
    const deleted = await prisma.user.delete({
      where: { username: validatedParams.username },
    });

    res.json({ message: "User deleted", deleted });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      serveZodValidationError(res, error);
    } else {
      console.error("Delete error:", error);
      res.status(400).json(ErrorResponseObject(["Failed to delete user"]));
    }
  }
});

// Verify a user
app.post("/api/users/verify", async (req, res) => {
  try {
    // Validate input with VerifyUserSchema
    const validatedData = VerifyUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (!user) {
      return res.status(401).json(ErrorResponseObject(["Invalid credentials."]));
    }

    // Verify the provided password against the stored hashed password
    const isValid = await verifyPassword(user.password, validatedData.password);

    if (isValid) {
      return res.status(200).json({ message: "Authentication successful", username: validatedData.username });
    } else {
      return res.status(401).json(ErrorResponseObject(["Failed to verify user"]));
    }
  } catch (error) {
    if (error instanceof zod.ZodError) {
      serveZodValidationError(res, error);
    } else {
      console.error("Verify error:", error);
      res.status(400).json(ErrorResponseObject(["Failed to verify user"]));
    }
  }
});

// check if an email is in use.
app.post("/api/users/emailUsed", async (req, res) => {
  try {
    console.log(req.body);
    const emailUsedData = EmailUsedSchema.parse(req.body);

    // Check if an email is already in use
    const exists = await prisma.user.findUnique({
      where: {
        email: emailUsedData.email
      },
    });

    // Return true if a user with this email exists, false otherwise
    res.json({exists: exists !== null});
  } catch (error) {
    console.error("Email check error:", error);
    res.status(400).json(ErrorResponseObject(["Failed to check email availability"]));
  }
});

// Health Check Endpoint
app.get('/api/users/health', async (req, res) => {
    try {
        await prisma.user.count();
        res.json({ status: 'healthy', timestamp: new Date() });
    } catch (error) {
        console.error("Health check error:", error);
        res.status(503).json({ status: 'unhealthy', message: 'Service unavailable' });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
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