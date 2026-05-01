import { Services } from "@/service"
import { RoomService } from "@/service/room"
import { NextResponse } from "next/server"

export const GET = async (req: Request, { params }: { params: Promise<{ product_id: string }> }) => {
    try {
        const { product_id } = await params
        const rooms = await Services.room.getRoomByProductId(product_id)
        return NextResponse.json({ data: rooms })
    } catch (error) {
        return NextResponse.json({ error })
    }
}