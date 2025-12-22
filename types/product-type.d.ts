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
    status?: number | string | number[];
    queryParams: FetchDataPropsTypes;
  }

  interface ProductUpdatedTypes {
    product: ProductTypes;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<{ updatedProduct: boolean; deletedProduct: boolean }>>;
  }

  interface DialogActionPropsTypes {
    approvedProduct: boolean;
    rejectedProduct: boolean;
    updatedProduct: boolean;
    approvedOutProduct: boolean;
    rejectedOutProduct: boolean;
    deletedProduct: boolean;
  }

  interface ProductUpdatedAdminTypes {
    product: ProductTypes;
    type?: string;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<DialogActionPropsTypes>>;
  }

  interface ListDataTypes {
    categories?: { id: string; name: string }[];
    units?: { id: string; name: string }[];
    vendors?: { id: string; name: string }[];
    stores?: { id: string; name: string }[];
  }
}
