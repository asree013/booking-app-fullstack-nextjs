import { Services } from "@/service"
import { Product, Rooms } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    const data = await req.json() as Product & { category: [{ id?: string }] } & { rooms?: Rooms }
    const result = await Services.productService.create(data)
    if (result.err) {
        return NextResponse.json(
            { message: result.err, data: result.data, status: result.status ?? 400 },
            { status: result.status ?? 400 },
        );
    }
    return NextResponse.json(
        { message: "created product", data: result.data, status: 200 },
        { status: 200 },
    );
}

export const GET = async () => {
    const result = await Services.productService.findAll()
    if (result.err) {
        return NextResponse.json(
            { message: result.err, data: result.data, status: result.status ?? 400 },
            { status: result.status ?? 400 },
        );
    }
    return NextResponse.json(
        { message: "created product", data: result.data, status: 200 },
        { status: 200 },
    );
}