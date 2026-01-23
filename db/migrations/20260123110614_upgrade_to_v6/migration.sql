-- AlterTable
ALTER TABLE "_ProductModifierValueToProductVariant" ADD CONSTRAINT "_ProductModifierValueToProductVariant_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProductModifierValueToProductVariant_AB_unique";
