"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const router_pb_1 = require("./api/router_pb");
function main() {
    let id;
    try {
        const cgroup = fs_1.default.readFileSync('/proc/self/cgroup', 'utf-8')
            .split('\n')
            .find((v) => {
            return v.includes('docker');
        });
        if (cgroup === undefined) {
            throw new Error('not in docker container');
        }
        id = cgroup.split('docker/')[1];
    }
    catch (e) {
        id = '';
    }
    id = id || 'zz' + crypto_1.randomBytes(31).toString('hex');
    console.info(`token is ${id}`);
    const rst = new router_pb_1.Token();
    rst.setId(id);
    return rst;
}
exports.default = main();
