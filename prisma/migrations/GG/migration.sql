-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "rental" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "comment" TEXT NOT NULL DEFAULT 'comment',
    "commenter" TEXT NOT NULL DEFAULT 'commenter',
    "carplate" TEXT NOT NULL DEFAULT 'ZZ12345'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Car_username_key" ON "Car"("username");
