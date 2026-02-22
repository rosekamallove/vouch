"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Testimonial } from "@prisma/client"
import Image from "next/image"

type T = Testimonial

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <span className="text-sm leading-none">
      <span className="text-primary">{"★".repeat(rating)}</span>
      <span className="text-muted-foreground/25">{"★".repeat(5 - rating)}</span>
    </span>
  )
}

function TestimonialCard({ t, onUpdate }: { t: T; onUpdate: (id: string, status: string) => void }) {
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
      onUpdate(t.id, status)
    } else {
      toast.error("Failed to update")
    }
    setLoading(null)
  }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4 hover:border-border/80 hover:shadow-sm transition-all animate-slide-up">
      <div className="flex items-start gap-3">
        {t.avatarUrl ? (
          <Image
            src={t.avatarUrl}
            alt={t.authorName}
            width={44}
            height={44}
            className="rounded-full object-cover w-11 h-11 shrink-0 ring-2 ring-background border"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-base font-semibold shrink-0 text-primary">
            {t.authorName[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{t.authorName}</span>
            {t.role && (
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                {t.role}
              </span>
            )}
          </div>
          {t.rating && <StarRating rating={t.rating} />}
        </div>
        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {new Date(t.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-foreground/80 border-l-2 border-primary/30 pl-3 italic">
        &ldquo;{t.text}&rdquo;
      </p>

      <div className="flex items-center gap-2">
        {t.status !== "APPROVED" && (
          <Button size="sm" onClick={() => updateStatus("APPROVED")} disabled={loading === "APPROVED"} className="h-7 text-xs">
            {loading === "APPROVED" ? "Approving…" : "✓ Approve"}
          </Button>
        )}
        {t.status !== "REJECTED" && (
          <Button size="sm" variant="outline" className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/5" onClick={() => updateStatus("REJECTED")} disabled={loading === "REJECTED"}>
            {loading === "REJECTED" ? "Rejecting…" : "✕ Reject"}
          </Button>
        )}
        {t.status !== "PENDING" && (
          <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={() => updateStatus("PENDING")} disabled={loading === "PENDING"}>
            Move to pending
          </Button>
        )}
      </div>
    </div>
  )
}

function EmptyState({ tab }: { tab: "pending" | "approved" | "rejected" }) {
  const states = {
    pending: {
      emoji: "📬",
      title: "No testimonials waiting",
      desc: "Share your collection link and they'll show up here ready to review.",
    },
    approved: {
      emoji: "🌟",
      title: "Nothing approved yet",
      desc: "Head over to Pending and approve the ones you love — they'll appear here.",
    },
    rejected: {
      emoji: "🎉",
      title: "Zero rejections",
      desc: "Nothing in the reject pile. That's a great sign!",
    },
  }
  const { emoji, title, desc } = states[tab]

  return (
    <div className="rounded-xl border border-dashed py-16 text-center space-y-3 animate-fade-in">
      <div className="text-4xl">{emoji}</div>
      <div className="space-y-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">{desc}</p>
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

  function handleUpdate(id: string, status: string) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status: status as T["status"] } : t)))
  }

  const pending = items.filter((t) => t.status === "PENDING")
  const approved = items.filter((t) => t.status === "APPROVED")
  const rejected = items.filter((t) => t.status === "REJECTED")

  return (
    <Tabs defaultValue="pending">
      <TabsList className="h-9 rounded-lg">
        <TabsTrigger value="pending" className="text-sm gap-1.5 rounded-md">
          Pending
          {pending.length > 0 && (
            <Badge className="h-5 px-1.5 text-xs rounded-full bg-primary text-primary-foreground">
              {pending.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="approved" className="text-sm gap-1.5 rounded-md">
          Approved
          {approved.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs rounded-full">
              {approved.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="rejected" className="text-sm gap-1.5 rounded-md">
          Rejected
          {rejected.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs rounded-full">
              {rejected.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-3 mt-4">
        {pending.length === 0 ? <EmptyState tab="pending" /> : pending.map((t) => <TestimonialCard key={t.id} t={t} onUpdate={handleUpdate} />)}
      </TabsContent>
      <TabsContent value="approved" className="space-y-3 mt-4">
        {approved.length === 0 ? <EmptyState tab="approved" /> : approved.map((t) => <TestimonialCard key={t.id} t={t} onUpdate={handleUpdate} />)}
      </TabsContent>
      <TabsContent value="rejected" className="space-y-3 mt-4">
        {rejected.length === 0 ? <EmptyState tab="rejected" /> : rejected.map((t) => <TestimonialCard key={t.id} t={t} onUpdate={handleUpdate} />)}
      </TabsContent>
    </Tabs>
  )
}
