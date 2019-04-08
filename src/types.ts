import * as loko from './api/common_pb'
import StationDesc from './StationDesc'

export type EventListener = (message: string, src: StationDesc) => void

export enum EventType {
    Closed = 'closed',
    Linked = 'linked',
    Blocked = 'blocked',
    Signaled = 'signaled',
}

export enum MsgType {
    Signal = 'signal',
    Link = 'link',
    Block = 'block',
}
