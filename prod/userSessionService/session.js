import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { z } from "zod";

import {
    USER_SESSION_SERVICE_HTTP_PORT
} from '../commons/common.js';

// Express App Setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./public/"));




// Health Check Endpoint
app.get('/api/session/health', async (req, res) => {
    try {
        await prisma.sessions.count();
        res.json({ status: 'healthy', timestamp: new Date() });
    } catch (error) {
        console.error("Health check error:", error);
        res.status(503).json({ status: 'unhealthy', message: 'Service unavailable' });
    }
});

// Start the server
const PORT = USER_SESSION_SERVICE_HTTP_PORT;
app.listen(PORT, () => {
    console.log(`User Session service running on port ${PORT}`);
});

// Function to handle a graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  
  // 1. Stop Express from accepting new web requests
  app.close(async () => {
    console.log('Express server closed.');
    
    // 2. Disconnect Prisma cleanly (finishes current queries first)
    await prisma.$disconnect();
    console.log('Prisma disconnected.');
    
    // 3. Exit the process safely
    process.exit(0);
  });
}

// Listen for Ctrl+C locally
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Listen for production container shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));