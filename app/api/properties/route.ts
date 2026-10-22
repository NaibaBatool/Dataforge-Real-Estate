import { NextResponse } from "next/server"
import { filterProperties, getAllProperties } from "@/lib/properties-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const purpose = searchParams.get("purpose") || undefined
  const type = searchParams.get("type") || undefined
  const area = searchParams.get("area") || undefined
  const minPriceStr = searchParams.get("minPrice")
  const maxPriceStr = searchParams.get("maxPrice")

  const minPrice = minPriceStr ? parseInt(minPriceStr, 10) : undefined
  const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : undefined

  if (!purpose && !type && !area && minPrice === undefined && maxPrice === undefined) {
    return NextResponse.json({
      success: true,
      count: getAllProperties().length,
      properties: getAllProperties(),
    })
  }

  const results = filterProperties({
    purpose,
    type,
    area,
    minPrice,
    maxPrice,
  })

  return NextResponse.json({
    success: true,
    count: results.length,
    properties: results,
  })
}
