"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const accept_1 = __importDefault(require("./accept"));
module.exports = async function less(callback) {
    return accept_1.default(1, async (station, message, src) => {
        const rst = await callback(message, src);
        if (rst === undefined) {
            return;
        }
        station.block(rst.message).from(rst.next);
        station.close();
    });
};
