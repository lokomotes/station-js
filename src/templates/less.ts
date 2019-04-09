import * as loko from '../index'
import accept from './accept'

type LessCallback = (message: string, src: loko.StationDesc)
    => Promise<{ message: string, next: loko.StationDesc }> | undefined

export = async function less(callback: LessCallback) {
    return accept(1, async (station: loko.Station, message: string, src: loko.StationDesc) => {
        const rst = await callback(message, src)

        if (rst === undefined || rst.next === undefined) { return }

        station.send(loko.MsgType.Block).to(rst.next)
        station.close()
    })
}
