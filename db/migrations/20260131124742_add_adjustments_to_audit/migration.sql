-- AlterTable
ALTER TABLE "AuditLogStocktaking" ADD COLUMN     "movementBatchId" INTEGER;

-- AddForeignKey
ALTER TABLE "AuditLogStocktaking" ADD CONSTRAINT "AuditLogStocktaking_movementBatchId_fkey" FOREIGN KEY ("movementBatchId") REFERENCES "MovementBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
