import { Role } from "@prisma/client";

export {};
declare global {
  interface StoreTypes {
    stores: {
      name: string;
      id: string;
    }[];
    user?: User;
  }
}
