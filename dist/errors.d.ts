export declare class NotFoundErr extends Error {
    what: any;
    constructor(what: any, message?: string | undefined);
}
export declare class ImageNotFoundErr extends NotFoundErr {
    what: any;
    constructor(what: any);
}
export declare class StationNotFoundErr extends NotFoundErr {
    what: any;
    constructor(what: any);
}
export declare class NotPermittedErr extends Error {
    what: any;
    constructor(what: any, message?: string | undefined);
}
export declare class UnmanagedErr extends Error {
    what: any;
    constructor(what: any, message?: string | undefined);
}
