import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";

//TODO input validation with zod.
// password, min/max length, certain chars only
// username, same thing
// email, same thing

import { parseArgs } from 'node:util';

const options = {
  httport: { type: 'string', short: 'h' },
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

// CRUD Operations

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Create error:", error);
    res.status(400).json({ error: "Failed to create user" });
  }
});

// Read all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        password: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Read error:", error);
    res.status(400).json({ error: "Failed to read users" });
  }
});

// Read a single user
app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.id },
      select: {
        username: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Read unique error:", error);
    res.status(400).json({ error: "Failed to read user" });
  }
});

// Update a user
app.put("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { username: req.params.id },
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
      select: {
        username: true,
        email: true,
        password: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ error: "Failed to update user" });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await prisma.user.delete({
      where: { username: req.params.id },
    });

    res.json({ message: "User deleted", deleted });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(400).json({ error: "Failed to delete user" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("User API available at /users");
});

process.on('SIGINT', async () => {
  if (prisma && prisma.$disconnect) {
    await prisma.$disconnect();
  }
  process.exit();
});

process.on('SIGTERM', async () => {
  if (prisma && prisma.$disconnect) {
    await prisma.$disconnect();
  }
  process.exit();
});