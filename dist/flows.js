"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Station_1 = __importDefault(require("./Station"));
class StationBody {
    constructor(station, emitter) {
        this.station = station;
        this.emitter = emitter;
    }
}
// Map<workflow ID, Map<name of `Station`, `StationBody`>
const flows = new Map();
function createStationBody(flowID, name) {
    const emitter = new events_1.EventEmitter();
    const station = new Station_1.default({
        flowID, name, emitter,
    });
    emitter.on('close', () => {
        del(flowID, name);
    });
    return new StationBody(station, emitter);
}
/**
 * @summary Creates new `Station` in the workflow if it does not exists.
 * @param flowID ID of workflow
 * @param name Name of `Station`
 *
 * @returns
 * Newly create `Sation` with its `EventEmiiter` if the name is not taken
 * or `undefined` if the name is already taken.
 */
function create(flowID, name) {
    let stations = flows.get(flowID);
    if (stations === undefined) {
        flows.set(flowID, stations = new Map());
    }
    if (stations.has(name)) {
        return undefined;
    }
    const body = createStationBody(flowID, name);
    stations.set(name, body);
    return body;
}
exports.create = create;
/**
 * @summary Check if `Station` exists in the workflow.
 * @param flowID ID of workflow
 * @param name Name of `Station`
 */
function has(flowID, name) {
    const stations = flows.get(flowID);
    if (stations === undefined) {
        return false;
    }
    return stations.has(name);
}
exports.has = has;
/**
 * @summary Retrieves `Station` in the workflow if it exists.
 * @param flowID ID of workflow
 * @param name Name of `Station`
 *
 * @returns
 * `Station` with its `EventEmitter` if the name exists in the workflow
 * or `undefined` if the name does not exist.
 */
function get(flowID, name) {
    const stations = flows.get(flowID);
    if (stations === undefined) {
        return undefined;
    }
    return stations.get(name);
}
exports.get = get;
/**
 * @summary Deletes `Station` in the workflow
 * @param flowID ID of workflow
 * @param name Name of `Station`
 *
 * @returns
 * `true` if the name exists in the workflow
 * or `undefined` if the name does not exist.
 *
 * @description
 * Note that the `Station` that closed is deleted automatically.
 */
function del(flowID, name) {
    const stations = flows.get(flowID);
    if (stations === undefined) {
        return undefined;
    }
    stations.delete(name);
    if (stations.size === 0) {
        flows.delete(flowID);
    }
    return true;
}
exports.del = del;
