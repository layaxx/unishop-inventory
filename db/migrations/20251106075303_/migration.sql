/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `ProductModifierType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productModifierTypeId_fkey";

-- DropIndex
DROP INDEX "Product_productModifierTypeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProductModifierType_productId_key" ON "ProductModifierType"("productId");

-- AddForeignKey
ALTER TABLE "ProductModifierType" ADD CONSTRAINT "ProductModifierType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
