import { Services } from "@/service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const jwt = url.searchParams.get('jwt') as string
    const result = await Services.userService.verify(jwt)

    console.log({check: result.status});
    
    
    return NextResponse.json(
        { message: result.err?.message ?? 'this the JWT', data: result.data },
        { status: result.status },
    )
}