import range from "lodash/range";
import { faker } from "@faker-js/faker";

import Seeder from "./seeder";

class UserSeed extends Seeder {
  constructor(count: number = 10) {
    super(count);
    this.count = count;
    this.createData();
  }

  createData() {
    range(this.count).forEach(() => {
      this._data.push({
        name: faker.person.firstName(),
        stockIn: faker.number.int({ min: 1, max: 100 }),
        storeId: "cmh1i7nef00005bs6j411pgn8",
        createdAt: faker.date.anytime(),
      });
    });
  }
}

export default UserSeed;
