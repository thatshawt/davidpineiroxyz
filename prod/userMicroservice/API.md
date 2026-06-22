# User Microservice API Endpoints

All data is expected to be JSON.

## 1. POST /users
Creates a new user.

### Input
*   **Endpoint:** `POST /users`
*   **Content-Type:** `application/json`
*   **Payload:**
    | Field | Type | Description | Constraints (Zod) | Required |
    |-------|------|-------------|-------------------|----------|
    | `username` | String | The unique identifier for the user. | Min 3, Max 30 chars; Alphanumeric (`a-z`, `A-Z`, `0-9`); Auto-converted to lowercase. | **Yes** |
    | `email` | String | The email address of the user. | Valid email format; Trimmed whitespace; Auto-converted to lowercase. | **Yes** |
    | `password` | String | The plain-text password of the user. | Min 8, Max 100 chars; Must contain at least one letter and one number. | **Yes** |

### Output
*   **Status Code:** `201 Created` (or `4xx/5xx` if validation fails)
    *   Success:
        ```json
        {
          "username": "...",
          "email": "...",
          "password": "..."
        }
        ```
    *   Error: `{ "isError": true, "messages": ["error message 1", "error message 2"] }`

---

## 2. GET /users
Reads all users.

### Input
*   **Endpoint:** `GET /users`
*   **Content-Type:** N/A (No body required)

### Output
*   **Status Code:** `200 OK`
    *   Success: Array of users
        ```json
        [
          {
            "username": "...",
            "email": "..."
          },
          ...
        ]
        ```
    *   Error: `{ "isError": true, "messages": ["error message"] }`

---

## 3. GET /users/:username
Reads a single user by username.

### Input
*   **Endpoint:** `GET /users/{username}`
*   **Path Parameter (`username`):**
    | Field | Type | Description | Constraints | Required |
    |-------|------|-------------|----------------|----------|
    | `username` | String | The unique identifier for the user. | Must match alphanumeric constraints; Auto-converted to lowercase by the server. | **Yes** (URL) |

### Output
*   **Status Code:** `200 OK` or `404 Not Found`
    *   Success: Single user object (excludes password)
        ```json
        {
          "username": "...",
          "email": "..."
        }
        ```
    *   Error: `{ "isError": true, "messages": ["error message"] }`

---

## 4. PUT /users/:username
Updates an existing user.
**Behavior:** Fields not provided in the request body will retain their previous values (partial update). If fields are provided, they must meet the creation constraints.

### Input
*   **Endpoint:** `PUT /users/{username}`
*   **Path Parameter (`username`):** The unique identifier to locate the user to update.
    | Field | Type | Description | Constraints | Required |
    |-------|------|-------------|----------------|----------|
    | `username` | String | The new username. | Min 3, Max 30 chars; Alphanumeric; Auto-converted to lowercase. | **If provided** |

*   **Payload (Optional fields):**
    | Field | Type | Description | Constraints | Required |
    |-------|------|-------------|----------------|----------|
    | `email` | String | The new email address. | Valid format; Trimmed whitespace; Auto-converted to lowercase. | **If provided** |
    | `password` | String | The new plain-text password. | Min 8, Max 100 chars; Must contain at least one letter and one number. | **If provided** |

### Output
*   **Status Code:** `200 OK` (if successful) or `4xx/5xx` if validation fails or user not found.
    *   Success: Updated user object (includes plaintext password)
        ```json
        {
          "username": "...",
          "email": "...",
          "password": "..."
        }
        ```
    *   Error: `{ "isError": true, "messages": ["error message"] }`

---

## 5. DELETE /users/:username
Deletes an existing user.

### Input
*   **Endpoint:** `DELETE /users/{username}`
*   **Path Parameter (`username`):** The unique identifier to locate the user to delete.
    | Field | Type | Description | Constraints | Required |
    |-------|------|-------------|----------------|----------|
    | `username` | String | The unique identifier for the user. | Must match alphanumeric constraints; Auto-converted to lowercase by the server. | **Yes** (URL) |

### Output
*   **Status Code:** `204 No Content` (if successful), or `4xx/5xx` if user not found.
    *   Success: No Content.
    *   Error Body: `{ "isError": true, "messages": ["error message"] }`

---

## 6. POST /users/verify
Verifies a user's credentials.

### Input
*   **Endpoint:** `POST /users/verify`
*   **Content-Type:** `application/json`
*   **Payload:**
    | Field | Type | Description | Constraints (Zod) | Required |
    |-------|------|-------------|-------------------|----------|
    | `username` | String | The unique identifier for the user. | Min 3, Max 30 chars; Alphanumeric (`a-z`, `A-Z`, `0-9`). Case-insensitive lookup but sent lowercase. | **Yes** |
    | `password` | String | The plain-text password provided by the user. | Must match the length requirements during verification logic (though strict Zod validation on input is applied). | **Yes** |

### Output
*   **Status Code:** 
    *   `200 OK`: Authentication successful.
    *   `401 Unauthorized`: Invalid username or incorrect password.
    *   `400 Bad Request`: Validation error in payload.
*   **Payload Structure (on success):**
    ```json
    {
      "message": "Authentication successful",
      "username": "..."
    }
    ```
*   **Error Structure:**
    All error responses will return a body structured as follows:
    ```json
    {
      "isError": true,
      "messages": ["message details"]
    }
    ```