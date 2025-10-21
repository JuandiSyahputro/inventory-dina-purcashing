/*
  Warnings:

  - Changed the type of `role` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'USER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);
