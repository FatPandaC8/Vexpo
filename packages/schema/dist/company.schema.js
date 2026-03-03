"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompanySchema = exports.RegisterCompanySchema = void 0;
const zod_1 = require("zod");
exports.RegisterCompanySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    industry: zod_1.z.string(),
    country: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    website: zod_1.z.string().url().optional(),
    description: zod_1.z.string().optional(),
});
exports.UpdateCompanySchema = exports.RegisterCompanySchema.partial();
