// package: protos
// file: auth.proto

import * as jspb from "google-protobuf";
import * as utils_pb from "./utils_pb";

export class CheckUsernameAvailabilityRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckUsernameAvailabilityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckUsernameAvailabilityRequest): CheckUsernameAvailabilityRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckUsernameAvailabilityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckUsernameAvailabilityRequest;
  static deserializeBinaryFromReader(message: CheckUsernameAvailabilityRequest, reader: jspb.BinaryReader): CheckUsernameAvailabilityRequest;
}

export namespace CheckUsernameAvailabilityRequest {
  export type AsObject = {
    username: string,
  }
}

export class CheckUsernameAvailabilityResponse extends jspb.Message {
  getAvailable(): boolean;
  setAvailable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckUsernameAvailabilityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckUsernameAvailabilityResponse): CheckUsernameAvailabilityResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckUsernameAvailabilityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckUsernameAvailabilityResponse;
  static deserializeBinaryFromReader(message: CheckUsernameAvailabilityResponse, reader: jspb.BinaryReader): CheckUsernameAvailabilityResponse;
}

export namespace CheckUsernameAvailabilityResponse {
  export type AsObject = {
    available: boolean,
  }
}

export class CheckStateResponse extends jspb.Message {
  getInitialised(): boolean;
  setInitialised(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckStateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckStateResponse): CheckStateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckStateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckStateResponse;
  static deserializeBinaryFromReader(message: CheckStateResponse, reader: jspb.BinaryReader): CheckStateResponse;
}

export namespace CheckStateResponse {
  export type AsObject = {
    initialised: boolean,
  }
}

