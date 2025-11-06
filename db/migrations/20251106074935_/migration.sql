/*
  Warnings:

  - A unique constraint covering the columns `[productModifierTypeId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productModifierTypeId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductModifierType" DROP CONSTRAINT "ProductModifierType_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productModifierTypeId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_productModifierTypeId_key" ON "Product"("productModifierTypeId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productModifierTypeId_fkey" FOREIGN KEY ("productModifierTypeId") REFERENCES "ProductModifierType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
