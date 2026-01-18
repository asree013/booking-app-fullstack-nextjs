import { Services } from "@/service";
import { ProductService } from "@/service/product";
import { Users } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json() as Users
    const result = await Services.userService.create(body)
    if (result.err) {
        return NextResponse.json(
            { message: result.err.message, data: result.data },
            { status: result.status?? 400 },
        );
    }
    return NextResponse.json(
        {  message: "created", data: result.data },
        { status: 200 },
    );
}