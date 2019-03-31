"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_pb_1 = require("./api/common_pb");
class StationDesc {
    constructor(station) {
        if (station instanceof common_pb_1.Station) {
            this.flowID = station.getId();
            this.name = station.getName();
            this.image = station.getImage();
        }
        else {
            this.flowID = '';
            this.name = station.name;
            this.image = station.image;
        }
    }
    serialize() {
        return this.image + this.name ? '~' + this.name : '';
    }
}
exports.default = StationDesc;
