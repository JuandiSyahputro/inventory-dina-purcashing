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

  interface ProductDefinedItem {
    store: { id: string; name: string; createdAt: Date; updatedAt: Date } | null;
    vendor: { id: string; name: string; createdAt: Date; updatedAt: Date } | null;
    unit: { id: string; name: string; createdAt: Date; updatedAt: Date } | null;
    categories: { id: string; name: string; createdAt: Date; updatedAt: Date } | null;
    id: string;
    prCode: string | null;
    productCode: string | null;
    productSubCode: string | null;
    name: string | null;
    price: number | null;
    stockIn: number | null;
    stockOut: number | null;
    dateIn: Date | null;
    dateOut: Date | null;
    remarks: string | null;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    storeId: string | null;
    unitId: string | null;
    vendorId: string | null;
    categoryId: string | null;
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
