import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { z } from "zod";
// import { emailSender } from "../emailSender.js";
import UserClient from '../userMicroservice/userClient.js';
import { hashPassword } from '../commons/auth.js';

import crypto from 'node:crypto';

import {
    serveZodValidationError, ErrorResponseObject,
    SIGNUP_SERVICE_HTTP_PORT, USER_SERVICE_HTTP_PORT,
    SuccessResponseObject,
    validateTurnstileKey
} from '../commons/common.js';

import { UsernameSchema, EmailSchema, PasswordSchema }
from "../commons/zod_primitives.js";

import { CreateUserSchema } from "../commons/user_validation.js";

// Zod Validation Schemas
const SignupInputSchema = z.object({
    username: UsernameSchema,
    email: EmailSchema,
    password1: PasswordSchema,
    password2: PasswordSchema,
    redirect: z.string()
}).refine((data) =>
    data.password1 === data.password2,
    { message: "Passwords don't match"}
);

const TokenUrlSchema = z.object({
    email: EmailSchema,
    token: z.string(),
    redirect: z.string()
});

// Express App Setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./public/"));

const userClient = new UserClient(`http://127.0.0.1:${USER_SERVICE_HTTP_PORT}`);

// TODO replace this with an actual email sender thing
const emailSender = async (email, body) => {
    console.log(`MOCK SEND EMAIL to ${email} this: '${body}'`);
};

// Create User Endpoint (Stage 1 - accepts username+email+password)
app.post('/api/signup/createAccount', async (req, res) => {
    try {
        const cfResponse = req.body["cf-turnstile-response"];

        const turnstleValid = await validateTurnstileKey(cfResponse);

        if(turnstleValid == false){
            return res.status(401).json(ErrorResponseObject(["Turnstile invalid!"]));
        }

        const validationResult = SignupInputSchema.parse(req.body);
        
        // Validate email is unique
        const emailExists = await userClient.checkEmailUsage({email:validationResult.email});
        if (emailExists) {
            return res.status(409).json(ErrorResponseObject(["Email already exists!"]));
        }

        // Generate verification token and set expiry to 10 minutes
        const expirationMs = Date.now() + 10 * 60 * 1000;

        const token = crypto.randomUUID();

        //TODO change link to 
        // Send verification email with the link
        const verifyLink = `http://localhost:3003/api/signup/verifyEmail?token=${token}&email=${validationResult.email}&redirect=${validationResult.redirect}`;
        await emailSender(validationResult.email,
`Hi,
This is an automated message.

Click this url to verify your account: ${verifyLink} .

Thanks,
DavidPineiro.xyz.`);

        // Save username and password hash to user table
        const hashedPassword = await hashPassword(validationResult.password1);
        await prisma.signupData.create({
            data: {
                token: token,
                email: validationResult.email,
                expiresAt: new Date(expirationMs),
                username: validationResult.username,
                passwordHash: hashedPassword
            }
        });

        res.status(201).json(SuccessResponseObject("Signup request received. Verify your email to complete signup."));
    } catch (error) {
        if (error instanceof z.ZodError) {
            return serveZodValidationError(res, error);
        }
        console.error("Signup service error:", error);
        res.status(500).json(ErrorResponseObject(["An error occurred during signup"]));
    }
});

async function deleteToken(token){
    await prisma.signupData.delete({
        where: {
            token: token 
        } 
    });
}

// Verify Email Link Endpoint (Stage 2 - verify account and submit to user microservice)
app.get('/api/signup/verifyEmail', async (req, res) => {
    try {
        const validatedEmailTokenData = TokenUrlSchema.parse(req.query);
        
        // Find the verification token
        const tokenRecord = await prisma.signupData.findFirst({
            where: {
                email: validatedEmailTokenData.email,
                token: validatedEmailTokenData.token
            },
            select: {
                email: true,
                token: true,
                expiresAt: true,
                username: true,
                passwordHash: true
            }
        });

        if (!tokenRecord) {
            return res.status(404).json(ErrorResponseObject(["Verification link invalid or expired"]));
        }

        // Check token expiration (10 minutes maximum)
        const isExpired = Date.now() > tokenRecord.expiresAt.getTime();
        if (isExpired) {
            await deleteToken(tokenRecord.token);
            return res.status(400).json(ErrorResponseObject(["Verification link has expired"]));
        }

        // console.log(tokenRecord);

        // Validate email is unique
        const emailExists = await userClient.checkEmailUsage({email:tokenRecord.email});
        if (emailExists) {
            await deleteToken(tokenRecord.token);
            return res.status(409).json(ErrorResponseObject(["Email already exists!"]));
        }

        // Submit verified account to user microservice
        const submitData = {
            username: tokenRecord.username,
            email: tokenRecord.email,
            passwordHash: tokenRecord.passwordHash
        };

        const validatedUserCreate = CreateUserSchema.parse(submitData);

        try {
            console.log(validatedUserCreate);
            await userClient.createUser(validatedUserCreate);
            await deleteToken(tokenRecord.token);
        } catch (userServiceError) {
            console.error("Failed to submit to user service:", userServiceError);
            // Report this as a 500 error as this should never happen hopefully
            return res.status(500).json(ErrorResponseObject(["An error occurred during user creation submission"]));
        }

        // res.status(200).json({ message: "Email verification successful! Account has been submitted." });
        res.redirect(`${validatedEmailTokenData.redirect}`);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return serveZodValidationError(res, error);
        }
        console.error("Verification service error:", error);
        res.status(500).json(ErrorResponseObject(["An error occurred during verification"]));
    }
});

// Health Check Endpoint
app.get('/api/signup/health', async (req, res) => {
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