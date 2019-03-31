// package: loko.metro.api
// file: common.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class Station extends jspb.Message { 
    getId(): string;
    setId(value: string): void;

    getName(): string;
    setName(value: string): void;

    getImage(): string;
    setImage(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Station.AsObject;
    static toObject(includeInstance: boolean, msg: Station): Station.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Station, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Station;
    static deserializeBinaryFromReader(message: Station, reader: jspb.BinaryReader): Station;
}

export namespace Station {
    export type AsObject = {
        id: string,
        name: string,
        image: string,
    }
}

export class Response extends jspb.Message { 
    getCode(): number;
    setCode(value: number): void;

    getMessage(): string;
    setMessage(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Response.AsObject;
    static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Response;
    static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
    export type AsObject = {
        code: number,
        message: string,
    }
}

export class StartRequest extends jspb.Message { 

    hasStation(): boolean;
    clearStation(): void;
    getStation(): Station | undefined;
    setStation(value?: Station): void;

    getUserid(): string;
    setUserid(value: string): void;

    getMessage(): string;
    setMessage(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StartRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StartRequest): StartRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StartRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StartRequest;
    static deserializeBinaryFromReader(message: StartRequest, reader: jspb.BinaryReader): StartRequest;
}

export namespace StartRequest {
    export type AsObject = {
        station?: Station.AsObject,
        userid: string,
        message: string,
    }
}
