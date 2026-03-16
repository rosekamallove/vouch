"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { Testimonial } from "@prisma/client"
import Image from "next/image"
import {
  Star, Play, MessageSquare, CheckCircle, PartyPopper,
  Check, X, Clock, Search, Loader2, Tag, ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type T = Testimonial

const SUGGESTED_TAGS = ["pricing", "onboarding", "speed", "support", "design", "value", "reliability", "ux"]

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i <= rating ? "currentColor" : "none"}
          style={{ color: i <= rating ? "var(--primary)" : "#e2e8f0" }}
        />
      ))}
    </span>
  )
}

function TagEditor({ tags, onSave }: { tags: string[]; onSave: (tags: string[]) => void }) {
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const filtered = SUGGESTED_TAGS.filter((t) => !tags.includes(t) && t.includes(input.toLowerCase()))

  function addTag(tag: string) {
    const clean = tag.trim().toLowerCase().replace(/\s+/g, "-")
    if (!clean || tags.includes(clean) || tags.length >= 10) return
    onSave([...tags, clean])
    setInput("")
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-2">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <Tag className="w-2.5 h-2.5 opacity-50" />
              {tag}
              <button
                onClick={() => onSave(tags.filter((t) => t !== tag))}
                className="ml-0.5 opacity-40 hover:opacity-100 hover:text-red-500 transition-all leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative inline-block">
        <Input
          className="h-7 text-xs w-[140px] bg-transparent border-dashed focus:border-solid focus:w-[180px] transition-all duration-200"
          placeholder="+ Add tag…"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(input) } }}
        />
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute z-20 top-full mt-1.5 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden">
            <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Suggestions</div>
            {filtered.slice(0, 6).map((tag) => (
              <button
                key={tag}
                className="w-full text-left px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
                onMouseDown={() => addTag(tag)}
              >
                <Tag className="w-3 h-3 opacity-40" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AuthorAvatar({ t }: { t: T }) {
  if (t.avatarUrl) {
    return (
      <Image
        src={t.avatarUrl}
        alt={t.authorName}
        width={36}
        height={36}
        className="rounded-full object-cover w-9 h-9 shrink-0 ring-2 ring-white dark:ring-zinc-900 shadow-sm"
      />
    )
  }
  const initials = t.authorName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
  const colors = [
    "bg-yellow-100 text-yellow-800",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
  ]
  const color = colors[t.authorName.charCodeAt(0) % colors.length]
  return (
    <div className={cn("w-9 h-9 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 shadow-sm", color)}>
      {initials}
    </div>
  )
}

function TestimonialCard({
  t,
  selected,
  onSelect,
  onUpdate,
}: {
  t: T
  selected: boolean
  onSelect: (id: string, checked: boolean) => void
  onUpdate: (id: string, patch: Partial<T>) => void
}) {
  const [loading, setLoading] = useState<string | null>(null)

  async function updateStatus(status: string) {
    setLoading(status)
    const res = await fetch(`/api/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      toast.success(`Moved to ${status.toLowerCase()}`)
      onUpdate(t.id, { status: status as T["status"] })
    } else {
      toast.error("Failed to update")
    }
    setLoading(null)
  }

  async function saveTags(tags: string[]) {
    const res = await fetch(`/api/testimonials/${t.id}/tags`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    })
    if (res.ok) {
      onUpdate(t.id, { tags })
      toast.success("Tags updated")
    } else {
      toast.error("Failed to save tags")
    }
  }

  const customValues = t.customFieldValues as Record<string, string> | null
  const isVideo = (t as T & { type?: string }).type === "VIDEO"
  const videoUrl = (t as T & { videoUrl?: string | null }).videoUrl

  return (
    <div className={cn(
      "group rounded-2xl border bg-white dark:bg-zinc-900 transition-all duration-200",
      selected
        ? "border-primary/40 shadow-[0_0_0_3px_rgba(234,179,8,0.1)]"
        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm"
    )}>
      {/* Card header */}
      <div className="px-5 pt-4 pb-3.5 flex items-start gap-3">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(t.id, !!checked)}
          className="mt-1 shrink-0"
        />
        <AuthorAvatar t={t} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {t.authorName}
                </span>
                {t.role && (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                    {t.role}
                  </span>
                )}
                {isVideo && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground dark:text-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                    <Play className="w-2.5 h-2.5 fill-current" /> VIDEO
                  </span>
                )}
              </div>
              <StarRating rating={t.rating} />
            </div>
            <time className="text-[11px] text-zinc-400 tabular-nums shrink-0 mt-0.5">
              {new Date(t.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </time>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-zinc-100 dark:border-zinc-800" />

      {/* Body */}
      <div className="px-5 py-4 space-y-3.5">
        {t.text && (
          <div className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-primary to-primary/30" />
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
              &ldquo;{t.text}&rdquo;
            </p>
          </div>
        )}

        {videoUrl && (
          <video
            controls
            className="w-full rounded-xl max-h-48 object-cover border border-zinc-100 dark:border-zinc-800"
            src={videoUrl}
          />
        )}

        {customValues && Object.keys(customValues).length > 0 && (
          <details className="group/details">
            <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1.5 select-none list-none">
              <ChevronDown className="w-3 h-3 transition-transform group-open/details:rotate-180" />
              Custom responses
            </summary>
            <div className="mt-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 p-3 space-y-1.5">
              {Object.entries(customValues).map(([key, val]) => (
                <div key={key} className="flex gap-2 text-xs">
                  <span className="text-zinc-400 font-medium shrink-0">{key}:</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{val}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        <TagEditor tags={t.tags ?? []} onSave={saveTags} />
      </div>

      {/* Footer actions */}
      <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
        {t.status !== "APPROVED" && (
          <Button
            size="sm"
            className="h-7 px-3 text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 rounded-lg shadow-none"
            onClick={() => updateStatus("APPROVED")}
            disabled={!!loading}
          >
            {loading === "APPROVED"
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <><Check className="w-3 h-3" /> Approve</>
            }
          </Button>
        )}
        {t.status !== "REJECTED" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs font-medium border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 dark:border-red-900/40 dark:text-red-400 gap-1.5 rounded-lg shadow-none"
            onClick={() => updateStatus("REJECTED")}
            disabled={!!loading}
          >
            {loading === "REJECTED"
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <><X className="w-3 h-3" /> Reject</>
            }
          </Button>
        )}
        {t.status !== "PENDING" && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-3 text-xs font-medium text-zinc-400 hover:text-zinc-600 gap-1.5 rounded-lg"
            onClick={() => updateStatus("PENDING")}
            disabled={!!loading}
          >
            {loading === "PENDING"
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <><Clock className="w-3 h-3" /> Move to pending</>
            }
          </Button>
        )}
      </div>
    </div>
  )
}

function EmptyState({ tab }: { tab: "pending" | "approved" | "rejected" }) {
  const states = {
    pending: {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "No testimonials waiting",
      desc: "Share your collection link and they'll show up here ready to review.",
      color: "text-primary bg-primary/10 dark:bg-primary/15",
    },
    approved: {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Nothing approved yet",
      desc: "Head over to Pending and approve the ones you love.",
      color: "text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
    },
    rejected: {
      icon: <PartyPopper className="w-6 h-6" />,
      title: "Zero rejections",
      desc: "Nothing in the reject pile — that's a great sign!",
      color: "text-blue-400 bg-blue-50 dark:bg-blue-950/30",
    },
  }
  const { icon, title, desc, color } = states[tab]
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 py-16 text-center space-y-3">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mx-auto", color)}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{title}</p>
        <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

export default function TestimonialTabs({
  pending: initialPending,
  approved: initialApproved,
  rejected: initialRejected,
}: {
  pending: T[]
  approved: T[]
  rejected: T[]
}) {
  const [items, setItems] = useState<T[]>([...initialPending, ...initialApproved, ...initialRejected])
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("approved")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState("0")
  const [dateFilter, setDateFilter] = useState<"all" | "7d" | "30d">("all")
  const [tagFilter, setTagFilter] = useState("")

  function handleUpdate(id: string, patch: Partial<T>) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n })
  }

  function handleSelect(id: string, checked: boolean) {
    setSelectedIds((prev) => { const n = new Set(prev); checked ? n.add(id) : n.delete(id); return n })
  }

  async function bulkAction(status: string) {
    const ids = [...selectedIds]
    setBulkLoading(true)
    const res = await fetch("/api/testimonials/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, status }),
    })
    if (res.ok) {
      toast.success(`${ids.length} moved to ${status.toLowerCase()}`)
      setItems((prev) => prev.map((t) => (selectedIds.has(t.id) ? { ...t, status: status as T["status"] } : t)))
      setSelectedIds(new Set())
    } else {
      toast.error("Bulk action failed")
    }
    setBulkLoading(false)
  }

  function byStatus(status: string) {
    return items.filter((t) => {
      if (t.status !== status) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !t.authorName.toLowerCase().includes(q) &&
          !t.text.toLowerCase().includes(q) &&
          !(t.role ?? "").toLowerCase().includes(q)
        ) return false
      }
      const ratingNum = Number(ratingFilter)
      if (ratingNum > 0 && (t.rating ?? 0) < ratingNum) return false
      if (dateFilter !== "all") {
        const days = dateFilter === "7d" ? 7 : 30
        if (new Date(t.createdAt).getTime() < Date.now() - days * 24 * 60 * 60 * 1000) return false
      }
      if (tagFilter && !(t.tags ?? []).includes(tagFilter)) return false
      return true
    })
  }

  const pending = byStatus("PENDING")
  const approved = byStatus("APPROVED")
  const rejected = byStatus("REJECTED")
  const currentList = activeTab === "pending" ? pending : activeTab === "approved" ? approved : rejected
  const allTags = [...new Set(items.flatMap((t) => t.tags ?? []))]
  const allCurrentSelected = currentList.length > 0 && currentList.every((t) => selectedIds.has(t.id))

  function toggleSelectAll() {
    if (allCurrentSelected) {
      setSelectedIds((prev) => { const n = new Set(prev); currentList.forEach((t) => n.delete(t.id)); return n })
    } else {
      setSelectedIds((prev) => { const n = new Set(prev); currentList.forEach((t) => n.add(t.id)); return n })
    }
  }

  const tabConfig = [
    { key: "pending" as const, label: "Pending", count: pending.length, activeColor: "bg-primary text-primary-foreground" },
    { key: "approved" as const, label: "Approved", count: approved.length, activeColor: "bg-emerald-500 text-white" },
    { key: "rejected" as const, label: "Rejected", count: rejected.length, activeColor: "bg-zinc-500 text-white" },
  ]

  return (
    <div className="space-y-5">
      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          <Input
            className="pl-9 h-9 bg-white dark:bg-zinc-900 text-sm"
            placeholder="Search by name, text, role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm bg-white dark:bg-zinc-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All ratings</SelectItem>
            <SelectItem value="5">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                ))}
                <span className="ml-1.5 text-xs text-zinc-500">only</span>
              </span>
            </SelectItem>
            <SelectItem value="4">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-3 h-3", i < 4 ? "fill-primary text-primary" : "text-zinc-200 dark:text-zinc-600")} />
                ))}
                <span className="ml-1.5 text-xs text-zinc-500">& up</span>
              </span>
            </SelectItem>
            <SelectItem value="3">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-3 h-3", i < 3 ? "fill-primary text-primary" : "text-zinc-200 dark:text-zinc-600")} />
                ))}
                <span className="ml-1.5 text-xs text-zinc-500">& up</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as "all" | "7d" | "30d")}>
          <SelectTrigger className="w-[130px] h-9 text-sm bg-white dark:bg-zinc-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>

        {allTags.length > 0 && (
          <Select value={tagFilter || "_all"} onValueChange={(v) => setTagFilter(v === "_all" ? "" : v)}>
            <SelectTrigger className="w-[120px] h-9 text-sm bg-white dark:bg-zinc-900">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Tab row + select all */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
          {tabConfig.map(({ key, label, count, activeColor }) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                  isActive
                    ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
                onClick={() => { setActiveTab(key); setSelectedIds(new Set()) }}
              >
                {label}
                {count > 0 && (
                  <span className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold transition-all",
                    isActive ? activeColor : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {currentList.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={allCurrentSelected}
              onCheckedChange={toggleSelectAll}
            />
            <label htmlFor="select-all" className="text-xs text-zinc-500 cursor-pointer select-none hover:text-zinc-700 transition-colors">
              {allCurrentSelected ? "Deselect all" : "Select all"}
              {selectedIds.size > 0 && (
                <span className="ml-1.5 text-zinc-400">({selectedIds.size} selected)</span>
              )}
            </label>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          currentList.map((t) => (
            <TestimonialCard
              key={t.id}
              t={t}
              selected={selectedIds.has(t.id)}
              onSelect={handleSelect}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-zinc-900 dark:bg-zinc-950 text-white rounded-2xl shadow-2xl shadow-black/30 px-5 py-3 flex items-center gap-4 border border-white/10">
            <span className="text-sm font-semibold tabular-nums">
              {selectedIds.size} selected
            </span>
            <div className="w-px h-4 bg-white/15" />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 rounded-lg h-8 text-xs font-semibold"
                onClick={() => bulkAction("APPROVED")}
                disabled={bulkLoading}
              >
                {bulkLoading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <><Check className="w-3.5 h-3.5" /> Approve all</>
                }
              </Button>
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white gap-1.5 rounded-lg h-8 text-xs font-semibold"
                onClick={() => bulkAction("REJECTED")}
                disabled={bulkLoading}
              >
                <X className="w-3.5 h-3.5" /> Reject all
              </Button>
              <button
                className="text-xs text-white/40 hover:text-white/70 transition-colors px-1"
                onClick={() => setSelectedIds(new Set())}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
