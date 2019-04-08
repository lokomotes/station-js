if (require.main === module) {
    // tslint:disable-next-line:no-var-requires
    require('./main').main()
} else {
    // tslint:disable-next-line:no-var-requires
    module.exports = require('./Station')
}
