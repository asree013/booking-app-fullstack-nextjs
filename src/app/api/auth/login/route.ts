import { TLogin } from "@/schema/auth"
import { Services } from "@/service"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    const body = await req.json() as TLogin
    const user = await Services.userService.login(body)
    return NextResponse.json(
        {  message: user?.err, data: user?.data},
        { status: user?.status },
    );
}