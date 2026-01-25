import { Services } from "@/service";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const result = await Services.categoryBooking.delete(id)
    if (result.err) {
        return NextResponse.json(
            { message: result.err, data: result.data, status: result.status ?? 400 },
            { status: result.status ?? 400 },
        );
    }
    return NextResponse.json(
        { message: "deleted", data: result.data, status: 200 },
        { status: 200 },
    );
}