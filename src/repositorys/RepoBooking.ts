import { handler, THandler } from "@/class/handler";
import { IBaseService } from "@/class/IBaseServer";
import { $Enums, Bookings } from "@prisma/client";
import axios from "axios";
import { prisma } from "lib/db";

export class RepoBooking implements IBaseService<Bookings> {
    async findAll(): Promise<THandler<Bookings[]>> {
        try {
            const result = await prisma.bookings.findMany({
                include: {
                    rooms: true,
                    user: {
                        select: {
                            first_name: true,
                            image: true,
                            email: true,
                            last_name: true
                        }
                    }
                },

            })
            return handler(result, undefined, 200)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return handler([], error.response?.data.message, 400)
            }
            return handler([], new Error("External Network Error"), 500)
        }
    }
    async findById(id: string): Promise<THandler<Bookings>> {
        try {
            if (!id) return handler({} as Bookings, new Error('Request Body'), 400)
            const result = await prisma.bookings.findFirst({
                where: { id },
                include: {
                    rooms: true,
                    user: true
                }
            })
            return handler(result as Bookings, undefined, 200)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return handler({} as Bookings, error.response?.data.message, 400)
            }
            return handler({} as Bookings, new Error("External Network Error"), 500)
        }
    }
    async create(data: Bookings): Promise<THandler<Bookings>> {
        try {
            if (!data) return handler({} as Bookings, new Error('Request Body'), 400)
            const result = await prisma.bookings.create({ data })
            return handler(result as Bookings, undefined, 200)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return handler({} as Bookings, error.response?.data.message, 400)
            }
            return handler({} as Bookings, new Error("External Network Error"), 500)
        }
    }
    async update(id: string, data: Partial<Bookings>): Promise<THandler<Bookings>> {
        try {
            if (!id || !data) return handler({} as Bookings, new Error('Request Body'), 400)
            const findId = await this.findById(id)
            if (!findId.data) return handler({} as Bookings, new Error('id not match'), 404)
            const result = await prisma.bookings.update({ data, where: { id } })
            return handler(result as Bookings, undefined, 200)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return handler({} as Bookings, error.response?.data.message, 400)
            }
            return handler({} as Bookings, new Error("External Network Error"), 500)
        }
    }
    async delete(id: string): Promise<THandler<Bookings>> {
        try {
            const findId = await this.findById(id)
            if (!findId.data) return handler({} as Bookings, new Error('id not match'), 404)
            const result = await prisma.bookings.delete({ where: { id } })
            return handler(result as Bookings, undefined, 200)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return handler({} as Bookings, error.response?.data.message, 400)
            }
            return handler({} as Bookings, new Error("External Network Error"), 500)
        }
    }

}