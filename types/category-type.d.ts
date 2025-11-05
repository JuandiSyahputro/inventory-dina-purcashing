export {};
declare global {
  interface CategoryTypes {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface CategoryUpdatedTypes {
    category: CategoryTypes;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<{ updatedCategory: boolean; deletedCategory: boolean }>>;
  }
}
