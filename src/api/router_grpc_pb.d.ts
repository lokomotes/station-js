// package: loko.metro.api
// file: router.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as router_pb from "./router_pb";
import * as common_pb from "./common_pb";

interface IRouterService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    start: IRouterService_IStart;
    link: IRouterService_ILink;
    block: IRouterService_IBlock;
    transmit: IRouterService_ITransmit;
    listen: IRouterService_IListen;
}

interface IRouterService_IStart extends grpc.MethodDefinition<common_pb.StartRequest, common_pb.Response> {
    path: string; // "/loko.metro.api.Router/Start"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<common_pb.StartRequest>;
    requestDeserialize: grpc.deserialize<common_pb.StartRequest>;
    responseSerialize: grpc.serialize<common_pb.Response>;
    responseDeserialize: grpc.deserialize<common_pb.Response>;
}
interface IRouterService_ILink extends grpc.MethodDefinition<router_pb.LinkRequest, common_pb.Response> {
    path: string; // "/loko.metro.api.Router/Link"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<router_pb.LinkRequest>;
    requestDeserialize: grpc.deserialize<router_pb.LinkRequest>;
    responseSerialize: grpc.serialize<common_pb.Response>;
    responseDeserialize: grpc.deserialize<common_pb.Response>;
}
interface IRouterService_IBlock extends grpc.MethodDefinition<router_pb.BlockRequest, common_pb.Response> {
    path: string; // "/loko.metro.api.Router/Block"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<router_pb.BlockRequest>;
    requestDeserialize: grpc.deserialize<router_pb.BlockRequest>;
    responseSerialize: grpc.serialize<common_pb.Response>;
    responseDeserialize: grpc.deserialize<common_pb.Response>;
}
interface IRouterService_ITransmit extends grpc.MethodDefinition<router_pb.TransmitRequest, common_pb.Response> {
    path: string; // "/loko.metro.api.Router/Transmit"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<router_pb.TransmitRequest>;
    requestDeserialize: grpc.deserialize<router_pb.TransmitRequest>;
    responseSerialize: grpc.serialize<common_pb.Response>;
    responseDeserialize: grpc.deserialize<common_pb.Response>;
}
interface IRouterService_IListen extends grpc.MethodDefinition<router_pb.ListenRequest, router_pb.Signal> {
    path: string; // "/loko.metro.api.Router/Listen"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<router_pb.ListenRequest>;
    requestDeserialize: grpc.deserialize<router_pb.ListenRequest>;
    responseSerialize: grpc.serialize<router_pb.Signal>;
    responseDeserialize: grpc.deserialize<router_pb.Signal>;
}

export const RouterService: IRouterService;

export interface IRouterServer {
    start: grpc.handleUnaryCall<common_pb.StartRequest, common_pb.Response>;
    link: grpc.handleUnaryCall<router_pb.LinkRequest, common_pb.Response>;
    block: grpc.handleUnaryCall<router_pb.BlockRequest, common_pb.Response>;
    transmit: grpc.handleUnaryCall<router_pb.TransmitRequest, common_pb.Response>;
    listen: grpc.handleServerStreamingCall<router_pb.ListenRequest, router_pb.Signal>;
}

export interface IRouterClient {
    start(request: common_pb.StartRequest, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    start(request: common_pb.StartRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    start(request: common_pb.StartRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    link(request: router_pb.LinkRequest, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    link(request: router_pb.LinkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    link(request: router_pb.LinkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    block(request: router_pb.BlockRequest, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    block(request: router_pb.BlockRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    block(request: router_pb.BlockRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    transmit(request: router_pb.TransmitRequest, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    transmit(request: router_pb.TransmitRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    transmit(request: router_pb.TransmitRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    listen(request: router_pb.ListenRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<router_pb.Signal>;
    listen(request: router_pb.ListenRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<router_pb.Signal>;
}

export class RouterClient extends grpc.Client implements IRouterClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public start(request: common_pb.StartRequest, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public start(request: common_pb.StartRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public start(request: common_pb.StartRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public link(request: router_pb.LinkRequest, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public link(request: router_pb.LinkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public link(request: router_pb.LinkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public block(request: router_pb.BlockRequest, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public block(request: router_pb.BlockRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public block(request: router_pb.BlockRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public transmit(request: router_pb.TransmitRequest, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public transmit(request: router_pb.TransmitRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public transmit(request: router_pb.TransmitRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: common_pb.Response) => void): grpc.ClientUnaryCall;
    public listen(request: router_pb.ListenRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<router_pb.Signal>;
    public listen(request: router_pb.ListenRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<router_pb.Signal>;
}
