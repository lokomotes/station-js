"use strict";
module.exports = function accept(count, callback) {
    return async (station) => {
        const cnt = count;
        let listener;
        async function acceptor(message, src) {
            if (--count === 0) {
                listener = (_, src) => {
                    station.block().from(src);
                };
            }
            callback(station, message, src);
        }
        listener = acceptor;
        station.on('linked', (msg, src) => {
            listener(msg, src);
        });
    };
};
