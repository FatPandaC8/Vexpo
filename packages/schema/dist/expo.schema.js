"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExpoSchema = exports.CreateExpoSchema = void 0;
const zod_1 = require("zod");
exports.CreateExpoSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    type: zod_1.z.string().min(1),
    startDate: zod_1.z.string().date(),
    endDate: zod_1.z.string().date(),
    description: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
});
exports.UpdateExpoSchema = exports.CreateExpoSchema.partial();
