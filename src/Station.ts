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
    private _grabbeds = new Map<string, Map<types.MsgType, EventEmitter>>()

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

        const filter = (eType: types.EventType, mType: types.MsgType | void) => {
            return (msg: string, src: StationDesc) => {
                const emitToExternal = () => this._externalEmitter.emit(eType, msg, src)

                if (eType === types.EventType.Closed) {
                    emitToExternal()
                }

                const st = src.serialize()

                if (this._blocked.has(st)) {
                    console.log(`${st} blocked`)
                    return
                }

                console.log(`${eType}|${msg} from ${st}`)

                if (mType === undefined) {
                    emitToExternal()
                    return
                }

                const grabbed = this._grabbeds.get(st)
                if (grabbed === undefined) {
                    emitToExternal()
                    return
                }

                const emitter = grabbed.get(mType)
                // @ts-ignore
                emitter.emit(mType, msg, src)
                return
            }
        }

        emitter
            .on(types.EventType.Signaled, filter(types.EventType.Signaled, types.MsgType.Signal))
            .on(types.EventType.Linked, filter(types.EventType.Linked, types.MsgType.Link))
            .on(types.EventType.Blocked, filter(types.EventType.Blocked, types.MsgType.Block))
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

    public grab(station: StationDesc | {
        name: string,
        image: string,
    }) {
        const st = station instanceof StationDesc
            ? station.serialize()
            : (new StationDesc(station)).serialize()

        // never be undefined
        let grabbed: Map<types.MsgType, EventEmitter>

        if (!this._grabbeds.has(st)) {
            grabbed = new Map<types.MsgType, EventEmitter>([
                [types.MsgType.Signal, new EventEmitter()],
                [types.MsgType.Link, new EventEmitter()],
                [types.MsgType.Block, new EventEmitter()],
            ])
            this._grabbeds.set(st, grabbed)
        } else {
            // watch https://github.com/Microsoft/TypeScript/issues/9619
            // @ts-ignore
            grabbed = this._grabbeds.get(st)
        }

        console.log(`${st} grabbed`)

        const on = (type: types.MsgType, listener: types.EventListener) => {
            // @ts-ignore
            grabbed.get(type).on(type, listener)
        }

        const off = (type: types.MsgType, listener: types.EventListener) => {
            // @ts-ignore
            grabbed.get(type).off(type, listener)
        }

        return { on, off }
    }

    public log(message: string) {
        console.log(`${this._flowID} ${message}`)
    }

    public close() {
        this._isClosed = true
        this._internalEmitter.emit(types.EventType.Closed)
    }
}
