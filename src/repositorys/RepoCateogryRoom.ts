import { handler, THandler } from "@/class/handler";
import { IBaseService } from "@/class/IBaseServer";
import { CategoryBooking, CategoryRooms } from "@prisma/client";
import { prisma } from "lib/db";

export class RepoCategoryRoom implements IBaseService<CategoryRooms> {
    async findAll(): Promise<THandler<CategoryRooms[]>> {
        try {
            const result = await prisma.categoryRooms.findMany()
            return handler(result, undefined, 200)
        } catch (error) {
            return handler([], error as Error, 500);
        }
    }
    async findById(id: string): Promise<THandler<CategoryRooms>> {
        try {
            if(!id) return handler({}as CategoryRooms , new Error(`has'n id in data base`), 401)
            const result = await prisma.categoryRooms.findFirst({
                where: {
                    id
                },
 
            })
            if(!result) return handler({}as CategoryRooms , new Error(`has'n data in database`), 404)
            return handler(result as CategoryRooms, undefined, 200)
        } catch (error) {
            return handler({} as CategoryRooms, error as Error)
        }
    }
    async create(data: CategoryRooms): Promise<THandler<CategoryRooms>> {
        try {
            if(!data) return handler({} as CategoryRooms, new Error('bad request body'), 400)
            const result = await prisma.categoryRooms.create({data})
            return handler(result, undefined, 200)
        } catch (error) {
            return handler({} as CategoryRooms, error as Error, 500)
            
        }
    }
    async update(id: string, data: Partial<CategoryRooms>): Promise<THandler<CategoryRooms>> {
        try {
            if(!id || !data){
                return handler({} as CategoryRooms, new Error('bad request body'), 400)
            }
            const result = await prisma.categoryRooms.update({where: {id}, data})
            return handler(result, undefined , 201)
        } catch (error) {
            return handler({} as CategoryRooms, error as Error, 500)
        }
    }
    async delete(id: string): Promise<THandler<CategoryRooms>> {
        try {
            if(!id){
                return handler({} as CategoryRooms, new Error('bad request body'), 400)
            }
            const result = await prisma.categoryRooms.delete({where: {id}})
            return handler(result, undefined, 202)
        } catch (error) {
            return handler({} as CategoryRooms, error as Error, 500)
        }
    }

}