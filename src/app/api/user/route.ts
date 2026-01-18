import { Services } from "@/service";
import { Users } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    const res = await Services.userService.findAll()
    if (res.err) {
        return NextResponse.json(
            { success: false, message: res.err.message, data: res.data },
            { status: 500 },
        );
    }
    return NextResponse.json(
        { success: true, message: "Hello Wold", data: res },
        { status: 200 },
    );
}


