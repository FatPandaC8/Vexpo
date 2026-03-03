"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(4, 'Min name length is 4'),
    email: zod_1.z.string().email(),
    role: zod_1.z.string().min(1, 'Select a role'),
});
