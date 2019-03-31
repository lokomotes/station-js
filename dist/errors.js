"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundErr extends Error {
    constructor(what, message) {
        const msg = message || 'Resource not found';
        super(`${msg}: ${what}`);
        this.what = what;
    }
}
exports.NotFoundErr = NotFoundErr;
class ImageNotFoundErr extends NotFoundErr {
    constructor(what) {
        super(what, 'Image not found');
    }
}
exports.ImageNotFoundErr = ImageNotFoundErr;
class StationNotFoundErr extends NotFoundErr {
    constructor(what) {
        super(what, 'Station not found');
    }
}
exports.StationNotFoundErr = StationNotFoundErr;
class NotPermittedErr extends Error {
    constructor(what, message) {
        const msg = message || 'Access not permitted';
        super(`${msg}: ${what}`);
        this.what = what;
    }
}
exports.NotPermittedErr = NotPermittedErr;
class UnmanagedErr extends Error {
    constructor(what, message) {
        const msg = message || 'Unexpected Err';
        super(`${msg}: ${what}`);
        this.what = what;
    }
}
exports.UnmanagedErr = UnmanagedErr;
