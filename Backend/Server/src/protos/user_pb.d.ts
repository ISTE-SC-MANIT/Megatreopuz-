// package: protos
// file: user.proto

import * as jspb from "google-protobuf";
import * as utils_pb from "./utils_pb";

export class CreateLocalPlayerRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): void;

  getName(): string;
  setName(value: string): void;

  getPhone(): string;
  setPhone(value: string): void;

  getCollege(): string;
  setCollege(value: string): void;

  getCountry(): string;
  setCountry(value: string): void;

  getYear(): number;
  setYear(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateLocalPlayerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateLocalPlayerRequest): CreateLocalPlayerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateLocalPlayerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateLocalPlayerRequest;
  static deserializeBinaryFromReader(message: CreateLocalPlayerRequest, reader: jspb.BinaryReader): CreateLocalPlayerRequest;
}

export namespace CreateLocalPlayerRequest {
  export type AsObject = {
    username: string,
    name: string,
    phone: string,
    college: string,
    country: string,
    year: number,
  }
}

export class UpdateLocalPlayerRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getPhone(): string;
  setPhone(value: string): void;

  getCollege(): string;
  setCollege(value: string): void;

  getCountry(): string;
  setCountry(value: string): void;

  getYear(): number;
  setYear(value: number): void;

  getUsername(): string;
  setUsername(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateLocalPlayerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateLocalPlayerRequest): UpdateLocalPlayerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateLocalPlayerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateLocalPlayerRequest;
  static deserializeBinaryFromReader(message: UpdateLocalPlayerRequest, reader: jspb.BinaryReader): UpdateLocalPlayerRequest;
}

export namespace UpdateLocalPlayerRequest {
  export type AsObject = {
    name: string,
    phone: string,
    college: string,
    country: string,
    year: number,
    username: string,
  }
}

export class getPlayerResponse extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getEmail(): string;
  setEmail(value: string): void;

  getUsername(): string;
  setUsername(value: string): void;

  getName(): string;
  setName(value: string): void;

  getPhone(): string;
  setPhone(value: string): void;

  getCollege(): string;
  setCollege(value: string): void;

  getCountry(): string;
  setCountry(value: string): void;

  getYear(): number;
  setYear(value: number): void;

  getAttempts(): number;
  setAttempts(value: number): void;

  getTotalsolvedquestions(): number;
  setTotalsolvedquestions(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): getPlayerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: getPlayerResponse): getPlayerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: getPlayerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): getPlayerResponse;
  static deserializeBinaryFromReader(message: getPlayerResponse, reader: jspb.BinaryReader): getPlayerResponse;
}

export namespace getPlayerResponse {
  export type AsObject = {
    id: string,
    email: string,
    username: string,
    name: string,
    phone: string,
    college: string,
    country: string,
    year: number,
    attempts: number,
    totalsolvedquestions: number,
  }
}

export class AnswerQuestion extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getEmail(): string;
  setEmail(value: string): void;

  getQuestionno(): number;
  setQuestionno(value: number): void;

  getAnswer(): string;
  setAnswer(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnswerQuestion.AsObject;
  static toObject(includeInstance: boolean, msg: AnswerQuestion): AnswerQuestion.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AnswerQuestion, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnswerQuestion;
  static deserializeBinaryFromReader(message: AnswerQuestion, reader: jspb.BinaryReader): AnswerQuestion;
}

export namespace AnswerQuestion {
  export type AsObject = {
    id: string,
    email: string,
    questionno: number,
    answer: string,
  }
}

export class GetNextQuestionRespone extends jspb.Message {
  getQuestionno(): number;
  setQuestionno(value: number): void;

  getQuestion(): string;
  setQuestion(value: string): void;

  getQuestionid(): string;
  setQuestionid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNextQuestionRespone.AsObject;
  static toObject(includeInstance: boolean, msg: GetNextQuestionRespone): GetNextQuestionRespone.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNextQuestionRespone, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNextQuestionRespone;
  static deserializeBinaryFromReader(message: GetNextQuestionRespone, reader: jspb.BinaryReader): GetNextQuestionRespone;
}

export namespace GetNextQuestionRespone {
  export type AsObject = {
    questionno: number,
    question: string,
    questionid: string,
  }
}

export class CreateQuestionRequest extends jspb.Message {
  getQuestionno(): number;
  setQuestionno(value: number): void;

  getImgurl(): string;
  setImgurl(value: string): void;

  getAnswer(): string;
  setAnswer(value: string): void;

  getQuestion(): string;
  setQuestion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateQuestionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateQuestionRequest): CreateQuestionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateQuestionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateQuestionRequest;
  static deserializeBinaryFromReader(message: CreateQuestionRequest, reader: jspb.BinaryReader): CreateQuestionRequest;
}

export namespace CreateQuestionRequest {
  export type AsObject = {
    questionno: number,
    imgurl: string,
    answer: string,
    question: string,
  }
}

export class GetLeaderBoardResponse extends jspb.Message {
  clearUsersList(): void;
  getUsersList(): Array<User>;
  setUsersList(value: Array<User>): void;
  addUsers(value?: User, index?: number): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLeaderBoardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetLeaderBoardResponse): GetLeaderBoardResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetLeaderBoardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLeaderBoardResponse;
  static deserializeBinaryFromReader(message: GetLeaderBoardResponse, reader: jspb.BinaryReader): GetLeaderBoardResponse;
}

export namespace GetLeaderBoardResponse {
  export type AsObject = {
    usersList: Array<User.AsObject>,
  }
}

export class User extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getQuestionsattempted(): number;
  setQuestionsattempted(value: number): void;

  getUsername(): string;
  setUsername(value: string): void;

  getLastansweredquestiontime(): string;
  setLastansweredquestiontime(value: string): void;

  getUserid(): string;
  setUserid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    name: string,
    questionsattempted: number,
    username: string,
    lastansweredquestiontime: string,
    userid: string,
  }
}

export class GetRankResponse extends jspb.Message {
  getRank(): number;
  setRank(value: number): void;

  getTotalusers(): number;
  setTotalusers(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRankResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRankResponse): GetRankResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetRankResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRankResponse;
  static deserializeBinaryFromReader(message: GetRankResponse, reader: jspb.BinaryReader): GetRankResponse;
}

export namespace GetRankResponse {
  export type AsObject = {
    rank: number,
    totalusers: number,
  }
}

