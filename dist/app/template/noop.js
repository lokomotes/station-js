"use strict";
module.exports = async function noop(station) {
    station.log('noop');
    station.close();
};
