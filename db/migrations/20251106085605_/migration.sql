/*
  Warnings:

  - You are about to drop the column `variantModifierValueId` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the `VariantModifierValue` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productModifierValueId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_variantModifierValueId_fkey";

-- DropForeignKey
ALTER TABLE "VariantModifierValue" DROP CONSTRAINT "VariantModifierValue_modifierValueId_fkey";

-- DropIndex
DROP INDEX "ProductVariant_variantModifierValueId_key";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "variantModifierValueId",
ADD COLUMN     "productModifierValueId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "VariantModifierValue";

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productModifierValueId_fkey" FOREIGN KEY ("productModifierValueId") REFERENCES "ProductModifierValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
