-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" VARCHAR(50),
ADD COLUMN "avatarUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
