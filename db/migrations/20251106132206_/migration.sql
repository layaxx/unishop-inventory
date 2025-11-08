/*
  Warnings:

  - You are about to drop the column `productModifierValueId` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productModifierValueId_fkey";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "productModifierValueId";

-- CreateTable
CREATE TABLE "_ProductModifierValueToProductVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductModifierValueToProductVariant_AB_unique" ON "_ProductModifierValueToProductVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductModifierValueToProductVariant_B_index" ON "_ProductModifierValueToProductVariant"("B");

-- AddForeignKey
ALTER TABLE "_ProductModifierValueToProductVariant" ADD CONSTRAINT "_ProductModifierValueToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductModifierValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductModifierValueToProductVariant" ADD CONSTRAINT "_ProductModifierValueToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
