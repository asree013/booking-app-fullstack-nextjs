import { Services } from "@/service"
import { Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ product_id: string }> }) => {
    const { product_id } = await params
    const result = await Services.productService.findById(product_id)
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

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ product_id: string }> }) => {
    const { product_id } = await params
    const body = await req.json() as Product
    const result = await Services.productService.update(product_id, body)
    if (result.err) {
        return NextResponse.json(
            { message: result.err, data: result.data, status: result.status ?? 400 },
            { status: result.status ?? 400 },
        );
    }
    return NextResponse.json(
        { message: "edited", data: result.data, status: 200 },
        { status: 200 },
    );
}