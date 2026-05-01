import { Services } from "@/service";
import { Users } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    const res = await Services.room.findAll()
    if (res.err) {
        return NextResponse.json(
            { success: false, message: res.err, data: res.data },
            { status: 500 },
        );
    }
    return NextResponse.json(
        { success: true, message: "Hello Wold", data: res },
        { status: 200 },
    );
}

export const POST = async (req: NextRequest) => {
    const body = await req.json()
    const res = await Services.room.create(body)
    if (res.err) {
        return NextResponse.json(
            { success: false, message: res.err, data: res.data },
            { status: 500 },
        );
    }
    return NextResponse.json(
        { success: true, message: "Hello Wold", data: res },
        { status: 200 },
    );
}


