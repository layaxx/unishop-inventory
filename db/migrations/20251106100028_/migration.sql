-- AlterTable
ALTER TABLE "ProductModifierValue" ADD COLUMN     "order" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "image" TEXT;
