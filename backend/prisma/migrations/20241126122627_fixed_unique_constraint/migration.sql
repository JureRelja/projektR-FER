/*
  Warnings:

  - A unique constraint covering the columns `[socketId,roomId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Participant_id_roomId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Participant_socketId_roomId_key" ON "Participant"("socketId", "roomId");
