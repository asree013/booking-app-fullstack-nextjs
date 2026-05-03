import { Services } from "@/service"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
    const result = await Services.userService.logout("")
    const response = NextResponse.json(
        { message: result.data.message },
        { status: result.status }
    )
    response.cookies.set('jwt', '', { maxAge: 0 })
    return response
}