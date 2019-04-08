import Station from '../../Station'
import StationDesc from '../../StationDesc'
import { MsgType } from '../../types'
import accept from './accept'

type LessCallback = (message: string, src: StationDesc)
    => Promise<{ message: string, next: StationDesc }> | void

export = async function less(callback: LessCallback) {
    return accept(1, async (station: Station, message: string, src: StationDesc) => {
        const rst = await callback(message, src)

        if (rst === undefined) { return }

        station.send(MsgType.Block).to(rst.next)
        station.close()
    })
}
