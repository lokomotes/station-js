"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const common_pb_1 = require("./api/common_pb");
const RouterMsg = __importStar(require("./api/router_pb"));
const errs = __importStar(require("./errors"));
const RouterClient_1 = __importDefault(require("./RouterClient"));
const StationDesc_1 = __importDefault(require("./StationDesc"));
const token_1 = __importDefault(require("./token"));
class Station {
    constructor({ flowID, name, emitter, }) {
        this._isClosed = false;
        this._externalEmitter = new events_1.EventEmitter();
        this._blocked = new Set();
        this._grabbed = new Map([
            ['linked', new Map()],
            ['signal', new Map()],
            ['blocked', new Map()],
        ]);
        this._flowID = flowID;
        this._internalEmitter = emitter;
        this._stMsg = (() => {
            const st = new common_pb_1.Station();
            st.setId(flowID);
            st.setName(name);
            return st;
        })();
        this.name = name;
        const filter = (type) => {
            return (msg, src) => {
                const stDesc = new StationDesc_1.default(src);
                const key = stDesc.serialize();
                if (this._blocked.has(key)) {
                    return;
                }
                // @ts-ignore
                const listener = this._grabbed.get(type).get(key);
                if (listener !== undefined) {
                    listener(msg, stDesc);
                    return;
                }
                this._externalEmitter.emit(type, msg, stDesc);
            };
        };
        emitter
            .on('signal', filter('signal'))
            .on('linked', filter('linked'))
            .on('blocked', filter('blocked'));
    }
    /**
     * @summary Writes a message to be sent to future reachable `Station`
     * @param message
     *
     * @description
     * It writes a message but does not send it yet.
     * You can send it by specifying the destination `Station` using returned `to` method.
     */
    link(message) {
        /**
         * @summary Send a LINK message you wrote to specified `Station`.
         * @param destination
         *
         * @description \
         * - This message is forwarded to the specified `Station`
         *   and the `Station` receives `linked` event.
         * - The specified `Station` will be created if it does not exist.
         */
        const to = (destination) => {
            const dst = new common_pb_1.Station();
            dst.setName(destination.name);
            dst.setImage(destination.image);
            const req = new RouterMsg.LinkRequest();
            req.setToken(token_1.default);
            req.setSrc(this._stMsg);
            req.setDst(dst);
            req.setMessage(message || '');
            return new Promise((resolve, reject) => {
                RouterClient_1.default.link(req, (err, res) => {
                    const code = res.getCode();
                    switch (code) {
                        default:
                            reject(new errs.UnmanagedErr(code));
                            break;
                        case 200:
                            break;
                        case 404:
                            reject(new errs.ImageNotFoundErr(destination.image));
                            break;
                    }
                    resolve(res);
                });
            });
        };
        return { to };
    }
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
    signal(message) {
        /**
         * @summary Writes a message to be sent to other `Station`.
         * @param destination
         *
         * @description \
         * - This message is forwarded to the specified `Station`
         *   and the `Station` receives `signal` event.
         * - It throws `NotPermittedErr` if specified `Station` blocked this `Station`.
         * - It throws `StationNotFoundErr` if specified `Station` does not exist.
         */
        const to = (destination) => {
            const dst = new common_pb_1.Station();
            dst.setName(destination.name);
            dst.setImage(destination.image);
            const req = new RouterMsg.TransmitRequest();
            req.setToken(token_1.default);
            req.setSrc(this._stMsg);
            req.setDst(dst);
            req.setMessage(message || '');
            return new Promise((resolve, reject) => {
                RouterClient_1.default.transmit(req, (err, res) => {
                    const code = res.getCode();
                    switch (code) {
                        default:
                            reject(new errs.UnmanagedErr(code));
                            break;
                        case 200:
                            break;
                        case 403:
                            reject(new errs.NotPermittedErr(destination.name));
                            break;
                        case 404:
                            reject(new errs.ImageNotFoundErr(destination.name));
                            break;
                    }
                    resolve(res);
                });
            });
        };
        return { to };
    }
    /**
     * @summary Writes a message to be sent telling `Station` not to send any further messages.
     * @param message
     *
     * @description
     * It writes a message but does not send it yet.
     * You can send it by specifying the destination `Station` using returned `from` method.
     */
    block(message) {
        /**
         * @summary Send a BLOCK message you wrote to specified `Station`.
         * @param destination
         *
         * @description \
         * - This message is forwarded to the specified `Station`
         *   and the `Station` receives `bloeked` event.
         * - It throws `StationNotFoundErr` if specified `Station` does not exist.
         */
        const from = (destination) => {
            const dst = new common_pb_1.Station();
            dst.setName(destination.name);
            dst.setImage(destination.image);
            const req = new RouterMsg.BlockRequest();
            req.setToken(token_1.default);
            req.setSrc(this._stMsg);
            req.setDst(dst);
            req.setMessage(message || '');
            return new Promise((resolve, reject) => {
                RouterClient_1.default.block(req, (err, res) => {
                    const code = res.getCode();
                    switch (code) {
                        default:
                            reject(new errs.UnmanagedErr(code));
                            break;
                        case 200:
                            this._blocked.add(destination instanceof StationDesc_1.default
                                ? destination.serialize()
                                : (new StationDesc_1.default(destination)).serialize());
                            break;
                        case 404:
                            reject(new errs.StationNotFoundErr(destination.name));
                            break;
                    }
                });
            });
        };
        return { from };
    }
    on(type, listener) {
        this._externalEmitter.on(type, listener);
        return this;
    }
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
    grab(station) {
        const grabber = (type) => {
            return (listener) => {
                const stDesc = station instanceof StationDesc_1.default
                    ? station
                    : new StationDesc_1.default(station);
                // @ts-ignore
                this._grabbed.get(type).set(stDesc.serialize(), listener);
            };
        };
        return {
            signal: grabber('signal'),
            linked: grabber('linked'),
            blocked: grabber('blocked'),
        };
    }
    /**
     * @summary Releases grabbed messages from `Station`.
     *
     * @param station
     *
     * @descriptionIt
     * It describes which `Station` to release.
     * You can resolve it using returned methods.
     */
    lose(station) {
        const loser = (type) => {
            return () => {
                const stDesc = station instanceof StationDesc_1.default
                    ? station
                    : new StationDesc_1.default(station);
                const list = this._grabbed.get(type);
                // never happens
                if (list === undefined) {
                    throw new Error('Grabbed list does not exist: ' + type);
                }
                list.delete(stDesc.serialize());
            };
        };
        return {
            signal: loser('signal'),
            linked: loser('linked'),
            blocked: loser('blocked'),
        };
    }
    log(message) {
        console.log(`${this._flowID} ${message}`);
    }
    close() {
        this._isClosed = true;
        this._internalEmitter.emit('close');
    }
}
exports.default = Station;
