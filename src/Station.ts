import { EventEmitter } from 'events'
import * as LokoMsg from './api/common_pb'
import * as RouterMsg from './api/router_pb'
import * as errs from './errors'
import RouterClient from './RouterClient'
import { StationDesc } from './StationDesc'
import token from './token'
import * as types from './types'

export class Station {

    public name: string
    private _isClosed = false
    private _flowID: string
    private _stMsg: LokoMsg.Station

    private _internalEmitter: EventEmitter
    private _externalEmitter = new EventEmitter()

    private _blocked = new Set<string>()
    private _grabbed = new Map<types.EventType, Map<string, types.EventListener>>([
        [types.EventType.Signaled, new Map()],
        [types.EventType.Linked, new Map()],
        [types.EventType.Blocked, new Map()],
        [types.EventType.Closed, new Map()],
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
            const st = new LokoMsg.Station()
            st.setId(flowID)
            st.setName(name)
            return st
        })()

        this.name = name

        const filter = (type: types.EventType) => {
            return (msg: string, src: LokoMsg.Station) => {
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
            .on(types.EventType.Signaled, filter(types.EventType.Signaled))
            .on(types.EventType.Linked, filter(types.EventType.Linked))
            .on(types.EventType.Blocked, filter(types.EventType.Blocked))
    }

    public send(type: types.MsgType, message?: string) {
        const to = (destination: StationDesc) => {
            const dst = new LokoMsg.Station()
            dst.setName(destination.name)
            dst.setImage(destination.image)

            const req = (() => {
                switch (type) {
                    case types.MsgType.Signal: return new RouterMsg.TransmitRequest()
                    case types.MsgType.Link: return new RouterMsg.LinkRequest()
                    case types.MsgType.Block: return new RouterMsg.BlockRequest()
                    default: return null
                }
            })()

            if (req === null) { throw new errs.UnmanagedErr(type) }

            req.setToken(token)
            req.setSrc(this._stMsg)
            req.setDst(dst)
            req.setMessage(message || '')

            switch (type) {
                case types.MsgType.Signal: return new Promise<LokoMsg.Response>((resolve, reject) => {
                    RouterClient.transmit(req, (err, res) => {
                        if (err) { reject(err) }
                        const code = res.getCode()
                        switch (code) {
                            case 200: return resolve(res)
                            case 403: return reject(new errs.NotPermittedErr(destination.name))
                            case 404: return reject(new errs.ImageNotFoundErr(destination.name))
                            default: return reject(new errs.UnmanagedErr(code))
                        }
                    })
                })
                case types.MsgType.Link: return new Promise<LokoMsg.Response>((resolve, reject) => {
                    RouterClient.link(req, (err, res) => {
                        if (err) { reject(err) }
                        const code = res.getCode()
                        switch (code) {
                            case 200: return resolve(res)
                            case 404: return reject(new errs.ImageNotFoundErr(destination.image))
                            default: return reject(new errs.UnmanagedErr(code))
                        }
                    })
                })
                case types.MsgType.Block: return new Promise<LokoMsg.Response>((resolve, reject) => {
                    RouterClient.block(req, (err, res) => {
                        if (err) { reject(err) }
                        const code = res.getCode()
                        switch (code) {
                            case 200: return resolve(res)
                            case 404: return reject(new errs.ImageNotFoundErr(destination.image))
                            default: return reject(new errs.UnmanagedErr(code))
                        }
                    })
                })
            }
        }

        return { to }
    }

    public on(type: types.EventType, listener: types.EventListener) {
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
        const grabber = (type: types.EventType) => {
            return (listener: types.EventListener) => {
                const stDesc = station instanceof StationDesc
                    ? station
                    : new StationDesc(station)

                // @ts-ignore
                this._grabbed.get(type).set(stDesc.serialize(), listener)
            }
        }

        return {
            signal: grabber(types.EventType.Signaled),
            linked: grabber(types.EventType.Linked),
            blocked: grabber(types.EventType.Blocked),
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
        const loser = (type: types.EventType) => {
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
            signal: loser(types.EventType.Signaled),
            linked: loser(types.EventType.Linked),
            blocked: loser(types.EventType.Blocked),
        }
    }

    public log(message: string) {
        console.log(`${this._flowID} ${message}`)
    }

    public close() {
        this._isClosed = true
        this._internalEmitter.emit(types.EventType.Closed)
    }
}
