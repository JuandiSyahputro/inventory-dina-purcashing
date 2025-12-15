import { PrismaClient } from "@prisma/client";
import UserSeed from "./userSeed";

const prisma = new PrismaClient();

const main = async () => {
  try {
    const users = new UserSeed(100);

    for (const user of users.data) {
      await prisma.productItems.create({
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(user as any),
        },
      });
    }

    console.log(`Database has been seeded. 🚀`);
  } catch (e) {
    throw e;
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
