-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "movementBatchId" INTEGER;

-- CreateTable
CREATE TABLE "MovementBatch" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "MovementBatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_movementBatchId_fkey" FOREIGN KEY ("movementBatchId") REFERENCES "MovementBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
