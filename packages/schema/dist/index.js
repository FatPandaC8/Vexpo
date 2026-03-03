"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAP_ROWS = exports.MAP_COLS = void 0;
__exportStar(require("./auth.schema"), exports);
__exportStar(require("./expo.schema"), exports);
__exportStar(require("./booth.schema"), exports);
__exportStar(require("./company.schema"), exports);
__exportStar(require("./user.schema"), exports);
exports.MAP_COLS = 6;
exports.MAP_ROWS = 5;
// Nuxt uses CJS import vs Nest uses ESM import type
