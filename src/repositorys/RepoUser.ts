import { $Enums, Users } from "@prisma/client";
import { prisma } from "lib/db";
import { Services } from "@/service";
import { createUserSchema } from "@/schema/users";
import { IBaseService } from "@/class/IBaseServer";
import { handler, THandler } from "@/class/handler";

export class RepoUsers implements IBaseService<Users> {
    async findAll(): Promise<THandler<Users[]>> {
        try {
            const result = await prisma.users.findMany();
            return handler(result);
        } catch (error) {
            return handler([], error as Error);
        }
    }
    async findById(id: string): Promise<THandler<Users>> {
        try {
            const result = await prisma.users.findFirst({ where: { id } });
            if (!result) {
                return handler({} as Users, new Error('Not Found User'));
            }
            const {password} = result
            return handler(result);
        } catch (error) {
            return handler({} as Users, error as Error);
        }
    }
    async create(data: Users): Promise<THandler<Users>> {
        try {
            const parsed = createUserSchema.safeParse(data);
            if (parsed.error) {
                const errors = Services.utils.convertError(parsed)
                console.log({ errors });

                return handler(
                    {} as Users,
                    new Error(errors as any),
                    400
                );
            }

            const hashedPassword = await Services.utils.hashPassword(parsed.data.password);
            const result = await prisma.users.create({
                data: {
                    ...parsed.data,
                    password: hashedPassword,
                },
            });
            return handler(result, undefined, 200)
        } catch (error: any) {
            return handler({} as Users, error.message);
        }
    }
    async update(id: string, data: Partial<Users>): Promise<THandler<Users>> {
        try {
            const result = await prisma.users.update({ where: { id }, data })
            return handler(result)
        } catch (error) {
            return handler({} as Users, error as Error, 500);
        }
    }
    async delete(id: string): Promise<THandler<Users>>{
        try {
            const result = await prisma.users.delete({ where: { id } })
            return handler(result)
        } catch (error) {
            return handler({} as Users, error as Error);
        }
    }

}