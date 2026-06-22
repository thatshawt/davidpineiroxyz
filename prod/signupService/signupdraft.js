// SIGNUP SERVICE
import { SIGNUP_SERVICE_HTTP_PORT } from '../common.js';

import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { email, z as zod } from "zod";
import { emailSender } from "../emailSender.js";
import UserClient from '../userMicroservice/userClient.js';

import { hashPassword } from './auth.js';

import crypto from 'node:crypto';

import { UserSchema, serveZodValidationError, ErrorResponseObject } from '../common.js';

// Zod Validation Schemas
const SignupInputSchema = zod.object({
    username: UserSchema.shape.username,
    email: UserSchema.shape.email,
    password: UserSchema.shape.password,
});

const TokenUrlSchema = zod.object({
    email: UserSchema.shape.email,
    token: zod.string()
});

// Express App Setup
const app = express();
app.use(cors());
app.use(express.json());

const userClient = UserClient("http://31.63.74.21:1337");

//TODO replace all the error responses to use ErrorResponseObject

// Create User Endpoint (Stage 1 - accepts username+email+password)
app.post('/api/signup', async (req, res) => {
    try {
        const validationResult = SignupInputSchema.parse(req.body);
        
        // TODO replace to use userClient.checkEmailUsage.
        // Validate email is unique in database
        const existingUser = await prisma.user.findUnique({ where: { email: validationResult.email } });
        if (existingUser) {
            return res.status(409).json(ErrorResponseObject(["Email already exists!"]));
        }

        // Generate verification token and set expiry to 10 minutes
        const expirationMs = Date.now() + 10 * 60 * 1000;

        const token = crypto.randomUUID();

        // Send verification email with the link
        const verifyLink = `${process.env.BASE_URL}/api/verifyEmail?token=${token}&email=${validationResult.email}`;
        await emailSender.sendVerificationEmail(validationResult.email, verifyLink);

        // Save username and password hash to user table
        const hashedPassword = await hashPassword(validationResult.password);
        await prisma.signupData.create({
            data: {
                token: token,
                email: validationResult.email,
                expiresAt: new Date(expirationMs),
                username: validationResult.username,
                passwordHash: hashedPassword
            }
        });

        res.status(201).json({ message: "Signup request received. Verify your email to complete signup." });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return serveZodValidationError(res, error);
        }
        console.error("Signup service error:", error);
        res.status(500).json(ErrorResponseObject(["An error occurred during signup"]));
    }
});

async function deleteToken(token){
    prisma.signupData.delete({ where: { token: token } });
}

// Verify Email Link Endpoint (Stage 2 - verify account and submit to user microservice)
app.post('/api/verifyEmail', async (req, res) => {
    try {
        const validationResult = TokenUrlSchema.parse(req.body);
        
        // Find the verification token
        const tokenRecord = await prisma.signupData.findFirst({
            where: {
                email: validationResult.email,
                token: validationResult.token
            },
            include: {
                token: true,
                email: true,
                expiresAt: true,
                username: true,
                passwordHash: true
            }
        });

        if (!tokenRecord) {
            return res.status(404).json({ message: "Verification link invalid or expired" });
        }

        // Check token expiration (10 minutes maximum)
        const isExpired = Date.now() > tokenRecord.expiresAt.getTime();
        if (isExpired) {
            await deleteToken(tokenRecord.token);
            return res.status(400).json({ message: "Verification link has expired" });
        }

        // TODO replace to use userClient.checkEmailUsage.
        // Verify email uniqueness again (prevents bypass)
        const existingUser = await prisma.user.findUnique({ where: { email: validationResult.email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered. Please use a different email." });
        }

        await deleteToken(tokenRecord.token);

        // Submit verified account to user microservice
        const submitData = {
            username: tokenRecord.username,
            email: tokenRecord.email,
            passwordHash: tokenRecord.passwordHash
        };
        try {
            await userClient.createUser(submitData);
        } catch (userServiceError) {
            console.error("Failed to submit to user service:", userServiceError);
            //TODO report this as a 500 error as this should never happen hopefully
        }

        res.status(200).json({ message: "Email verification successful! Account has been submitted." });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return serveZodValidationError(res, error);
        }
        console.error("Verification service error:", error);
        res.status(500).json(ErrorResponseObject(["An error occurred during verification"]));
    }
});

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
    try {
        await prisma.signupData.count();
        res.json({ status: 'healthy', timestamp: new Date() });
    } catch (error) {
        console.error("Health check error:", error);
        res.status(503).json({ status: 'unhealthy', message: 'Service unavailable' });
    }
});

// Start the server
const PORT = SIGNUP_SERVICE_HTTP_PORT;
app.listen(PORT, () => {
    console.log(`Signup service running on port ${PORT}`);
});