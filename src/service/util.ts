import bcrypt from "bcrypt";
import { configs } from "config";
import { z } from "zod";
import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: string;
    email: string;
    role?: string;
}

interface SignOptions {
    algorithm?: jwt.Algorithm;
    expiresIn?: string | number;
}
const JWT_SECRET = process.env.JWT_SECRET as string;
export class Utils {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, configs.SALT_ROUNDS);
    }

    convertError<T extends z.ZodTypeAny>(parsed: ReturnType<T['safeParse']>) {
        if (!parsed.success) {
            return parsed.error.issues.map(issue => issue.message);
        }
        return [];
    }

    async comparePassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }



    signJwt(payload: JwtPayload, options?: SignOptions) {
        return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "1d" });
    }

    verifyJwt(token: string): JwtPayload | null {
        try {
            const decoded = jwt.verify(token, JWT_SECRET as string);
            return decoded as JwtPayload;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                console.error("JWT Expired at:", err.expiredAt);
            } else if (err instanceof jwt.JsonWebTokenError) {
                console.error("Invalid JWT Token");
            }
            return null;
        }
    }
}