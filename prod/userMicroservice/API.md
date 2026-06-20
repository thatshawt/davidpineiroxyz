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
*   **Payload Structure:** (Returns the user object with plaintext password as per schema)
    ```json
    {
      "username": "...",
      "email": "...",
      "password": "..."
    }
    ```

---

## 2. GET /users
Reads all users.

### Input
*   **Endpoint:** `GET /users`
*   **Content-Type:** N/A (No body required)

### Output
*   **Status Code:** `200 OK`
*   **Payload Structure:** Array of users
    ```json
    [
      {
        "username": "...",
        "email": "..."
      },
      ...
    ]
    ```

---

## 3. GET /users/:username
Reads a single user by username.

### Input
*   **Endpoint:** `GET /users/{username}`
*   **Path Parameter (`username`):**
    | Field | Type | Description | Constraints | Required |
    |-------|------|-------------|-------------|----------|
    | `username` | String | The unique identifier for the user. | Must match alphanumeric constraints; Auto-converted to lowercase by the server. | **Yes** (URL) |

### Output
*   **Status Code:** `200 OK` or `404 Not Found`
*   **Payload Structure:** Single user object
    ```json
    {
      "username": "...",
      "email": "..."
    }
    ```

---

## 4. PUT /users/:username
Updates an existing user.
**Behavior:** Fields not provided in the request body will retain their previous values (partial update). If fields are provided, they must meet the creation constraints.

### Input
*   **Endpoint:** `PUT /users/{username}`
*   **Path Parameter (`username`):** The unique identifier to locate the user to update.
    | Field | Type | Description | Constraints | Required |
    |-------|------|-------------|-------------|----------|
    | `username` | String | The new username. | Min 3, Max 30 chars; Alphanumeric; Auto-converted to lowercase. | **If provided** |

*   **Payload (Optional fields):**
    | Field | Type | Description | Constraints | Required |
    |-------|------|-------------|-------------|----------|
    | `email` | String | The new email address. | Valid format; Trimmed whitespace; Auto-converted to lowercase. | **If provided** |
    | `password` | String | The new plain-text password. | Min 8, Max 100 chars; Must contain at least one letter and one number. | **If provided** |

### Output
*   **Status Code:** `200 OK` (if successful) or `4xx/5xx` if validation fails or user not found.
*   **Payload Structure:** Updated user object (includes plaintext password)
    ```json
    {
      "username": "...",
      "email": "...",
      "password": "..."
    }
    ```

---

## 5. DELETE /users/:username
Deletes an existing user.

### Input
*   **Endpoint:** `DELETE /users/{username}`
*   **Path Parameter (`username`):** The unique identifier to locate the user to delete.
    | Field | Type | Description | Constraints | Required |
    |-------|------|-------------|-------------|----------|
    | `username` | String | The unique identifier for the user. | Must match alphanumeric constraints; Auto-converted to lowercase by the server. | **Yes** (URL) |

### Output
*   **Status Code:** `204 No Content` (if successful), `200 OK` with success message (varies by implementation), or `4xx/5xx` if user not found.
    ```json
    // Example Response Body for 204: {}
    // Example Response Body for 404: {"error": "User not found"}
