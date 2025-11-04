export {};
declare global {
  interface UsersTypes {
    id: string;
    name: string;
    email: string;
    role: string;
    store_id: string;
    store_name?: string | null;
    data_stores?: StoreTypes;
  }

  interface UserUpdatedTypes {
    user: UsersTypes;
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<{ updatedUser: boolean; deletedUser: boolean; changePassword: boolean }>>;
  }
}
