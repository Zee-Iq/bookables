import mongoose from "mongoose";
import Bookables from "types";

export class SpaceNotFoundError extends mongoose.Error.DocumentNotFoundError {
  constructor(public spaceId: string) {
    super(`Unable to find Space with id: ${spaceId}`);
  }
}

export class BookableNotFoundError extends mongoose.Error.DocumentNotFoundError {
  constructor(public bookableId: string, public spaceId: string) {
    super(
      `Unable to find Bookable with id: ${bookableId} in Space with id: ${spaceId}`
    );
  }
}

export class ClientError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class UnexpectedResponseError extends Error {
  constructor(public response: any, api: string) {
    super(`Unexpected Response from api: ${api}`);
  }
}

export class NoLocationFoundError extends ClientError {
  constructor(public givenAddress: Bookables.Address) {
    super("No location found for given Address.");
  }
}

export class MissingQueryParameterError extends ClientError {
  constructor(
    public requiredParameters: string[],
    public receivedParameters: any
  ) {
    super("Missing Query Parameters in Request.");
    this.name = MissingQueryParameterError.name
  }
}

export class MultipleLocationsFoundError extends ClientError {
  constructor(
    public givenAddress: Bookables.Address,
    public possibleAddresses: Bookables.Address[]
  ) {
    super("Multiple Locations found for given Address.");
    this.name = MultipleLocationsFoundError.name
  }
}

export class InvalidQueryParameterError extends ClientError {
  constructor(
    public parameterName: string,
    public expectedValues: string | string[],
    public receivedValue: any
  ) {
    super("Received Invalid Query Parameter");
    this.name = InvalidQueryParameterError.name
  }
}
