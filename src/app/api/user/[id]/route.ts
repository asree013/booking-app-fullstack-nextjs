import { Services } from "@/service";
import { Users } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest,{ params }: { params: Promise<{ id: string }> }) => {
    const {id} = await params
    if (!id || id === '') return NextResponse.json(
        {
            success: false,
            message: "Not found Id",
            data: {}
        },
        {
            status: 404
        }
    )
    const body = await req.json() as Users
    if (!body) return NextResponse.json(
        {
            success: false,
            message: "you not send data",
            data: {}
        },
        {
            status: 400
        }
    )
    const result = await Services.userService.update(id, body)

    if (result.err) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.err || "Update failed",
                    data: result.data
                },
                {
                    status: result.status || 500 // ใช้ status 500 ตามที่ Service ส่งมา
                }
            )
        }
    return NextResponse.json(
        {
            success: true,
            message: "fetch data completed",
            data: result
        },
        {
            status: 200
        }
    )
}

export const GET = async (req: NextRequest,{ params }: { params: Promise<{ id: string }> }) => {
    const {id} = await params
    
    const result = await Services.userService.findById(id)
    const {password, ...safePassword} = result.data
    return NextResponse.json(
        {
            success: true,
            message: "fetch data completed",
            data: safePassword
        },
        {
            status: 200
        }
    )
}

export const DELETE = async (req: NextRequest,{ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    if (!id || id === '') return NextResponse.json(
        {
            success: false,
            message: "Not found Id",
            data: {}
        },
        {
            status: 404
        }
    )
    const body = await req.json() as Users
    if (!body) return NextResponse.json(
        {
            success: false,
            message: "you not send data",
            data: {}
        },
        {
            status: 400
        }
    )
    const result = await Services.userService.delete(id)
    return NextResponse.json(
        {
            success: true,
            message: "fetch data completed",
            data: result
        },
        {
            status: 200
        }
    )
}

