import { Argon2 } from "@node-rs/argon2";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const argon2 = new Argon2({
  type: Argon2Type.ARGON2OID, // Use OID mode for best security compatibility
  version: 19,                // Argon2 Version 19 (widely supported)
  timeCost: parseInt(process.env.ARGON2_TIME_COST || "3"),
  memoryCost: parseInt(process.env.ARGON2_MEMORY_COST || "65536"),
  parallelism: parseInt(process.env.ARGON2_PARALLELISM || "4"),
  hashLength: parseInt(process.env.ARGON2_HASH_LENGTH || "32"),
});

/**
 * Hashes a plain password string into an Argon2 formatted output.
 * @param {string} inputPassword - The raw password from the client.
 * @returns {Promise<string>} - The hex-encoded hash string.
 */
export async function hashPassword(inputPassword) {
  try {
    const hash = await argon2.hash(inputPassword);
    
    // Argon2 output is typically a binary blob + salt, encoded as base64 or hex
    // .toString('base64') is commonly used for storage.
    return Buffer.from(hash).toString('base64'); 
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Verifies an input password against the stored hashed password.
 * @param {string} storedHash - The base64 string from your database.
 * @param {string} inputPassword - The raw password entered by the user.
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
 */
export async function verifyPassword(storedHash, inputPassword) {
  try {
    // Verify returns true if successful, throwing an error if invalid
    const result = await argon2.verify(Buffer.from(storedHash, 'base64'), inputPassword);
    return result;
  } catch (error) {
    // In production, you might want to handle this more gracefully or log anonymously
    console.error("Error verifying password:", error);
    return false;
  }
}