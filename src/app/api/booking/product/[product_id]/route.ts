import { NextRequest, NextResponse } from "next/server"

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }
) => {
  try {
    const { product_id } = await params
    // TODO: Implement logic to fetch booking product by ID
    return NextResponse.json(
      { message: "Get booking product by ID", data: null, status: 200 },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching booking product", data: error, status: 500 },
      { status: 500 }
    )
  }
}
