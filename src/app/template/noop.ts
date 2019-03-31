import Station from '../../Station'

export = async function noop(station: Station) {
    station.log('noop')
    station.close()
}
