/// <reference types="node" />
import { EventEmitter } from 'events';
import StationDesc from './StationDesc';
export declare type ReceiveListener = (message: string, src: StationDesc) => void;
export declare type ReceiveType = 'linked' | 'signal' | 'blocked';
export default class Station {
    name: string;
    private _isClosed;
    private _flowID;
    private _stMsg;
    private _internalEmitter;
    private _externalEmitter;
    private _blocked;
    private _grabbed;
    constructor({ flowID, name, emitter, }: {
        flowID: string;
        name: string;
        emitter: EventEmitter;
    });
    /**
     * @summary Writes a message to be sent to future reachable `Station`
     * @param message
     *
     * @description
     * It writes a message but does not send it yet.
     * You can send it by specifying the destination `Station` using returned `to` method.
     */
    link(message?: string | undefined): {
        to: (destination: StationDesc | {
            name: string;
            image: string;
        }) => Promise<{}>;
    };
    /**
     * @summary Writes a message to be sent to other `Station`.
     * @param message
     *
     * @example
     * Station.signal("Hi John").to({
     *  name: "John",
     *  image: "person:latest"
     * })
     *
     * @description
     * It writes a message but does not send it yet.
     * You can send it by specifying the destination `Station` using returned `to` method.
     */
    signal(message?: string | undefined): {
        to: (destination: StationDesc | {
            name: string;
            image: string;
        }) => Promise<{}>;
    };
    /**
     * @summary Writes a message to be sent telling `Station` not to send any further messages.
     * @param message
     *
     * @description
     * It writes a message but does not send it yet.
     * You can send it by specifying the destination `Station` using returned `from` method.
     */
    block(message?: string | undefined): {
        from: (destination: StationDesc | {
            name: string;
            image: string;
        }) => Promise<{}>;
    };
    on(type: ReceiveType, listener: ReceiveListener): this;
    /**
     * @summary Intercept messages from other `Station`.
     *
     * @param station
     *
     * @description
     * It describes which `Station` to intercept the message from.
     * You can resolve it using returned methods.
     * Note that intercepted messages can NOT be caught via `on` method.
     * If you want to catch messages using `on` method, release it using `lose` method.
     *
     */
    grab(station: StationDesc | {
        name: string;
        image: string;
    }): {
        signal: (listener: ReceiveListener) => void;
        linked: (listener: ReceiveListener) => void;
        blocked: (listener: ReceiveListener) => void;
    };
    /**
     * @summary Releases grabbed messages from `Station`.
     *
     * @param station
     *
     * @descriptionIt
     * It describes which `Station` to release.
     * You can resolve it using returned methods.
     */
    lose(station: StationDesc | {
        name: string;
        image: string;
    }): {
        signal: () => void;
        linked: () => void;
        blocked: () => void;
    };
    log(message: string): void;
    close(): void;
}
