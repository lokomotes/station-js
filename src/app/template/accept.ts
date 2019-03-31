import Station from '../../Station'
import { ReceiveListener } from '../../Station'
import StationDesc from '../../StationDesc'
import noop from './noop'

type AcceptCallback = (station: Station, message: string, src: StationDesc) => void

export = function accept(count: number, callback: AcceptCallback) {
    return async (station: Station) => {
        const cnt = count
        let listener: ReceiveListener

        async function acceptor(message: string, src: StationDesc) {
            if (--count === 0) {
                listener = (_: string, src: StationDesc) => {
                    station.block().from(src)
                }
            }

            callback(station, message, src)
        }

        listener = acceptor

        station.on('linked', (msg: string, src: StationDesc) => {
            listener(msg, src)
        })
    }
}
