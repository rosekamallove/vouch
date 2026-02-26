"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { Testimonial } from "@prisma/client"
import Image from "next/image"

type T = Testimonial

const SUGGESTED_TAGS = ["pricing", "onboarding", "speed", "support", "design", "value", "reliability", "ux"]

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <span className="text-sm leading-none">
      <span className="text-warning">{"★".repeat(rating)}</span>
      <span className="text-base-content/20">{"★".repeat(5 - rating)}</span>
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
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span key={tag} className="badge badge-outline badge-sm gap-1">
            {tag}
            <button onClick={() => onSave(tags.filter((t) => t !== tag))} className="text-base-content/40 hover:text-error leading-none">&times;</button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          className="input input-bordered input-xs w-full"
          placeholder="Add tag…"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(input) } }}
        />
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute z-10 top-full mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg overflow-hidden">
            {filtered.slice(0, 6).map((tag) => (
              <button key={tag} className="w-full text-left px-3 py-1.5 text-xs hover:bg-base-200" onMouseDown={() => addTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
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

  return (
    <div className={`card bg-base-200 border transition-all animate-slide-up ${selected ? "border-primary/60 bg-primary/5" : "border-base-300 hover:border-base-content/20 hover:shadow-sm"}`}>
      <div className="card-body py-4 space-y-3">
        <div className="flex items-start gap-3">
          <input type="checkbox" className="checkbox checkbox-sm checkbox-primary mt-0.5 shrink-0" checked={selected} onChange={(e) => onSelect(t.id, e.target.checked)} />
          {t.avatarUrl ? (
            <Image src={t.avatarUrl} alt={t.authorName} width={44} height={44} className="rounded-full object-cover w-11 h-11 shrink-0 ring-2 ring-base-100 border border-base-300" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-base font-semibold shrink-0 text-primary">
              {t.authorName[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{t.authorName}</span>
              {t.role && <span className="badge badge-ghost badge-sm">{t.role}</span>}
              {(t as T & { type?: string }).type === "VIDEO" && (
                <span className="badge badge-warning badge-sm">▶ Video</span>
              )}
            </div>
            <StarRating rating={t.rating} />
          </div>
          <span className="text-xs text-base-content/40 shrink-0 tabular-nums">
            {new Date(t.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        </div>

        {t.text && (
          <p className="text-sm leading-relaxed text-base-content/70 border-l-2 border-primary/30 pl-3 italic">
            &ldquo;{t.text}&rdquo;
          </p>
        )}

        {(t as T & { videoUrl?: string | null }).videoUrl && (
          <video controls className="w-full rounded-lg max-h-48 object-cover" src={(t as T & { videoUrl?: string | null }).videoUrl!} />
        )}

        {customValues && Object.keys(customValues).length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer text-base-content/50 hover:text-base-content">Custom responses</summary>
            <div className="mt-2 space-y-1 pl-2">
              {Object.entries(customValues).map(([key, val]) => (
                <div key={key} className="flex gap-2">
                  <span className="text-base-content/50 font-medium">{key}:</span>
                  <span className="text-base-content/80">{val}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        <TagEditor tags={t.tags ?? []} onSave={saveTags} />

        <div className="flex items-center gap-2 flex-wrap">
          {t.status !== "APPROVED" && (
            <button className="btn btn-primary btn-xs" onClick={() => updateStatus("APPROVED")} disabled={loading === "APPROVED"}>
              {loading === "APPROVED" ? <span className="loading loading-spinner loading-xs" /> : "✓ Approve"}
            </button>
          )}
          {t.status !== "REJECTED" && (
            <button className="btn btn-outline btn-xs text-error border-error/30 hover:btn-error" onClick={() => updateStatus("REJECTED")} disabled={loading === "REJECTED"}>
              {loading === "REJECTED" ? <span className="loading loading-spinner loading-xs" /> : "✕ Reject"}
            </button>
          )}
          {t.status !== "PENDING" && (
            <button className="btn btn-ghost btn-xs text-base-content/50" onClick={() => updateStatus("PENDING")} disabled={loading === "PENDING"}>
              Move to pending
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ tab }: { tab: "pending" | "approved" | "rejected" }) {
  const states = {
    pending: { emoji: "📬", title: "No testimonials waiting", desc: "Share your collection link and they'll show up here ready to review." },
    approved: { emoji: "🌟", title: "Nothing approved yet", desc: "Head over to Pending and approve the ones you love." },
    rejected: { emoji: "🎉", title: "Zero rejections", desc: "Nothing in the reject pile. That's a great sign!" },
  }
  const { emoji, title, desc } = states[tab]
  return (
    <div className="border border-dashed border-base-300 rounded-xl py-16 text-center space-y-3 animate-fade-in">
      <div className="text-4xl">{emoji}</div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-base-content/50 max-w-xs mx-auto">{desc}</p>
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
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState(0)
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
        if (!t.authorName.toLowerCase().includes(q) && !t.text.toLowerCase().includes(q) && !(t.role ?? "").toLowerCase().includes(q)) return false
      }
      if (ratingFilter > 0 && (t.rating ?? 0) < ratingFilter) return false
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

  return (
    <div className="space-y-4">
      {/* Search + filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-48">
          <input type="text" className="input input-bordered input-sm w-full" placeholder="Search testimonials…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select select-bordered select-sm" value={ratingFilter} onChange={(e) => setRatingFilter(Number(e.target.value))}>
          <option value={0}>All ratings</option>
          <option value={5}>5★ only</option>
          <option value={4}>4★ +</option>
          <option value={3}>3★ +</option>
        </select>
        <select className="select select-bordered select-sm" value={dateFilter} onChange={(e) => setDateFilter(e.target.value as "all" | "7d" | "30d")}>
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
        {allTags.length > 0 && (
          <select className="select select-bordered select-sm" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            <option value="">All tags</option>
            {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        )}
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed">
        {(["pending", "approved", "rejected"] as const).map((tab) => {
          const count = tab === "pending" ? pending.length : tab === "approved" ? approved.length : rejected.length
          return (
            <button key={tab} role="tab" className={`tab gap-2 ${activeTab === tab ? "tab-active" : ""}`} onClick={() => { setActiveTab(tab); setSelectedIds(new Set()) }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {count > 0 && <span className={`badge badge-sm ${tab === "pending" ? "badge-warning" : "badge-ghost"}`}>{count}</span>}
            </button>
          )
        })}
      </div>

      {/* Select all */}
      {currentList.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={allCurrentSelected} onChange={toggleSelectAll} />
            <span className="text-xs text-base-content/60">{allCurrentSelected ? "Deselect all" : "Select all"}</span>
          </label>
          {selectedIds.size > 0 && <span className="text-xs text-base-content/50">{selectedIds.size} selected</span>}
        </div>
      )}

      <div className="space-y-3">
        {currentList.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          currentList.map((t) => <TestimonialCard key={t.id} t={t} selected={selectedIds.has(t.id)} onSelect={handleSelect} onUpdate={handleUpdate} />)
        )}
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="alert shadow-xl bg-base-100 border border-base-300 flex flex-wrap gap-3 px-5 py-3">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => bulkAction("APPROVED")} disabled={bulkLoading}>
                {bulkLoading ? <span className="loading loading-spinner loading-xs" /> : "✓ Approve all"}
              </button>
              <button className="btn btn-outline btn-error btn-sm" onClick={() => bulkAction("REJECTED")} disabled={bulkLoading}>
                ✕ Reject all
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedIds(new Set())}>Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
