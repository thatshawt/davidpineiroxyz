-- CreateTable
CREATE TABLE "signupData" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);
