import { Services } from "@/service"
import { Product, Rooms } from "@prisma/client"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
    const data = await req.json() as Product & { category: [{ id: string }] } & { rooms: Rooms }
    const result = await Services.productService.create(data)
}