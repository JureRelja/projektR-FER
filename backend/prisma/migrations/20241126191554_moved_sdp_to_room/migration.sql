/*
  Warnings:

  - You are about to drop the column `sdp` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `sdpType` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "sdp",
DROP COLUMN "sdpType";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "sdp" TEXT,
ADD COLUMN     "sdpType" TEXT;
