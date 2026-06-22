import argonPkg from '@node-rs/argon2';
const { hash, verify } = argonPkg;
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Argon2 hashing configuration options.
 * Uses Argon2id algorithm (hybrid of Argon2d and Argon2i) for best security balance.
 * Version 19 provides the latest performance and memory requirements.
 */
const argon2Options = {
  algorithm: argonPkg.Algorithm.Argon2id, // Optimal balance of TMTO resistance and side-channel resistance
  version: argonPkg.Version.V0x13,        // Argon2 Version 19
  timeCost: parseInt(process.env.ARGON2_TIME_COST || "3"),
  memoryCost: parseInt(process.env.ARGON2_MEMORY_COST || "65536"),
  outputLen: parseInt(process.env.ARGON2_HASH_LENGTH || "32"), // Note: type definition shows 'outputLen' not 'hashLength'
  parallelism: parseInt(process.env.ARGON2_PARALLELISM || "4"),
};

/**
 * Hashes a plain password string into an Argon2 formatted output.
 * The returned hash is base64-encoded by the library and ready for storage.
 * @param {string} inputPassword - The raw password from the client.
 * @returns {Promise<string>} - The base64-encoded hash string.
 */
export async function hashPassword(inputPassword) {
  try {
    // hash() returns a base64-encoded string directly (according to NAPI-RS types)
    // No additional Buffer encoding is needed; the library already formats it as expected.
    return await hash(inputPassword, argon2Options);
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
    // verify() accepts base64 string hash and returns boolean directly
    const result = await verify(storedHash, inputPassword, argon2Options);
    return result;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}