import * as loko from '../index'

type AcceptCallback = (station: loko.Station, message: string, src: loko.StationDesc) => void

export = function accept(count: number, callback: AcceptCallback) {
    return async (station: loko.Station) => {
        let cnt = count
        let listener: loko.EventListener

        async function acceptor(message: string, src: loko.StationDesc) {
            if (--cnt === 0) {
                listener = (_: string, src: loko.StationDesc) => {
                    station.send(loko.MsgType.Block).to(src)
                }
            }

            callback(station, message, src)
        }

        listener = acceptor

        station.on(loko.EventType.Linked, (msg: string, src: loko.StationDesc) => {
            listener(msg, src)
        })
    }
}
