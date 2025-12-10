export declare const env: {
    readonly port: number;
    readonly nodeEnv: "development" | "production" | "test";
    readonly isDevelopment: boolean;
    readonly isProduction: boolean;
    readonly isTest: boolean;
    readonly database: {
        readonly url: string;
    };
    readonly jwt: {
        readonly secret: string;
        readonly expiresIn: string;
        readonly refreshSecret: string;
        readonly refreshExpiresIn: string;
    };
    readonly cors: {
        readonly origin: string;
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly maxRequests: number;
    };
    readonly apiKeys: {
        readonly weather: string | undefined;
        readonly eia: string | undefined;
        readonly toll: string | undefined;
    };
};
export type Env = typeof env;
//# sourceMappingURL=env.d.ts.map