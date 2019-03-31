import Station from '../../Station';
import StationDesc from '../../StationDesc';
declare type AcceptCallback = (station: Station, message: string, src: StationDesc) => void;
declare const _default: (count: number, callback: AcceptCallback) => (station: Station) => Promise<void>;
export = _default;
