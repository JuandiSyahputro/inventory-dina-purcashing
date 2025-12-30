-- CreateIndex
CREATE INDEX "product_categories_name_idx" ON "product_categories"("name");

-- CreateIndex
CREATE INDEX "product_categories_created_at_idx" ON "product_categories"("created_at");

-- CreateIndex
CREATE INDEX "product_items_name_idx" ON "product_items"("name");

-- CreateIndex
CREATE INDEX "product_items_product_code_idx" ON "product_items"("product_code");

-- CreateIndex
CREATE INDEX "product_items_status_idx" ON "product_items"("status");

-- CreateIndex
CREATE INDEX "product_items_created_at_idx" ON "product_items"("created_at");

-- CreateIndex
CREATE INDEX "product_units_name_idx" ON "product_units"("name");

-- CreateIndex
CREATE INDEX "product_units_created_at_idx" ON "product_units"("created_at");

-- CreateIndex
CREATE INDEX "store_name_idx" ON "store"("name");

-- CreateIndex
CREATE INDEX "store_created_at_idx" ON "store"("created_at");

-- CreateIndex
CREATE INDEX "vendor_name_idx" ON "vendor"("name");

-- CreateIndex
CREATE INDEX "vendor_created_at_idx" ON "vendor"("created_at");
