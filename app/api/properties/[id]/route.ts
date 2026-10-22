import { NextResponse } from "next/server"
import { getPropertyById } from "@/lib/properties-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const property = getPropertyById(id)

  if (!property) {
    return NextResponse.json(
      { success: false, error: "Property not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    property,
  })
}
