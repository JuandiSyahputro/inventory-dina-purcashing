-- CreateTable
CREATE TABLE "product_items" (
    "id" TEXT NOT NULL,
    "pr_code" TEXT,
    "product_code" TEXT,
    "product_sub_code" TEXT,
    "name" TEXT,
    "price" DOUBLE PRECISION,
    "stock_in" INTEGER,
    "stock_current" INTEGER,
    "stock_out" INTEGER,
    "date_in" TIMESTAMP(3),
    "date_out" TIMESTAMP(3),
    "remarks" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "store_id" TEXT,
    "unit_id" TEXT,
    "vendor_id" TEXT,
    "category_id" TEXT,

    CONSTRAINT "product_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_product_item" (
    "id" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "history_product_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "product_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_items" ADD CONSTRAINT "product_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_product_item" ADD CONSTRAINT "history_product_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
