import { Services } from "@/service";
import { CategoryRooms } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json() as CategoryRooms
    const result = await Services.categoryRoom.create(body)
    if (result.err) {
        return NextResponse.json(
            { message: result.err, data: result.data, staus: result.status?? 400 },
            { status: result.status ?? 400 },
        );
    }
    return NextResponse.json(
        { message: "created", data: result.data, status: 200 },
        { status: 200 },
    );
}

export const GET = async () => {
    const result = await Services.categoryRoom.findAll()
    if (result.err) {
        return NextResponse.json(
            { message: result.err, data: result.data, status: result.status ?? 400  },
            { status: result.status ?? 400 },
        );
    }
    return NextResponse.json(
        { message: "created", data: result.data, status: 200 },
        { status: 200 },
    );
}