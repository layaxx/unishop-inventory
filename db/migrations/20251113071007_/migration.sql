-- AlterTable
ALTER TABLE "AuditLogStocktaking" ADD COLUMN     "pDFId" INTEGER;

-- AddForeignKey
ALTER TABLE "AuditLogStocktaking" ADD CONSTRAINT "AuditLogStocktaking_pDFId_fkey" FOREIGN KEY ("pDFId") REFERENCES "PDF"("id") ON DELETE SET NULL ON UPDATE CASCADE;
