import { NextResponse } from "next/server"

export const GET = () => {
    NextResponse.json({ message: "logout" }, { status: 200 })
}