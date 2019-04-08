export class NotFoundErr extends Error {
    public what: any
    constructor(what: any, message?: string | undefined) {
        const msg = message || 'Resource not found'
        super(`${msg}: ${what}`)
        this.what = what
    }
}

export class ImageNotFoundErr extends NotFoundErr {
    public what: any
    constructor(what: any) {
        super(what, 'Image not found')
    }
}

export class StationNotFoundErr extends NotFoundErr {
    public what: any
    constructor(what: any) {
        super(what, 'Station not found')
    }
}

export class NotPermittedErr extends Error {
    public what: any
    constructor(what: any, message?: string | undefined) {
        const msg = message || 'Access not permitted'
        super(`${msg}: ${what}`)
        this.what = what
    }
}

export class UnmanagedErr extends Error {
    public what: any
    constructor(what: any, message?: string | undefined) {
        const msg = message || 'Unmanaged'
        super(`${msg}: ${what}`)
        this.what = what
    }
}
