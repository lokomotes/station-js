/// <reference types="node" />
import { EventEmitter } from 'events';
import Station from './Station';
declare class StationBody {
    station: Station;
    emitter: EventEmitter;
    constructor(station: Station, emitter: EventEmitter);
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
export declare function create(flowID: string, name: string): StationBody | undefined;
/**
 * @summary Check if `Station` exists in the workflow.
 * @param flowID ID of workflow
 * @param name Name of `Station`
 */
export declare function has(flowID: string, name: string): boolean;
/**
 * @summary Retrieves `Station` in the workflow if it exists.
 * @param flowID ID of workflow
 * @param name Name of `Station`
 *
 * @returns
 * `Station` with its `EventEmitter` if the name exists in the workflow
 * or `undefined` if the name does not exist.
 */
export declare function get(flowID: string, name: string): StationBody | undefined;
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
export declare function del(flowID: string, name: string): true | undefined;
export {};
