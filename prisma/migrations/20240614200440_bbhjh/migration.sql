-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "specifications" DROP NOT NULL,
ALTER COLUMN "specifications" SET DATA TYPE TEXT;
