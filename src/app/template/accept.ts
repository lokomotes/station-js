import Station from '../../Station'
import StationDesc from '../../StationDesc'
import { EventListener, EventType, MsgType } from '../../types'
import noop from './noop'

type AcceptCallback = (station: Station, message: string, src: StationDesc) => void

export = function accept(count: number, callback: AcceptCallback) {
    return async (station: Station) => {
        const cnt = count
        let listener: EventListener

        async function acceptor(message: string, src: StationDesc) {
            if (--count === 0) {
                listener = (_: string, src: StationDesc) => {
                    station.send(MsgType.Block).to(src)
                }
            }

            callback(station, message, src)
        }

        listener = acceptor

        station.on(EventType.Linked, (msg: string, src: StationDesc) => {
            listener(msg, src)
        })
    }
}
