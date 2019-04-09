import { Station } from '../Station'

export = (s: Station, args: string) => {
    s.log('noop')
    s.close()
}
