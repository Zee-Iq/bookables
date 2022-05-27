declare namespace Bookables {
  type UserRole = "tenant" | "host";

  interface PayoutInformation {
    bic: string;
    iban: string;
    owner: string;
  }

  type PaymentProvider = {
    provider: "creditcard";
    cardnumber: number;
    validationNumber: number;
    owner: string;
    expiration: Date;
  };

  interface Email {
    address: string;
    isConfirmed: boolean;
  }
  interface User {
    email: Email;
    password: string;
    roles: UserRole[];
    paymentProviders?: PaymentProvider[];
    payoutInformation?: PayoutInformation;
   
  }

  interface Tenant extends User {
    roles: ["tenant"];
    paymentProviders: [PaymentProvider];
  }

  interface Host extends User {
    roles: ["host"];
    payoutInformation: PayoutInformation;
  }

  export type BookableType = "seat" | "room";
  interface Bookable {
    id: string;
    type: BookableType;
    equipment: String[];
  }

  interface ContactInformation {
    email: string;
    phoneNumber?: string;
  }

  interface Address {
    countryCode: string;
    postalCode: string;
    streetName: string;
    houseNumber: string;
    name: string;
  }

  type Latitude = number;
  type Longitude = number;
  type Coordinates = [Latitude, Longitude];

  type Point = {
    type: "Point";
    coordinates: Coordinates;
  };
  interface Space {
    owner: string; //Reference to Host
    name: string;
    description: string;
    address: Address;
    point: Point;
    contactInformation: ContactInformation;
  }
}

export default Bookables;
