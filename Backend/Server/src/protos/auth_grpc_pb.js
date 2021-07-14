// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var auth_pb = require('./auth_pb.js');
var utils_pb = require('./utils_pb.js');

function serialize_protos_CheckStateResponse(arg) {
  if (!(arg instanceof auth_pb.CheckStateResponse)) {
    throw new Error('Expected argument of type protos.CheckStateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_CheckStateResponse(buffer_arg) {
  return auth_pb.CheckStateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_CheckUsernameAvailabilityRequest(arg) {
  if (!(arg instanceof auth_pb.CheckUsernameAvailabilityRequest)) {
    throw new Error('Expected argument of type protos.CheckUsernameAvailabilityRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_CheckUsernameAvailabilityRequest(buffer_arg) {
  return auth_pb.CheckUsernameAvailabilityRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_CheckUsernameAvailabilityResponse(arg) {
  if (!(arg instanceof auth_pb.CheckUsernameAvailabilityResponse)) {
    throw new Error('Expected argument of type protos.CheckUsernameAvailabilityResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_CheckUsernameAvailabilityResponse(buffer_arg) {
  return auth_pb.CheckUsernameAvailabilityResponse.deserializeBinary(new Uint8Array(buffer_arg));
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


var AuthServiceService = exports.AuthServiceService = {
  checkUsernameAvailability: {
    path: '/protos.AuthService/checkUsernameAvailability',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.CheckUsernameAvailabilityRequest,
    responseType: auth_pb.CheckUsernameAvailabilityResponse,
    requestSerialize: serialize_protos_CheckUsernameAvailabilityRequest,
    requestDeserialize: deserialize_protos_CheckUsernameAvailabilityRequest,
    responseSerialize: serialize_protos_CheckUsernameAvailabilityResponse,
    responseDeserialize: deserialize_protos_CheckUsernameAvailabilityResponse,
  },
  checkUserState: {
    path: '/protos.AuthService/checkUserState',
    requestStream: false,
    responseStream: false,
    requestType: utils_pb.Empty,
    responseType: auth_pb.CheckStateResponse,
    requestSerialize: serialize_protos_Empty,
    requestDeserialize: deserialize_protos_Empty,
    responseSerialize: serialize_protos_CheckStateResponse,
    responseDeserialize: deserialize_protos_CheckStateResponse,
  },
};

exports.AuthServiceClient = grpc.makeGenericClientConstructor(AuthServiceService);
