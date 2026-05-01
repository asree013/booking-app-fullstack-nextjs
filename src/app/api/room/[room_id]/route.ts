import { Services } from "@/service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ room_id: string }> }) => {
    const { room_id } = await params
    const result = await Services.room.findById(room_id)
    if (result.err) {
        return NextResponse.json(
            { message: result.err, data: result.data, status: result.status ?? 400 },
            { status: result.status ?? 400 },
        );
    }
    return NextResponse.json(
        { message: "find by id", data: result.data, status: 200 },
        { status: 200 },
    );

}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ room_id: string }> }) => {
    const { room_id } = await params
    const result = await Services.room.delete(room_id)
    if (result.err) {
        return NextResponse.json(
            { message: result.err, data: result.data, status: result.status ?? 400 },
            { status: result.status ?? 400 },
        );
    }
    return NextResponse.json(
        { message: "find by id", data: result.data, status: 200 },
        { status: 200 },
    );

}

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ room_id: string }> }) => {
    const { room_id } = await params
    const body = await req.json()
    const result = await Services.room.update(room_id, body)
    if (result.err) {
        return NextResponse.json(
            { message: result.err, data: result.data, status: result.status ?? 400 },
            { status: result.status ?? 400 },
        );
    }
    return NextResponse.json(
        { message: "find by id", data: result.data, status: 200 },
        { status: 200 },
    );
}