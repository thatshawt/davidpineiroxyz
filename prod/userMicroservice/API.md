# User Microservice API Endpoints
All the data is expected to be JSON.

## POST /users
Creates a new user.

| Field | Type | Description |
|-------|------|-------------|
| username | String | The unique identifier for the user. |
| email | String | The email address of the user. |
| password | String | The plain-text password of the user. |

## GET /users
Reads all users.

| Field | Type | Description |
|-------|------|-------------|
| username | String | The unique identifier for the user. |
| email | String | The email address of the user. |
| password | String | The plain-text password of the user. |

## GET /users/:username
Reads a single user by username.

| Field | Type | Description |
|-------|------|-------------|
| username | String | The unique identifier for the user. |
| email | String | The email address of the user. |
| password | String | The plain-text password of the user. |

## PUT /users/:username
Updates an existing user.

| Field | Type | Description |
|-------|------|-------------|
| username | String | The new username. |
| email | String | The new email address. |
| password | String | The new plain-text password. |

## DELETE /users/:username
Deletes an existing user.

| Field | Type | Description |
|-------|------|-------------|
| username | String | The unique identifier for the user. |