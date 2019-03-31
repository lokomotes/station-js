import { Signal } from './api/router_pb'
import * as RouterMsg from './api/router_pb'
import * as flows from './flows'
import RouterCli from './RouterClient'
import StationDesc from './StationDesc'
import token from './token'

// tslint:disable-next-line:no-var-requires
const app = require('./app/main')

function sigHandler(sig: Signal) {
    const srcSt = sig.getSrc()
    const dstSt = sig.getDst()

    if (dstSt === undefined) {
        console.warn('Station is undefined')
        return
    }

    const flowID = dstSt.getId()
    const dstName = dstSt.getName()
    const isExists = flows.has(flowID, dstName)

    function fetch() {
        const st = flows.get(flowID, dstName)

        return st
    }
    function start() {
        const body = flows.create(flowID, dstName)
        const msg = sig.getMessage()
        let args: any[]

        try {
            const parsed = JSON.parse(msg)
            Array.isArray(parsed)
                ? args = parsed
                : args = [msg]
        } catch (e) {
            args = []
        }

        // @ts-ignore
        app(body.station, args)

        return body
    }

    const Ctrl = Signal.Control
    const ctrl = sig.getControl()
    switch (ctrl) {
        default:
            console.warn('Unmanaged control flag: ' + ctrl)
            break

        case Ctrl.START:
            if (isExists) {
                console.warn('Already opened `Station`: ' + dstName)
            } else { start() }
            break

        case Ctrl.TERMINATE:
            if (!isExists) {
                console.warn('`Station` does not exist: ' + dstName)
            } else { flows.del(flowID, dstName) }
            break

        case Ctrl.LINKED:
            (isExists
                // @ts-ignore
                ? fetch().emitter
                // @ts-ignore
                : start().emitter
                // @ts-ignore
            ).emit('linked', sig.getMessage(), new StationDesc(srcSt))
            break

        case Ctrl.MESSAGE:
            if (!isExists) {
                console.warn('`Station` does not exist: ' + dstName)
                // @ts-ignore
            } else { fetch().emitter.emit('signal', sig.getMessage(), new StationDesc(srcSt)) }
            break

        case Ctrl.BLOCKED:
            if (!isExists) {
                console.warn('`Station` does not exist: ' + dstName)
                // @ts-ignore
            } else { fetch().emitter.emit('blocked', sig.getMessage(), new StationDesc(srcSt)) }
            break
    }
}

function main() {
    const sigStream = RouterCli.listen((() => {
        const req = new RouterMsg.ListenRequest()
        req.setToken(token)

        return req
    })())

    sigStream.on('data', sigHandler)

    sigStream.on('error', (err) => {
        throw err
    })

    sigStream.on('end', () => {
        throw new Error('Unexpected end of stream.')
    })
}

main()
