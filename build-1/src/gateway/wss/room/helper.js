"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpcMethod = void 0;
function rpcMethod(_target, _propertyKey, descriptor) {
    descriptor.value.isRpcMethod = true;
}
exports.rpcMethod = rpcMethod;
//# sourceMappingURL=helper.js.map