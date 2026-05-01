import { NextResponse } from "next/server"

export const GET = () => {
    return NextResponse.json({ message: "logout agian" }, { status: 200 })
}