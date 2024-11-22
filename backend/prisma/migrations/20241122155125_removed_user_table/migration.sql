/*
  Warnings:

  - You are about to drop the column `userId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,roomId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_userId_fkey";

-- DropIndex
DROP INDEX "Participant_userId_roomId_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "Participant_id_roomId_key" ON "Participant"("id", "roomId");
