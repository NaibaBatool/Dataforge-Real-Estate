"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Users,
  Flame,
  Sun,
  Snowflake,
  Search,
  Filter,
  RotateCcw,
  RefreshCw,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  AlertCircle,
  X,
  Building,
  Sparkles,
  Loader2,
  HelpCircle,
} from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import type { StoredLead, LeadStatus } from "@/lib/leads-store"
import type { PropertyMatch } from "@/lib/matching"

type LeadDetailData = {
  lead: StoredLead & { score: number; tier: string; breakdown: Record<string, number> }
  exactMatches: PropertyMatch[]
  alternativeMatches: PropertyMatch[]
}

export default function AdminLeadsPage() {
  const router = useRouter()

  // Authentication State
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Data State
  const [leads, setLeads] = useState<StoredLead[]>([])
  const [metrics, setMetrics] = useState({
    total: 0,
    hot: 0,
    warm: 0,
    cold: 0,
    newCount: 0,
    contactedCount: 0,
    qualifiedCount: 0,
    closedCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null)

  // Filters State
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState("all")
  const [purposeFilter, setPurposeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Selected Lead for Detail Drawer
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [leadDetail, setLeadDetail] = useState<LeadDetailData | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // 1. Verify authentication
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/admin/auth/me")
        if (!res.ok) {
          router.replace("/admin/login?redirect=/admin/leads")
          return
        }
        const data = await res.json()
        if (!data.authenticated) {
          router.replace("/admin/login?redirect=/admin/leads")
          return
        }
        setAdminUser(data.user)
      } catch {
        router.replace("/admin/login?redirect=/admin/leads")
      } finally {
        setAuthLoading(false)
      }
    }
    verifyAuth()
  }, [router])

  // 2. Fetch leads from API
  const fetchLeads = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const params = new URLSearchParams()
      if (tierFilter !== "all") params.set("tier", tierFilter)
      if (purposeFilter !== "all") params.set("purpose", purposeFilter)
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (search.trim()) params.set("search", search.trim())

      const res = await fetch(`/api/admin/leads?${params.toString()}`)
      const data = await res.json()

      if (res.ok && data.success) {
        setLeads(data.leads || [])
        if (data.metrics) {
          setMetrics(data.metrics)
        }
      }
    } catch (err) {
      console.error("Error fetching admin leads:", err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [tierFilter, purposeFilter, statusFilter, search])

  useEffect(() => {
    if (!authLoading) {
      fetchLeads()
    }
  }, [authLoading, fetchLeads])

  // 3. Fetch lead details for drawer when selected
  useEffect(() => {
    if (!selectedLeadId) {
      setLeadDetail(null)
      return
    }

    async function loadLeadDetail() {
      try {
        setDetailLoading(true)
        const res = await fetch(`/api/admin/leads/${encodeURIComponent(selectedLeadId!)}`)
        const data = await res.json()
        if (res.ok && data.success) {
          setLeadDetail(data)
        }
      } catch (err) {
        console.error("Error loading lead detail:", err)
      } finally {
        setDetailLoading(false)
      }
    }

    loadLeadDetail()
  }, [selectedLeadId])

  // 4. Update status handler
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      setUpdatingLeadId(leadId)
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      )
      if (leadDetail && leadDetail.lead.id === leadId) {
        setLeadDetail({
          ...leadDetail,
          lead: { ...leadDetail.lead, status: newStatus },
        })
      }

      const res = await fetch(`/api/admin/leads/${encodeURIComponent(leadId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        // Revert on failure
        fetchLeads()
      } else {
        fetchLeads()
      }
    } catch {
      fetchLeads()
    } finally {
      setUpdatingLeadId(null)
    }
  }

  const resetFilters = () => {
    setSearch("")
    setTierFilter("all")
    setPurposeFilter("all")
    setStatusFilter("all")
  }

  const isFiltered =
    search.trim().length > 0 ||
    tierFilter !== "all" ||
    purposeFilter !== "all" ||
    statusFilter !== "all"

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <AdminLayout adminEmail={adminUser?.email || "admin@dataforge.com"}>
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Pipeline Overview
          </span>
          <h1 className="mt-1 font-heading text-2xl sm:text-3xl font-bold text-navy">
            Qualified Real Estate Leads
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Manage incoming property requirements, prioritize hot prospects, and coordinate agent follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLeads}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 py-2 text-xs font-semibold text-navy hover:bg-cream transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {/* Total Leads */}
        <div className="rounded-2xl border border-hairline bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Total Leads
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-navy/5 text-navy">
              <Users className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-navy">{metrics.total}</span>
            <span className="text-xs font-medium text-emerald-600">Active pipeline</span>
          </div>
          <span className="mt-1 block text-[11px] text-ink-muted">
            {metrics.newCount} new uncontacted
          </span>
        </div>

        {/* Hot Leads */}
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-900">
              Hot Priority
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <Flame className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-red-900">{metrics.hot}</span>
            <span className="text-xs font-bold text-red-700">Score &ge; 8</span>
          </div>
          <span className="mt-1 block text-[11px] text-red-700/80">Immediate viewing ready</span>
        </div>

        {/* Warm Leads */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              Warm Leads
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Sun className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-amber-900">{metrics.warm}</span>
            <span className="text-xs font-bold text-amber-800">Score 4–7</span>
          </div>
          <span className="mt-1 block text-[11px] text-amber-800/80">Active 1–3 month horizon</span>
        </div>

        {/* Cold Leads */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
              Cold Leads
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
              <Snowflake className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-blue-900">{metrics.cold}</span>
            <span className="text-xs font-bold text-blue-800">Score 0–3</span>
          </div>
          <span className="mt-1 block text-[11px] text-blue-800/80">Researching / long-term</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-hairline bg-surface p-4 sm:p-5 shadow-xs mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-navy/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name, phone, email, or neighborhood..."
                className="w-full rounded-xl border border-hairline bg-surface pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-navy placeholder:text-ink-muted outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-navy"
                >
                  Clear
                </button>
              )}
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-hairline bg-surface px-3.5 py-2 text-xs font-semibold text-navy hover:bg-cream transition-colors"
              >
                <RotateCcw className="size-3.5 text-gold" />
                Reset Filters
              </button>
            )}
          </div>

          {/* Filter Pills Grid */}
          <div className="grid gap-3 sm:grid-cols-3 pt-2 border-t border-hairline/70">
            {/* Tier Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                Priority Tier
              </label>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full rounded-xl border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-navy outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
              >
                <option value="all">All Tiers</option>
                <option value="hot">Hot Only (Score &ge; 8)</option>
                <option value="warm">Warm Only (Score 4–7)</option>
                <option value="cold">Cold Only (Score 0–3)</option>
              </select>
            </div>

            {/* Purpose Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                Purpose
              </label>
              <select
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                className="w-full rounded-xl border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-navy outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
              >
                <option value="all">All Purposes</option>
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
                <option value="invest">Invest</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                Workflow Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-navy outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
              >
                <option value="all">All Statuses</option>
                <option value="new">New (Uncontacted)</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed / Deal Done</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Count Bar */}
      <div className="flex items-center justify-between mb-4 text-xs text-ink-muted">
        <span>
          Showing <strong className="text-navy">{leads.length}</strong> qualified lead(s)
        </span>
        <span className="text-[11px] text-ink-muted hidden sm:inline">
          Sorted by Priority Tier (Hot &rarr; Warm &rarr; Cold), then recency
        </span>
      </div>

      {/* Leads Table Container */}
      <div className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-hairline bg-cream/50 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5">Requirements</th>
                <th className="px-4 py-3.5">Target Area</th>
                <th className="px-4 py-3.5">Budget</th>
                <th className="px-4 py-3.5">Timeline</th>
                <th className="px-4 py-3.5 text-center">Score & Tier</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-ink-muted">
                    <Loader2 className="size-6 animate-spin mx-auto text-gold mb-2" />
                    <span>Loading lead pipeline...</span>
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => {
                  const isHot = lead.scoreBreakdown.tier === "hot"
                  const isWarm = lead.scoreBreakdown.tier === "warm"
                  const digitsOnly = lead.phone.replace(/\D/g, "")
                  const whatsappLink = `https://wa.me/${digitsOnly}?text=${encodeURIComponent(
                    `Hello ${lead.name}, this is DataForge Estates following up on your property search request.`
                  )}`

                  return (
                    <tr
                      key={lead.id}
                      className="transition-colors hover:bg-cream/30 cursor-pointer"
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      {/* Name & Created At */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-navy text-sm">{lead.name}</div>
                        <div className="text-[10px] text-ink-muted flex items-center gap-1 mt-0.5">
                          <Clock className="size-3 text-gold" />
                          <span>
                            {new Date(lead.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Contact Channels */}
                      <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="size-3.5" />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="font-medium text-navy hover:text-gold transition-colors"
                            title="Call customer"
                          >
                            {lead.phone}
                          </a>
                        </div>
                        {lead.email && (
                          <div className="text-[11px] text-ink-muted truncate max-w-[140px] mt-0.5">
                            <a
                              href={`mailto:${lead.email}`}
                              className="hover:underline hover:text-navy"
                            >
                              {lead.email}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Purpose & Property Type */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              lead.purpose === "buy"
                                ? "bg-navy text-white"
                                : lead.purpose === "rent"
                                ? "bg-gold text-navy"
                                : "bg-purple-100 text-purple-900"
                            }`}
                          >
                            {lead.purpose}
                          </span>
                          <span className="capitalize font-medium text-navy text-xs">
                            {lead.propertyType}
                          </span>
                        </div>
                      </td>

                      {/* Preferred Areas */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {lead.areas.slice(0, 2).map((a) => (
                            <span
                              key={a}
                              className="rounded-md bg-cream px-1.5 py-0.5 text-[10px] font-medium text-navy truncate"
                            >
                              {a}
                            </span>
                          ))}
                          {lead.areas.length > 2 && (
                            <span className="text-[10px] text-ink-muted font-bold">
                              +{lead.areas.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-navy">
                          ${lead.budgetMin.toLocaleString()} – ${lead.budgetMax.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-ink-muted">
                          {lead.purpose === "rent" ? "/ month" : "total budget"}
                        </span>
                      </td>

                      {/* Timeline */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="capitalize text-xs font-medium text-ink">
                          {lead.timeline.replace("_", " ")}
                        </span>
                      </td>

                      {/* Score & Tier Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                            isHot
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : isWarm
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {isHot && <Flame className="size-3 text-red-600" />}
                          {lead.scoreBreakdown.tier} ({lead.scoreBreakdown.totalScore} pts)
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          disabled={updatingLeadId === lead.id}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none transition-colors cursor-pointer ${
                            lead.status === "new"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : lead.status === "contacted"
                              ? "border-blue-300 bg-blue-50 text-blue-800"
                              : lead.status === "qualified"
                              ? "border-purple-300 bg-purple-50 text-purple-800"
                              : "border-gray-300 bg-gray-50 text-gray-700"
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      {/* View Dossier Action */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-surface px-2.5 py-1.5 text-xs font-semibold text-navy hover:bg-cream hover:border-gold/60 transition-all cursor-pointer"
                        >
                          <span>Dossier</span>
                          <ChevronRight className="size-3.5 text-gold" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan={9} className="py-12 text-center text-ink-muted">
                    <Users className="size-8 text-gold mx-auto mb-2 opacity-80" />
                    <h3 className="font-heading text-base font-bold text-navy">No leads found</h3>
                    <p className="mt-1 text-xs text-ink-muted max-w-sm mx-auto">
                      {isFiltered
                        ? "No leads match your active filters. Try resetting the filters or clearing your search term."
                        : "No lead submissions recorded yet. Qualified leads from the public website will appear here automatically."}
                    </p>
                    {isFiltered && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SLIDE-OVER LEAD DOSSIER DRAWER */}
      {/* ======================================================== */}
      {selectedLeadId && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-xs transition-opacity"
          onClick={() => setSelectedLeadId(null)}
        >
          <div
            className="w-full max-w-xl h-full bg-surface shadow-2xl flex flex-col border-l border-hairline overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-hairline p-5 bg-cream/40">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-navy text-gold">
                  <Users className="size-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-navy">
                    {leadDetail?.lead.name || "Lead Dossier"}
                  </h3>
                  <span className="text-xs text-ink-muted">
                    ID: {selectedLeadId}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-cream hover:text-navy transition-colors"
                aria-label="Close dossier"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {detailLoading ? (
                <div className="py-20 text-center">
                  <Loader2 className="size-8 animate-spin mx-auto text-gold mb-2" />
                  <p className="text-xs text-ink-muted">Loading complete qualification dossier...</p>
                </div>
              ) : leadDetail ? (
                <>
                  {/* Priority & Status Bar */}
                  <div className="flex items-center justify-between rounded-xl bg-cream/50 p-4 border border-hairline">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                        Priority Classification
                      </span>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          leadDetail.lead.tier === "hot"
                            ? "bg-red-100 text-red-800"
                            : leadDetail.lead.tier === "warm"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {leadDetail.lead.tier} Tier ({leadDetail.lead.score} points)
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                        Workflow Status
                      </span>
                      <select
                        value={leadDetail.lead.status}
                        onChange={(e) =>
                          handleStatusChange(leadDetail.lead.id, e.target.value as LeadStatus)
                        }
                        className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-navy outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
                      >
                        <option value="new">New (Uncontacted)</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed / Deal Done</option>
                      </select>
                    </div>
                  </div>

                  {/* Immediate Agent Action CTAs */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                      Instant Agent Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`https://wa.me/${leadDetail.lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hello ${leadDetail.lead.name}, this is DataForge Estates following up on your property requirements.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-semibold text-white shadow-xs hover:scale-[1.02] transition-transform"
                      >
                        <MessageCircle className="size-4" />
                        <span>Chat WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${leadDetail.lead.phone}`}
                        className="flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-xs font-semibold text-white shadow-xs hover:bg-navy/90 transition-colors"
                      >
                        <Phone className="size-4 text-gold" />
                        <span>Call Customer</span>
                      </a>
                    </div>
                  </div>

                  {/* Customer Information Card */}
                  <div className="rounded-xl border border-hairline bg-surface p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted border-b border-hairline/80 pb-2">
                      Customer Profile & Verification
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-ink-muted">Full Name:</span>
                        <p className="font-semibold text-navy">{leadDetail.lead.name}</p>
                      </div>
                      <div>
                        <span className="text-ink-muted">Phone Number:</span>
                        <p className="font-semibold text-navy">{leadDetail.lead.phone}</p>
                      </div>
                      <div>
                        <span className="text-ink-muted">Email Address:</span>
                        <p className="font-semibold text-navy">
                          {leadDetail.lead.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className="text-ink-muted">Submission Date:</span>
                        <p className="font-semibold text-navy">
                          {new Date(leadDetail.lead.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requirement Parameters Card */}
                  <div className="rounded-xl border border-hairline bg-surface p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted border-b border-hairline/80 pb-2">
                      Property Requirements
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-ink-muted">Purpose & Type:</span>
                        <p className="font-semibold text-navy capitalize">
                          {leadDetail.lead.purpose} • {leadDetail.lead.propertyType}
                        </p>
                      </div>
                      <div>
                        <span className="text-ink-muted">Budget Window:</span>
                        <p className="font-semibold text-navy">
                          ${leadDetail.lead.budgetMin.toLocaleString()} – ${leadDetail.lead.budgetMax.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-ink-muted">Preferred Neighborhoods:</span>
                        <p className="font-semibold text-navy">
                          {leadDetail.lead.areas.join(", ") || "Any area"}
                        </p>
                      </div>
                      <div>
                        <span className="text-ink-muted">Move-in Horizon:</span>
                        <p className="font-semibold text-navy capitalize">
                          {leadDetail.lead.timeline.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    {leadDetail.lead.notes && (
                      <div className="pt-2 border-t border-hairline/60">
                        <span className="text-[11px] font-semibold text-ink-muted">Customer Notes:</span>
                        <p className="mt-1 rounded-lg bg-cream/60 p-2.5 text-xs text-navy italic">
                          &ldquo;{leadDetail.lead.notes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Scoring Algorithm Breakdown */}
                  <div className="rounded-xl border border-hairline bg-cream/40 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2 flex items-center justify-between">
                      <span>Scoring Breakdown</span>
                      <span className="text-navy font-bold">{leadDetail.lead.score} Total Points</span>
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Timeline ({leadDetail.lead.timeline}):</span>
                        <span className="font-semibold text-navy">
                          +{leadDetail.lead.breakdown?.timelinePoints || 0} pts
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Valid Budget Range:</span>
                        <span className="font-semibold text-navy">
                          +{leadDetail.lead.breakdown?.budgetPoints || 0} pts
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Specific Neighborhood Selected:</span>
                        <span className="font-semibold text-navy">
                          +{leadDetail.lead.breakdown?.areaPoints || 0} pts
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Verified Phone Provided:</span>
                        <span className="font-semibold text-navy">
                          +{leadDetail.lead.breakdown?.phonePoints || 0} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Matched Properties Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
                      Recommended Matches ({leadDetail.exactMatches.length} exact, {leadDetail.alternativeMatches.length} alternative)
                    </h4>
                    <div className="space-y-2.5">
                      {[...leadDetail.exactMatches, ...leadDetail.alternativeMatches]
                        .slice(0, 4)
                        .map((match) => (
                          <div
                            key={match.property.id}
                            className="flex items-center gap-3 rounded-xl border border-hairline bg-surface p-2.5 hover:border-gold/60 transition-colors"
                          >
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={match.property.image}
                                alt={match.property.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block truncate text-xs font-bold text-navy">
                                {match.property.title}
                              </span>
                              <span className="block text-[11px] text-ink-muted">
                                {match.property.area} • {match.property.priceFormatted}
                              </span>
                            </div>
                            <Link
                              href={`/properties/${match.property.id}`}
                              target="_blank"
                              className="flex size-7 items-center justify-center rounded-lg bg-navy/5 text-navy hover:bg-gold hover:text-white transition-colors"
                              title="View listing"
                            >
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-ink-muted">
                  <AlertCircle className="size-6 mx-auto mb-2 text-red-500" />
                  <p>Lead details could not be loaded.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
