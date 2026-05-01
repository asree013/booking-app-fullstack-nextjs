import { handler, THandler } from "@/class/handler";
import { IBaseService } from "@/class/IBaseServer";
import { Rooms } from "@prisma/client";
import axios from "axios";
import { prisma } from "lib/db";

export class RepoRoom implements IBaseService<Rooms> {
    async findAll(): Promise<THandler<Rooms[]>> {
        try {
            const result = await prisma.rooms.findMany()
            return handler(result, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler([], error.response?.data.message, 400)
            }
            return handler([], new Error(error.message || "External Network Error"), 400)
        }
    }
    async findById(id: string): Promise<THandler<Rooms>> {
        try {
            if (!id) return handler({} as Rooms, new Error("Request Body"), 400)
            const result = await prisma.rooms.findFirst({
                where: { id },
                include: {
                    booking: true,
                    product: true
                }
            })
            if (!result) return handler({} as Rooms, new Error("not found data"), 404)
            return handler(result as Rooms, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Rooms, error.response?.data.message, 400)
            }
            return handler({} as Rooms, new Error(error.message || "External Network Error"), 400)
        }
    }
    async create(data: Rooms): Promise<THandler<Rooms>> {
        try {
            if (!data) return handler({} as Rooms, new Error("Request Body"), 400)
            const result = await prisma.rooms.create({ data })
            return handler(result as Rooms, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Rooms, error.response?.data.message, 400)
            }
            return handler({} as Rooms, new Error(error.message || "External Network Error"), 400)
        }
    }
    async update(id: string, data: Partial<Rooms>): Promise<THandler<Rooms>> {
        try {
            if (!id || !data) return handler({} as Rooms, new Error("Request Body"), 400)
            const findId = await this.findById(id)
            if (!findId.data) return handler({} as Rooms, new Error("Not Found ID"), 404)
            const result = await prisma.rooms.update({
                where: { id },
                data
            })
            return handler(result as Rooms, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Rooms, error.response?.data.message, 400)
            }
            return handler({} as Rooms, new Error(error.message || "External Network Error"), 400)
        }
    }
    async delete(id: string): Promise<THandler<Rooms>> {
        try {
            if (!id) return handler({} as Rooms, new Error("Request Body"), 400)
            const result = await prisma.rooms.delete({
                where: { id },
            })
            if (!result) return handler({} as Rooms, new Error("not found ID"), 404)
            return handler(result as Rooms, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Rooms, error.response?.data.message, 400)
            }
            return handler({} as Rooms, new Error(error.message || "External Network Error"), 400)
        }
    }

}