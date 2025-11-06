/*
  Warnings:

  - A unique constraint covering the columns `[variantModifierValueId]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `variantModifierValueId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VariantModifierValue" DROP CONSTRAINT "VariantModifierValue_variantId_fkey";

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "variantModifierValueId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "VariantModifierValue" ALTER COLUMN "variantId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_variantModifierValueId_key" ON "ProductVariant"("variantModifierValueId");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_variantModifierValueId_fkey" FOREIGN KEY ("variantModifierValueId") REFERENCES "VariantModifierValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
