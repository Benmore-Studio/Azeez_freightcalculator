import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../types/index.js';
export declare const registerSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    companyName: z.ZodOptional<z.ZodString>;
    company_name: z.ZodOptional<z.ZodString>;
    userType: z.ZodOptional<z.ZodEnum<["owner_operator", "fleet_manager", "dispatcher"]>>;
    user_type: z.ZodOptional<z.ZodEnum<["owner_operator", "fleet_manager", "dispatcher"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    phone?: string | undefined;
    companyName?: string | undefined;
    userType?: "owner_operator" | "fleet_manager" | "dispatcher" | undefined;
    company_name?: string | undefined;
    user_type?: "owner_operator" | "fleet_manager" | "dispatcher" | undefined;
}, {
    name: string;
    email: string;
    password: string;
    phone?: string | undefined;
    companyName?: string | undefined;
    userType?: "owner_operator" | "fleet_manager" | "dispatcher" | undefined;
    company_name?: string | undefined;
    user_type?: "owner_operator" | "fleet_manager" | "dispatcher" | undefined;
}>, {
    email: string;
    password: string;
    name: string;
    phone: string | undefined;
    companyName: string | undefined;
    userType: "owner_operator" | "fleet_manager" | "dispatcher" | undefined;
}, {
    name: string;
    email: string;
    password: string;
    phone?: string | undefined;
    companyName?: string | undefined;
    userType?: "owner_operator" | "fleet_manager" | "dispatcher" | undefined;
    company_name?: string | undefined;
    user_type?: "owner_operator" | "fleet_manager" | "dispatcher" | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const refreshSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare function register(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function login(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function logout(_req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map