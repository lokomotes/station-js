import { EventEmitter } from 'events'
import { Station as StMsg } from './api/common_pb'
import * as RouterMsg from './api/router_pb'
import * as errs from './errors'
import RouterCli from './RouterClient'
import StationDesc from './StationDesc'
import token from './token'

export type ReceiveListener = (message: string, src: StationDesc) => void
export type ReceiveType = 'linked' | 'signal' | 'blocked'

export default class Station {

    public name: string
    private _isClosed = false
    private _flowID: string
    private _stMsg: StMsg

    private _internalEmitter: EventEmitter
    private _externalEmitter = new EventEmitter()

    private _blocked = new Set<string>()
    private _grabbed = new Map<ReceiveType, Map<string, ReceiveListener>>([
        ['linked', new Map()],
        ['signal', new Map()],
        ['blocked', new Map()],
    ])

    constructor({
        flowID, name, emitter,
    }: {
        flowID: string,
        name: string,
        emitter: EventEmitter,
    }) {
        this._flowID = flowID
        this._internalEmitter = emitter

        this._stMsg = (() => {
            const st = new StMsg()
            st.setId(flowID)
            st.setName(name)
            return st
        })()

        this.name = name

        const filter = (type: ReceiveType) => {
            return (msg: string, src: StMsg) => {
                const stDesc = new StationDesc(src)
                const key = stDesc.serialize()

                if (this._blocked.has(key)) {
                    return
                }

                // @ts-ignore
                const listener = this._grabbed.get(type).get(key)
                if (listener !== undefined) {
                    listener(msg, stDesc)
                    return
                }

                this._externalEmitter.emit(type, msg, stDesc)
            }
        }

        emitter
            .on('signal', filter('signal'))
            .on('linked', filter('linked'))
            .on('blocked', filter('blocked'))
    }

    /**
     * @summary Writes a message to be sent to future reachable `Station`
     * @param message
     *
     * @description
     * It writes a message but does not send it yet.
     * You can send it by specifying the destination `Station` using returned `to` method.
     */
    public link(message?: string | undefined) {
        /**
         * @summary Send a LINK message you wrote to specified `Station`.
         * @param destination
         *
         * @description \
         * - This message is forwarded to the specified `Station`
         *   and the `Station` receives `linked` event.
         * - The specified `Station` will be created if it does not exist.
         */
        const to = (destination: StationDesc | {
            name: string,
            image: string,
        }) => {
            const dst = new StMsg()
            dst.setName(destination.name)
            dst.setImage(destination.image)

            const req = new RouterMsg.LinkRequest()
            req.setToken(token)
            req.setSrc(this._stMsg)
            req.setDst(dst)
            req.setMessage(message || '')

            return new Promise((resolve, reject) => {
                RouterCli.link(req, (err, res) => {
                    const code = res.getCode()

                    switch (code) {
                        default:
                            reject(new errs.UnmanagedErr(code))
                            break

                        case 200:
                            break

                        case 404:
                            reject(new errs.ImageNotFoundErr(destination.image))
                            break
                    }

                    resolve(res)
                })
            })
        }

        return { to }
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
    public signal(message?: string | undefined) {
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
        const to = (destination: StationDesc | {
            name: string,
            image: string,
        }) => {
            const dst = new StMsg()
            dst.setName(destination.name)
            dst.setImage(destination.image)

            const req = new RouterMsg.TransmitRequest()
            req.setToken(token)
            req.setSrc(this._stMsg)
            req.setDst(dst)
            req.setMessage(message || '')

            return new Promise((resolve, reject) => {
                RouterCli.transmit(req, (err, res) => {
                    const code = res.getCode()

                    switch (code) {
                        default:
                            reject(new errs.UnmanagedErr(code))
                            break

                        case 200:
                            break

                        case 403:
                            reject(new errs.NotPermittedErr(destination.name))
                            break

                        case 404:
                            reject(new errs.ImageNotFoundErr(destination.name))
                            break
                    }

                    resolve(res)
                })
            })
        }

        return { to }
    }

    /**
     * @summary Writes a message to be sent telling `Station` not to send any further messages.
     * @param message
     *
     * @description
     * It writes a message but does not send it yet.
     * You can send it by specifying the destination `Station` using returned `from` method.
     */
    public block(message?: string | undefined) {
        /**
         * @summary Send a BLOCK message you wrote to specified `Station`.
         * @param destination
         *
         * @description \
         * - This message is forwarded to the specified `Station`
         *   and the `Station` receives `bloeked` event.
         * - It throws `StationNotFoundErr` if specified `Station` does not exist.
         */
        const from = (destination: StationDesc | {
            name: string,
            image: string,
        }) => {
            const dst = new StMsg()
            dst.setName(destination.name)
            dst.setImage(destination.image)

            const req = new RouterMsg.BlockRequest()
            req.setToken(token)
            req.setSrc(this._stMsg)
            req.setDst(dst)
            req.setMessage(message || '')

            return new Promise((resolve, reject) => {
                RouterCli.block(req, (err, res) => {
                    const code = res.getCode()

                    switch (code) {
                        default:
                            reject(new errs.UnmanagedErr(code))
                            break

                        case 200:
                            this._blocked.add(
                                destination instanceof StationDesc
                                    ? destination.serialize()
                                    : (new StationDesc(destination)).serialize(),
                            )
                            break

                        case 404:
                            reject(new errs.StationNotFoundErr(destination.name))
                            break
                    }
                })
            })
        }

        return { from }
    }

    public on(type: ReceiveType, listener: ReceiveListener) {
        this._externalEmitter.on(type, listener)

        return this
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
    public grab(station: StationDesc | {
        name: string,
        image: string,
    }) {
        const grabber = (type: ReceiveType) => {
            return (listener: ReceiveListener) => {
                const stDesc = station instanceof StationDesc
                    ? station
                    : new StationDesc(station)

                // @ts-ignore
                this._grabbed.get(type).set(stDesc.serialize(), listener)
            }
        }

        return {
            signal: grabber('signal'),
            linked: grabber('linked'),
            blocked: grabber('blocked'),
        }
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
    public lose(station: StationDesc | {
        name: string,
        image: string,
    }) {
        const loser = (type: ReceiveType) => {
            return () => {
                const stDesc = station instanceof StationDesc
                    ? station
                    : new StationDesc(station)

                const list = this._grabbed.get(type)
                // never happens
                if (list === undefined) { throw new Error('Grabbed list does not exist: ' + type) }

                list.delete(stDesc.serialize())
            }
        }

        return {
            signal: loser('signal'),
            linked: loser('linked'),
            blocked: loser('blocked'),
        }
    }

    public log(message: string) {
        console.log(`${this._flowID} ${message}`)
    }

    public close() {
        this._isClosed = true
        this._internalEmitter.emit('close')
    }
}
