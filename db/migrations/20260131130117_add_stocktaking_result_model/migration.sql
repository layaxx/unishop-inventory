-- CreateTable
CREATE TABLE "StocktakingCount" (
    "id" SERIAL NOT NULL,
    "auditLogStocktakingId" INTEGER NOT NULL,
    "variantId" INTEGER NOT NULL,
    "quantityCounted" INTEGER NOT NULL,

    CONSTRAINT "StocktakingCount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StocktakingCount" ADD CONSTRAINT "StocktakingCount_auditLogStocktakingId_fkey" FOREIGN KEY ("auditLogStocktakingId") REFERENCES "AuditLogStocktaking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StocktakingCount" ADD CONSTRAINT "StocktakingCount_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
