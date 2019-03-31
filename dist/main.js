"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_pb_1 = require("./api/router_pb");
const RouterMsg = __importStar(require("./api/router_pb"));
const flows = __importStar(require("./flows"));
const RouterClient_1 = __importDefault(require("./RouterClient"));
const StationDesc_1 = __importDefault(require("./StationDesc"));
const token_1 = __importDefault(require("./token"));
// tslint:disable-next-line:no-var-requires
const app = require('./app/main');
function sigHandler(sig) {
    const srcSt = sig.getSrc();
    const dstSt = sig.getDst();
    if (dstSt === undefined) {
        console.warn('Station is undefined');
        return;
    }
    const flowID = dstSt.getId();
    const dstName = dstSt.getName();
    const isExists = flows.has(flowID, dstName);
    function fetch() {
        const st = flows.get(flowID, dstName);
        return st;
    }
    function start() {
        const body = flows.create(flowID, dstName);
        const msg = sig.getMessage();
        let args;
        try {
            const parsed = JSON.parse(msg);
            Array.isArray(parsed)
                ? args = parsed
                : args = [msg];
        }
        catch (e) {
            args = [];
        }
        // @ts-ignore
        app(body.station, args);
        return body;
    }
    const Ctrl = router_pb_1.Signal.Control;
    const ctrl = sig.getControl();
    switch (ctrl) {
        default:
            console.warn('Unmanaged control flag: ' + ctrl);
            break;
        case Ctrl.START:
            if (isExists) {
                console.warn('Already opened `Station`: ' + dstName);
            }
            else {
                start();
            }
            break;
        case Ctrl.TERMINATE:
            if (!isExists) {
                console.warn('`Station` does not exist: ' + dstName);
            }
            else {
                flows.del(flowID, dstName);
            }
            break;
        case Ctrl.LINKED:
            (isExists
                // @ts-ignore
                ? fetch().emitter
                // @ts-ignore
                : start().emitter
            // @ts-ignore
            ).emit('linked', sig.getMessage(), new StationDesc_1.default(srcSt));
            break;
        case Ctrl.MESSAGE:
            if (!isExists) {
                console.warn('`Station` does not exist: ' + dstName);
                // @ts-ignore
            }
            else {
                fetch().emitter.emit('signal', sig.getMessage(), new StationDesc_1.default(srcSt));
            }
            break;
        case Ctrl.BLOCKED:
            if (!isExists) {
                console.warn('`Station` does not exist: ' + dstName);
                // @ts-ignore
            }
            else {
                fetch().emitter.emit('blocked', sig.getMessage(), new StationDesc_1.default(srcSt));
            }
            break;
    }
}
function main() {
    const sigStream = RouterClient_1.default.listen((() => {
        const req = new RouterMsg.ListenRequest();
        req.setToken(token_1.default);
        return req;
    })());
    sigStream.on('data', sigHandler);
    sigStream.on('error', (err) => {
        throw err;
    });
    sigStream.on('end', () => {
        throw new Error('Unexpected end of stream.');
    });
}
main();
