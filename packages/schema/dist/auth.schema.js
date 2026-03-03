"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthCompleteSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(['exhibitor', 'organizer']),
});
exports.OAuthCompleteSchema = zod_1.z.object({
    role: zod_1.z.enum(['exhibitor', 'organizer']),
});
