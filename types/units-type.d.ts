export {};
declare global {
  interface UnitTypes {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface UnitUpdatedTypes {
    unit: UnitTypes;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<{ updatedUnit: boolean; deletedUnit: boolean }>>;
  }
}
