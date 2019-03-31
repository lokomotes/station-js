import Station from '../../Station';
import StationDesc from '../../StationDesc';
declare type LessCallback = (message: string, src: StationDesc) => Promise<{
    message: string;
    next: StationDesc;
}> | void;
declare const _default: (callback: LessCallback) => Promise<(station: Station) => Promise<void>>;
export = _default;
