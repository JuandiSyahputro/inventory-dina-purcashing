export {};
declare global {
  interface ProductTypes {
    id: string;
    prCode: string | null;
    productCode?: string;
    productSubCode?: string;
    name: string;
    price: number | null;
    stockIn: number;
    stockCurrent: number;
    stockOut: number;
    dateIn: Date;
    dateOut: Date;
    remarks: string;
    status: number;
    storeId: string;
    storeName: string;
    unitId: string;
    unitName: string;
    vendorId: string;
    vendorName: string;
    categoryId: string;
    categoryName: string;
    createdAt: Date;
    updatedAt: Date;
    store: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
    unit: {
      id: string;
      name: string;
    } | null;
    vendor: {
      id: string;
      name: string;
    } | null;
    categories: {
      id: string;
      name: string;
    } | null;
  }

  interface GetProductItemTypes {
    store_name?: string;
    status?: number | string;
    limit?: number | string;
    page?: number | string;
  }

  interface ProductUpdatedTypes {
    product: ProductTypes;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<{ updatedProduct: boolean; deletedProduct: boolean }>>;
  }
  interface ProductUpdatedAdminTypes {
    product: ProductTypes;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<{ approvedProduct: boolean; updatedProduct: boolean; deletedProduct: boolean }>>;
  }
}
