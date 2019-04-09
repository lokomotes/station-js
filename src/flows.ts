import { EventEmitter } from 'events'

import { Station } from './Station'

class StationBody {
    public station: Station
    public emitter: EventEmitter

    constructor(
        station: Station,
        emitter: EventEmitter,
    ) {
        this.station = station
        this.emitter = emitter
    }
}

// Map<workflow ID, Map<name of `Station`, `StationBody`>
const flows: Map<string, Map<string, StationBody>> = new Map()

function createStationBody(flowID: string, name: string) {
    const emitter = new EventEmitter()
    const station = new Station({
        flowID, name, emitter,
    })

    emitter.on('close', () => {
        del(flowID, name)
    })

    return new StationBody(station, emitter)
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
export function create(flowID: string, name: string) {
    let stations = flows.get(flowID)
    if (stations === undefined) {
        flows.set(flowID, stations = new Map())
    }

    if (stations.has(name)) {
        return undefined
    }

    const body = createStationBody(flowID, name)
    stations.set(name, body)

    return body
}

/**
 * @summary Check if `Station` exists in the workflow.
 * @param flowID ID of workflow
 * @param name Name of `Station`
 */
export function has(flowID: string, name: string) {
    const stations = flows.get(flowID)
    if (stations === undefined) { return false }

    return stations.has(name)
}

/**
 * @summary Retrieves `Station` in the workflow if it exists.
 * @param flowID ID of workflow
 * @param name Name of `Station`
 *
 * @returns
 * `Station` with its `EventEmitter` if the name exists in the workflow
 * or `undefined` if the name does not exist.
 */
export function get(flowID: string, name: string) {
    const stations = flows.get(flowID)
    if (stations === undefined) { return undefined }

    return stations.get(name)
}

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
export function del(flowID: string, name: string) {
    const stations = flows.get(flowID)
    if (stations === undefined) { return false }

    stations.delete(name)

    if (stations.size === 0) {
        flows.delete(flowID)
    }

    return true
}
