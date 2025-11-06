export {};
declare global {
  interface VendorTypes {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface VendorUpdatedTypes {
    vendor: VendorTypes;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<{ updatedVendor: boolean; deletedVendor: boolean }>>;
  }
}
