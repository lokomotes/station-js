import * as grpc from 'grpc'
import * as RouterService from './api/router_grpc_pb'

export default new RouterService.RouterClient(
    `${
    process.env.LOKO_METRO_HOST || '0.0.0.0'
    }:${
    process.env.LOKO_METRO_PORT || 50051
    }`,
    grpc.credentials.createInsecure(),
)
