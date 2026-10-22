import {
  PROPERTIES_DATA,
  AVAILABLE_AREAS,
  type Property as BaseProperty,
  type ListingStatus,
  type PropertyType,
  type Purpose,
} from "./properties-data"

export type { ListingStatus, PropertyType, Purpose }

export type Property = {
  id: string
  title: string
  description?: string
  area: string
  city?: string
  price: string
  priceNumeric?: number
  status: ListingStatus
  purpose: Purpose
  type: PropertyType
  beds: number
  baths: number
  size: number // sqft
  image: string
  imageAlt: string
  features?: string[]
}

export const properties: Property[] = PROPERTIES_DATA.map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  area: p.area,
  city: p.city,
  price: p.priceFormatted,
  priceNumeric: p.price,
  status: p.status,
  purpose: p.purpose,
  type: p.type,
  beds: p.beds,
  baths: p.baths,
  size: p.size,
  image: p.image,
  imageAlt: p.imageAlt,
  features: p.features,
}))

export type FilterKey = "all" | "buy" | "rent" | "house" | "apartment" | "plot" | "commercial"

export const propertyFilters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "buy", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "house", label: "Houses" },
  { key: "apartment", label: "Apartments" },
  { key: "plot", label: "Plots" },
  { key: "commercial", label: "Commercial" },
]

export function matchesFilter(property: Property, filter: FilterKey): boolean {
  if (filter === "all") return true
  if (filter === "buy" || filter === "rent") return property.purpose === filter
  return property.type === filter
}

export type Testimonial = {
  id: string
  name: string
  quote: string
  detail: string
  avatar: string
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah & James Miller",
    quote:
      "We told them our budget and timeline, and within days we were touring homes that actually fit. We closed on our dream house a month later.",
    detail: "Bought a 4-bed house in Emerald Heights",
    avatar: "/images/client-1.png",
  },
  {
    id: "t2",
    name: "Aisha Rahman",
    quote:
      "No pushy sales, no wasted viewings. Every apartment they sent matched exactly what I asked for. The whole process felt effortless.",
    detail: "Rented an apartment in Downtown District",
    avatar: "/images/client-2.png",
  },
  {
    id: "t3",
    name: "David Chen",
    quote:
      "Their investment advice was honest and clear. I bought a plot with real growth potential and felt informed at every step.",
    detail: "Invested in a plot in Green Valley",
    avatar: "/images/client-3.png",
  },
]

export type Agent = {
  id: string
  name: string
  role: string
  photo: string
  photoAlt: string
}

export const agents: Agent[] = [
  {
    id: "a1",
    name: "Elena Vasquez",
    role: "Senior Property Advisor",
    photo: "/images/agent-1.png",
    photoAlt: "Portrait of Elena Vasquez, Senior Property Advisor",
  },
  {
    id: "a2",
    name: "Marcus Bennett",
    role: "Managing Broker",
    photo: "/images/agent-2.png",
    photoAlt: "Portrait of Marcus Bennett, Managing Broker",
  },
  {
    id: "a3",
    name: "Omar Farooq",
    role: "Rentals Specialist",
    photo: "/images/agent-3.png",
    photoAlt: "Portrait of Omar Farooq, Rentals Specialist",
  },
  {
    id: "a4",
    name: "Nadia Sheikh",
    role: "Investment Advisor",
    photo: "/images/agent-4.png",
    photoAlt: "Portrait of Nadia Sheikh, Investment Advisor",
  },
]

export const areas = [...AVAILABLE_AREAS]

export const budgetOptions = [
  "Under $150k",
  "$150k – $400k",
  "$400k – $700k",
  "$700k – $1M",
  "$1M+",
]
