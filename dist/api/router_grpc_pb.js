// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var router_pb = require('./router_pb.js');
var common_pb = require('./common_pb.js');

function serialize_loko_metro_api_BlockRequest(arg) {
  if (!(arg instanceof router_pb.BlockRequest)) {
    throw new Error('Expected argument of type loko.metro.api.BlockRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_loko_metro_api_BlockRequest(buffer_arg) {
  return router_pb.BlockRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_loko_metro_api_LinkRequest(arg) {
  if (!(arg instanceof router_pb.LinkRequest)) {
    throw new Error('Expected argument of type loko.metro.api.LinkRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_loko_metro_api_LinkRequest(buffer_arg) {
  return router_pb.LinkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_loko_metro_api_ListenRequest(arg) {
  if (!(arg instanceof router_pb.ListenRequest)) {
    throw new Error('Expected argument of type loko.metro.api.ListenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_loko_metro_api_ListenRequest(buffer_arg) {
  return router_pb.ListenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_loko_metro_api_Response(arg) {
  if (!(arg instanceof common_pb.Response)) {
    throw new Error('Expected argument of type loko.metro.api.Response');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_loko_metro_api_Response(buffer_arg) {
  return common_pb.Response.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_loko_metro_api_Signal(arg) {
  if (!(arg instanceof router_pb.Signal)) {
    throw new Error('Expected argument of type loko.metro.api.Signal');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_loko_metro_api_Signal(buffer_arg) {
  return router_pb.Signal.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_loko_metro_api_StartRequest(arg) {
  if (!(arg instanceof common_pb.StartRequest)) {
    throw new Error('Expected argument of type loko.metro.api.StartRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_loko_metro_api_StartRequest(buffer_arg) {
  return common_pb.StartRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_loko_metro_api_TransmitRequest(arg) {
  if (!(arg instanceof router_pb.TransmitRequest)) {
    throw new Error('Expected argument of type loko.metro.api.TransmitRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_loko_metro_api_TransmitRequest(buffer_arg) {
  return router_pb.TransmitRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var RouterService = exports.RouterService = {
  start: {
    path: '/loko.metro.api.Router/Start',
    requestStream: false,
    responseStream: false,
    requestType: common_pb.StartRequest,
    responseType: common_pb.Response,
    requestSerialize: serialize_loko_metro_api_StartRequest,
    requestDeserialize: deserialize_loko_metro_api_StartRequest,
    responseSerialize: serialize_loko_metro_api_Response,
    responseDeserialize: deserialize_loko_metro_api_Response,
  },
  link: {
    path: '/loko.metro.api.Router/Link',
    requestStream: false,
    responseStream: false,
    requestType: router_pb.LinkRequest,
    responseType: common_pb.Response,
    requestSerialize: serialize_loko_metro_api_LinkRequest,
    requestDeserialize: deserialize_loko_metro_api_LinkRequest,
    responseSerialize: serialize_loko_metro_api_Response,
    responseDeserialize: deserialize_loko_metro_api_Response,
  },
  block: {
    path: '/loko.metro.api.Router/Block',
    requestStream: false,
    responseStream: false,
    requestType: router_pb.BlockRequest,
    responseType: common_pb.Response,
    requestSerialize: serialize_loko_metro_api_BlockRequest,
    requestDeserialize: deserialize_loko_metro_api_BlockRequest,
    responseSerialize: serialize_loko_metro_api_Response,
    responseDeserialize: deserialize_loko_metro_api_Response,
  },
  transmit: {
    path: '/loko.metro.api.Router/Transmit',
    requestStream: false,
    responseStream: false,
    requestType: router_pb.TransmitRequest,
    responseType: common_pb.Response,
    requestSerialize: serialize_loko_metro_api_TransmitRequest,
    requestDeserialize: deserialize_loko_metro_api_TransmitRequest,
    responseSerialize: serialize_loko_metro_api_Response,
    responseDeserialize: deserialize_loko_metro_api_Response,
  },
  listen: {
    path: '/loko.metro.api.Router/Listen',
    requestStream: false,
    responseStream: true,
    requestType: router_pb.ListenRequest,
    responseType: router_pb.Signal,
    requestSerialize: serialize_loko_metro_api_ListenRequest,
    requestDeserialize: deserialize_loko_metro_api_ListenRequest,
    responseSerialize: serialize_loko_metro_api_Signal,
    responseDeserialize: deserialize_loko_metro_api_Signal,
  },
};

exports.RouterClient = grpc.makeGenericClientConstructor(RouterService);
