import { Station } from './api/common_pb';
export default class StationDesc {
    flowID: string;
    name: string;
    image: string;
    constructor(station: Station | {
        name: string;
        image: string;
    });
    serialize(): string;
}
