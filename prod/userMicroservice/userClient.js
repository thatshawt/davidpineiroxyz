/**
 * Simple library to consume the User Microservice API.
 * Uses Node.js native modules (fetch/URL) for zero dependencies besides this file itself.
 */

// import { fetch } from 'node-fetch';
import { URL } from 'node:url';

// Configuration
const BASE_URL = process.env.USER_SERVICE_BASE_URL || "http://localhost:3002";

class UserClient {
  constructor(baseUrl) {
    if (!baseUrl || baseUrl.trim() === "") {
      console.warn("User service is running in local mode without an external URL");
      this.baseUrl = BASE_URL;
    } else {
      // Ensure the url is absolute by adding protocol if missing
      try {
        new URL(baseUrl);
        this.baseUrl = baseUrl;
      } catch (e) {
        this.baseUrl = `https://${baseUrl}`;
      }
    }
  }

  /**
   * Checks if an email is already in use.
   * @param {{ email: string }} data
   */
  async checkEmailUsage(data) {
    const response = await fetch(`${this.baseUrl}/api/users/emailUsed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Failed to check email usage: ${response.statusText}`);
    
    const result = await response.json();
    return result.exists; // Returns boolean indicating if email exists
  }

  /**
   * Creates a new user.
   * @param {{ username: string, email: string, password: string }} data
   */
  async createUser(data) {
    const response = await fetch(`${this.baseUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Failed to create user: ${response.statusText}`);
    return await response.json();
  }

  /**
   * Reads a single user by username.
   * @param {string} username
   */
  async getUser(username) {
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch(`${this.baseUrl}/api/users/${encodedUsername}`, {
      method: "GET",
    });

    if (!response.ok) throw new Error(`Failed to read user: ${response.statusText}`);
    return await response.json();
  }

  /**
   * Reads all users.
   */
  async getAllUsers() {
    const response = await fetch(`${this.baseUrl}/api/users`, {
      method: "GET",
    });

    if (!response.ok) throw new Error(`Failed to read users: ${response.statusText}`);
    return await response.json();
  }

  /**
   * Updates a user.
   * @param {string} username
   * @param {{ username?: string, email?: string, password?: string }} data
   */
  async updateUser(username, data) {
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch(`${this.baseUrl}/api/users/${encodedUsername}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Failed to update user: ${response.statusText}`);
    return await response.json();
  }

  /**
   * Deletes a user.
   * @param {string} username
   */
  async deleteUser(username) {
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch(`${this.baseUrl}/api/users/${encodedUsername}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`Failed to delete user: ${response.statusText}`);
    return await response.json();
  }

  /**
   * Verifies a user's credentials.
   * @param {string} username
   * @param {string} password
   */
  async verifyUser(username, password) {
    const body = JSON.stringify({ username, password });
    const response = await fetch(`${this.baseUrl}/api/users/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    });

    if (!response.ok) throw new Error(`Failed to verify user: ${response.statusText}`);
    return await response.json();
  }
}

export default UserClient;