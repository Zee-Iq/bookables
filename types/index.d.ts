declare namespace Bookables {
    interface User {
      email: string;
      password: string;
      doesSomething(): number;
      phoneNumber: string;
    }
    interface SpecialUser extends User {
      somethingElse: string;
    }
  }

export default Bookables