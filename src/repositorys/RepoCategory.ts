import { handler, THandler } from "@/class/handler";
import { IBaseService } from "@/class/IBaseServer";
import { CategoryBooking } from "@prisma/client";
import { prisma } from "lib/db";

export class RepoCategory implements IBaseService<CategoryBooking> {
    async findAll(): Promise<THandler<CategoryBooking[]>> {
        try {
            const result = await prisma.categoryBooking.findMany()
            return handler(result, undefined, 200)
        } catch (error) {
            return handler([], error as Error, 500);
        }
    }
    async findById(id: string): Promise<THandler<CategoryBooking & {product?: {name: string, id: string, image: string, detail: string}[]}>> {
        try {
            if(!id) return handler({}as CategoryBooking & {product?: {name: string, id: string, image: string, detail: string}[]} , new Error(`has'n id in data base`), 401)
            const result = await prisma.categoryBooking.findFirst({
                where: {
                    id
                },
                include: {
                    products: {
                        select: {
                            name: true,
                            id: true,
                            image: true,
                            detail: true,
                        }
                    }
                }
            })
            if(!result) return handler({}as CategoryBooking & {product?: {name: string, id: string, image: string, detail: string}[]} , new Error(`has'n data in database`), 404)
            return handler(result as CategoryBooking & {product?: {name: string, id: string, image: string, detail: string}[]}, undefined, 200)
        } catch (error) {
            return handler({} as CategoryBooking & {product?: {name: string, id: string, image: string, detail: string}[]}, error as Error)
        }
    }
    async create(data: CategoryBooking): Promise<THandler<CategoryBooking>> {
        try {
            if(!data) return handler({} as CategoryBooking, new Error('bad request body'), 400)
            const result = await prisma.categoryBooking.create({data})
            return handler(result, undefined, 200)
        } catch (error) {
            return handler({} as CategoryBooking, error as Error, 500)
            
        }
    }
    async update(id: string, data: Partial<CategoryBooking>): Promise<THandler<CategoryBooking>> {
        try {
            if(!id || !data){
                return handler({} as CategoryBooking, new Error('bad request body'), 400)
            }
            const result = await prisma.categoryBooking.update({where: {id}, data})
            return handler(result, undefined , 201)
        } catch (error) {
            return handler({} as CategoryBooking, error as Error, 500)
        }
    }
    async delete(id: string): Promise<THandler<CategoryBooking>> {
        try {
            if(!id){
                return handler({} as CategoryBooking, new Error('bad request body'), 400)
            }
            const result = await prisma.categoryBooking.delete({where: {id}})
            return handler(result, undefined, 202)
        } catch (error) {
            return handler({} as CategoryBooking, error as Error, 500)
        }
    }

}