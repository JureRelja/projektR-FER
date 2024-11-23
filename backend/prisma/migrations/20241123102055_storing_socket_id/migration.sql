/*
  Warnings:

  - A unique constraint covering the columns `[socketId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `socketId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "socketId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_socketId_key" ON "Participant"("socketId");
