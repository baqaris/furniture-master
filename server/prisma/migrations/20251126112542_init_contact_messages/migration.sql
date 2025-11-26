-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContactMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "projectType" TEXT,
    "message" TEXT NOT NULL,
    "preferPhone" BOOLEAN DEFAULT false,
    "preferEmail" BOOLEAN DEFAULT false,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ContactMessage" ("createdAt", "email", "id", "isRead", "message", "name", "phone", "preferEmail", "preferPhone", "projectType") SELECT "createdAt", "email", "id", "isRead", "message", "name", "phone", "preferEmail", "preferPhone", "projectType" FROM "ContactMessage";
DROP TABLE "ContactMessage";
ALTER TABLE "new_ContactMessage" RENAME TO "ContactMessage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
