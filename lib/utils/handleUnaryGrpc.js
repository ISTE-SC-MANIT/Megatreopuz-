"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRPCCall = void 0;
const grpc_1 = require("grpc");
function makeMetadata(input) {
    const m = new grpc_1.Metadata();
    for (const key in input)
        m.set(key, input[key]);
    return m;
}
function makeRPCCall(client, rpc, input, metadataInput = {}) {
    return new Promise((resolve, reject) => {
        const metadata = makeMetadata(metadataInput);
        rpc.call(client, input, metadata, (err, value) => {
            if (err)
                reject(new Error(err.details));
            if (!value)
                reject(new Error(`Server did not send any response`));
            resolve(value);
        });
    });
}
exports.makeRPCCall = makeRPCCall;
//# sourceMappingURL=handleUnaryGrpc.js.map