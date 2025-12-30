import { DataTableSkeleton } from "@/components/data-table/table-skeleton";
import { Suspense } from "react";
import { columnProduct } from "./column-product";
import OverviewTable from "./overview-table";
// import ProductExport from "@/components/products/admin/product-export";

const ProductPageOverview = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const params = (await searchParams)?.store_name;
  const limitSize = (await searchParams)?.limit;

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Product Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={columnProduct} />}>
        <OverviewTable storeName={params} limit={Number(limitSize)} />
      </Suspense>
    </div>
  );
};

export default ProductPageOverview;
