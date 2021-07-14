// GENERATED CODE -- DO NOT EDIT!

// package: protos
// file: user.proto

import * as user_pb from "./user_pb";
import * as utils_pb from "./utils_pb";
import * as grpc from "grpc";

interface IUserServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  createLocalPlayer: grpc.MethodDefinition<user_pb.CreateLocalPlayerRequest, utils_pb.Empty>;
  updateLocalPlayer: grpc.MethodDefinition<user_pb.UpdateLocalPlayerRequest, utils_pb.Empty>;
  getPlayer: grpc.MethodDefinition<utils_pb.Empty, user_pb.getPlayerResponse>;
  answerQuestion: grpc.MethodDefinition<user_pb.AnswerQuestion, utils_pb.Empty>;
  getNextQuestion: grpc.MethodDefinition<utils_pb.Empty, user_pb.GetNextQuestionRespone>;
  createQuestion: grpc.MethodDefinition<user_pb.CreateQuestionRequest, utils_pb.Empty>;
  getLeaderBoard: grpc.MethodDefinition<utils_pb.Empty, user_pb.GetLeaderBoardResponse>;
}

export const UserServiceService: IUserServiceService;

export class UserServiceClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  createLocalPlayer(argument: user_pb.CreateLocalPlayerRequest, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  createLocalPlayer(argument: user_pb.CreateLocalPlayerRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  createLocalPlayer(argument: user_pb.CreateLocalPlayerRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  updateLocalPlayer(argument: user_pb.UpdateLocalPlayerRequest, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  updateLocalPlayer(argument: user_pb.UpdateLocalPlayerRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  updateLocalPlayer(argument: user_pb.UpdateLocalPlayerRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  getPlayer(argument: utils_pb.Empty, callback: grpc.requestCallback<user_pb.getPlayerResponse>): grpc.ClientUnaryCall;
  getPlayer(argument: utils_pb.Empty, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.getPlayerResponse>): grpc.ClientUnaryCall;
  getPlayer(argument: utils_pb.Empty, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.getPlayerResponse>): grpc.ClientUnaryCall;
  answerQuestion(argument: user_pb.AnswerQuestion, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  answerQuestion(argument: user_pb.AnswerQuestion, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  answerQuestion(argument: user_pb.AnswerQuestion, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  getNextQuestion(argument: utils_pb.Empty, callback: grpc.requestCallback<user_pb.GetNextQuestionRespone>): grpc.ClientUnaryCall;
  getNextQuestion(argument: utils_pb.Empty, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.GetNextQuestionRespone>): grpc.ClientUnaryCall;
  getNextQuestion(argument: utils_pb.Empty, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.GetNextQuestionRespone>): grpc.ClientUnaryCall;
  createQuestion(argument: user_pb.CreateQuestionRequest, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  createQuestion(argument: user_pb.CreateQuestionRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  createQuestion(argument: user_pb.CreateQuestionRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<utils_pb.Empty>): grpc.ClientUnaryCall;
  getLeaderBoard(argument: utils_pb.Empty, callback: grpc.requestCallback<user_pb.GetLeaderBoardResponse>): grpc.ClientUnaryCall;
  getLeaderBoard(argument: utils_pb.Empty, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.GetLeaderBoardResponse>): grpc.ClientUnaryCall;
  getLeaderBoard(argument: utils_pb.Empty, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<user_pb.GetLeaderBoardResponse>): grpc.ClientUnaryCall;
}
