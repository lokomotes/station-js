"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("grpc"));
const RouterService = __importStar(require("./api/router_grpc_pb"));
exports.default = new RouterService.RouterClient(`${process.env.LOKO_METRO_HOST || '0.0.0.0'}:${process.env.LOKO_METRO_PORT || 50051}`, grpc.credentials.createInsecure());
