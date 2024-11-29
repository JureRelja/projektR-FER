/*
  Warnings:

  - You are about to drop the column `name` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Room` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "name",
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_uuid_key" ON "Room"("uuid");
