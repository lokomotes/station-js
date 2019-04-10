import { Station } from './api/common_pb'

export class StationDesc {
    public flowID: string
    public name: string
    public image: string

    constructor(station: Station | {
        name: string,
        image: string,
    }) {
        if (station instanceof Station) {
            this.flowID = station.getId()
            this.name = station.getName()
            this.image = station.getImage()
        } else {
            this.flowID = ''
            this.name = station.name
            this.image = station.image
        }
    }

    public serialize() {
        return this.image + (this.name ? '~' + this.name : '')
    }
}
