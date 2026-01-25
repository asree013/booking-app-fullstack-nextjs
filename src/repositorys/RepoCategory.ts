import { handler, THandler } from "@/class/handler";
import { IBaseService } from "@/class/IBaseServer";
import { Category } from "@prisma/client";
import { prisma } from "lib/db";

export class RepoCategory implements IBaseService<Category> {
    async findAll(): Promise<THandler<Category[]>> {
        try {
            const result = await prisma.category.findMany()
            return handler(result, undefined, 200)
        } catch (error) {
            return handler([], error as Error, 500);
        }
    }
    async findById(id: string): Promise<THandler<Category & { product?: { name: string, id: string, image: string, detail: string }[] }>> {
        try {
            if (!id) return handler({} as Category & { product?: { name: string, id: string, image: string, detail: string }[] }, new Error(`has'n id in data base`), 401)
            const result = await prisma.category.findFirst({
                where: {
                    id
                },

            })
            if (!result) return handler({} as Category & { product?: { name: string, id: string, image: string, detail: string }[] }, new Error(`has'n data in database`), 404)
            return handler(result as Category & { product?: { name: string, id: string, image: string, detail: string }[] }, undefined, 200)
        } catch (error) {
            return handler({} as Category & { product?: { name: string, id: string, image: string, detail: string }[] }, error as Error)
        }
    }
    async create(data: Category): Promise<THandler<Category>> {
        try {
            if (!data) return handler({} as Category, new Error('bad request body'), 400)
            const result = await prisma.category.create({ data })
            return handler(result, undefined, 200)
        } catch (error) {
            return handler({} as Category, error as Error, 500)

        }
    }
    async update(id: string, data: Partial<Category>): Promise<THandler<Category>> {
        try {
            if (!id || !data) {
                return handler({} as Category, new Error('bad request body'), 400)
            }
            const result = await prisma.category.update({ where: { id }, data })
            return handler(result, undefined, 201)
        } catch (error) {
            return handler({} as Category, error as Error, 500)
        }
    }
    async delete(id: string): Promise<THandler<Category>> {
        try {
            if (!id) {
                return handler({} as Category, new Error('bad request body'), 400)
            }
            const result = await prisma.category.delete({ where: { id } })
            return handler(result, undefined, 202)
        } catch (error) {
            return handler({} as Category, error as Error, 500)
        }
    }

}