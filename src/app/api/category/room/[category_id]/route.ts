import { NextRequest, NextResponse } from "next/server"

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ category_id: string }> }
) => {
  try {
    const { category_id } = await params
    // TODO: Implement logic to fetch room category by ID
    return NextResponse.json(
      { message: "Get room category by ID", data: null, status: 200 },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching room category", data: error, status: 500 },
      { status: 500 }
    )
  }
}
