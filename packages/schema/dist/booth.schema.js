"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBoothSchema = exports.CreateBoothSchema = exports.MAP_COLS = exports.MAP_ROWS = void 0;
const zod_1 = require("zod");
exports.MAP_ROWS = 5;
exports.MAP_COLS = 6;
exports.CreateBoothSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    companyId: zod_1.z.string(),
    modelPath: zod_1.z.string().optional(),
    mapRow: zod_1.z.number().int().min(0).max(exports.MAP_ROWS - 1),
    mapCol: zod_1.z.number().int().min(0).max(exports.MAP_COLS - 1),
});
exports.UpdateBoothSchema = exports.CreateBoothSchema.partial().extend({
    status: zod_1.z.enum(['pending', 'approved', 'rejected']).optional(),
});
