// SIGNUP SERVICE
import { SIGNUP_SERVICE_HTTP_PORT } from '../common.js';

import express from "express"; // express for the http server
import cors from "cors"; //  cors so other microservices can request to the signup service.
import { prisma } from "./lib/prisma.js"; // prisma to handle signup database
import { z } from "zod"; // zod validation.
import {emailSender} from "../emailSender.js"; // use this to send the email.
import UserClient from '../userMicroservice/userClient.js'; //use this to submit the verified account.

// --What needs to be done--
// Implement a signup express http server that does the following:
// accepts username+email+password from user (stage1).
// when stage1 happens, it sends an email with a link to verify the account.
// the link is time sensitive, 10 minutes maximum.
// if the user clicks the link, it verifies the account and submits it to the user service.
// done! user signed up.

// Zod validation for each endpoint's input:
// ...

// Endpoints to implement signup flow:
// ...
