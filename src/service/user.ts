import { loginSchema, TLogin } from "@/schema/auth";
import { Services } from ".";
import { handler } from "@/class/handler";
import { prisma } from "lib/db";
import { RepoUsers } from "@/repositorys/RepoUser";

export class UserServices extends RepoUsers {

    async login(data: TLogin) {
        try {
            const parsed = await loginSchema.safeParse(data)
            if (parsed.error) {
                const err = Services.utils.convertError(parsed)
                console.log({ err });

                return handler({}, new Error(err as any), 400)
            }
            const user = await prisma.users.findFirst({ where: { email: data.email } })
            if (!user) {
                return handler({}, new Error('username or password not match'), 400)
            }
            const isValid = await Services.utils.comparePassword(data.password, user.password)
            if (!isValid) {
                return handler({}, new Error('username or password not match'), 400)
            }
            const jwt = await Services.utils.signJwt({ id: user.id, email: user.email })
            const { password, ...safeUser } = user;
            return handler({ jwt, user: safeUser }, undefined, 200)

        } catch (error: any) {
            return handler({}, new Error(error), 500)
        }
    }

    async verify(jwt: string) {
        if (!jwt || jwt === '') {
            return handler({ expire: true, data: {} }, new Error('Not Found JWT'), 400);
        }

        try {
            const result = await Services.utils.verifyJwt(jwt);

            if (!result) {
                return handler({ expire: true, data: {} }, new Error('keys หมดอายุหรือ Token ไม่ถูกต้อง'), 401);
            }

            return handler({ expire: false, data: result }, undefined, 200);

        } catch (error: any) {
            const isExpired = error.name === 'TokenExpiredError';

            return handler(
                { expire: isExpired, data: {} },
                new Error(isExpired ? 'Token หมดอายุแล้ว' : 'ยืนยันตัวตนล้มเหลว'),
                401
            );
        }
    }
}