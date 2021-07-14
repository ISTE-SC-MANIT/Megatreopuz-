// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var user_pb = require('./user_pb.js');
var utils_pb = require('./utils_pb.js');

function serialize_protos_AnswerQuestion(arg) {
  if (!(arg instanceof user_pb.AnswerQuestion)) {
    throw new Error('Expected argument of type protos.AnswerQuestion');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_AnswerQuestion(buffer_arg) {
  return user_pb.AnswerQuestion.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_CreateLocalPlayerRequest(arg) {
  if (!(arg instanceof user_pb.CreateLocalPlayerRequest)) {
    throw new Error('Expected argument of type protos.CreateLocalPlayerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_CreateLocalPlayerRequest(buffer_arg) {
  return user_pb.CreateLocalPlayerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_CreateQuestionRequest(arg) {
  if (!(arg instanceof user_pb.CreateQuestionRequest)) {
    throw new Error('Expected argument of type protos.CreateQuestionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_CreateQuestionRequest(buffer_arg) {
  return user_pb.CreateQuestionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_Empty(arg) {
  if (!(arg instanceof utils_pb.Empty)) {
    throw new Error('Expected argument of type protos.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_Empty(buffer_arg) {
  return utils_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_GetLeaderBoardResponse(arg) {
  if (!(arg instanceof user_pb.GetLeaderBoardResponse)) {
    throw new Error('Expected argument of type protos.GetLeaderBoardResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_GetLeaderBoardResponse(buffer_arg) {
  return user_pb.GetLeaderBoardResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_GetNextQuestionRespone(arg) {
  if (!(arg instanceof user_pb.GetNextQuestionRespone)) {
    throw new Error('Expected argument of type protos.GetNextQuestionRespone');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_GetNextQuestionRespone(buffer_arg) {
  return user_pb.GetNextQuestionRespone.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_UpdateLocalPlayerRequest(arg) {
  if (!(arg instanceof user_pb.UpdateLocalPlayerRequest)) {
    throw new Error('Expected argument of type protos.UpdateLocalPlayerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_UpdateLocalPlayerRequest(buffer_arg) {
  return user_pb.UpdateLocalPlayerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_getPlayerResponse(arg) {
  if (!(arg instanceof user_pb.getPlayerResponse)) {
    throw new Error('Expected argument of type protos.getPlayerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_getPlayerResponse(buffer_arg) {
  return user_pb.getPlayerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var UserServiceService = exports.UserServiceService = {
  createLocalPlayer: {
    path: '/protos.UserService/createLocalPlayer',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.CreateLocalPlayerRequest,
    responseType: utils_pb.Empty,
    requestSerialize: serialize_protos_CreateLocalPlayerRequest,
    requestDeserialize: deserialize_protos_CreateLocalPlayerRequest,
    responseSerialize: serialize_protos_Empty,
    responseDeserialize: deserialize_protos_Empty,
  },
  updateLocalPlayer: {
    path: '/protos.UserService/updateLocalPlayer',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UpdateLocalPlayerRequest,
    responseType: utils_pb.Empty,
    requestSerialize: serialize_protos_UpdateLocalPlayerRequest,
    requestDeserialize: deserialize_protos_UpdateLocalPlayerRequest,
    responseSerialize: serialize_protos_Empty,
    responseDeserialize: deserialize_protos_Empty,
  },
  getPlayer: {
    path: '/protos.UserService/getPlayer',
    requestStream: false,
    responseStream: false,
    requestType: utils_pb.Empty,
    responseType: user_pb.getPlayerResponse,
    requestSerialize: serialize_protos_Empty,
    requestDeserialize: deserialize_protos_Empty,
    responseSerialize: serialize_protos_getPlayerResponse,
    responseDeserialize: deserialize_protos_getPlayerResponse,
  },
  answerQuestion: {
    path: '/protos.UserService/answerQuestion',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.AnswerQuestion,
    responseType: utils_pb.Empty,
    requestSerialize: serialize_protos_AnswerQuestion,
    requestDeserialize: deserialize_protos_AnswerQuestion,
    responseSerialize: serialize_protos_Empty,
    responseDeserialize: deserialize_protos_Empty,
  },
  getNextQuestion: {
    path: '/protos.UserService/getNextQuestion',
    requestStream: false,
    responseStream: false,
    requestType: utils_pb.Empty,
    responseType: user_pb.GetNextQuestionRespone,
    requestSerialize: serialize_protos_Empty,
    requestDeserialize: deserialize_protos_Empty,
    responseSerialize: serialize_protos_GetNextQuestionRespone,
    responseDeserialize: deserialize_protos_GetNextQuestionRespone,
  },
  createQuestion: {
    path: '/protos.UserService/createQuestion',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.CreateQuestionRequest,
    responseType: utils_pb.Empty,
    requestSerialize: serialize_protos_CreateQuestionRequest,
    requestDeserialize: deserialize_protos_CreateQuestionRequest,
    responseSerialize: serialize_protos_Empty,
    responseDeserialize: deserialize_protos_Empty,
  },
  getLeaderBoard: {
    path: '/protos.UserService/getLeaderBoard',
    requestStream: false,
    responseStream: false,
    requestType: utils_pb.Empty,
    responseType: user_pb.GetLeaderBoardResponse,
    requestSerialize: serialize_protos_Empty,
    requestDeserialize: deserialize_protos_Empty,
    responseSerialize: serialize_protos_GetLeaderBoardResponse,
    responseDeserialize: deserialize_protos_GetLeaderBoardResponse,
  },
};

exports.UserServiceClient = grpc.makeGenericClientConstructor(UserServiceService);
