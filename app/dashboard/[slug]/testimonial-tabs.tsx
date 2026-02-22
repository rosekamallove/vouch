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
    <span className="text-amber-400 text-sm leading-none">
      {"★".repeat(rating)}
      <span className="text-muted-foreground/30">{"★".repeat(5 - rating)}</span>
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
    <div className="rounded-lg border bg-card p-4 space-y-4 hover:border-foreground/20 transition-colors">
      {/* Author row */}
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
          <div className="w-11 h-11 rounded-full bg-muted border flex items-center justify-center text-base font-semibold shrink-0 text-muted-foreground">
            {t.authorName[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{t.authorName}</span>
            {t.role && (
              <span className="text-xs text-muted-foreground border rounded-full px-2 py-0.5">
                {t.role}
              </span>
            )}
          </div>
          {t.rating && <StarRating rating={t.rating} />}
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {new Date(t.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>

      {/* Testimonial text */}
      <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-muted pl-3">
        {t.text}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        {t.status !== "APPROVED" && (
          <Button size="sm" onClick={() => updateStatus("APPROVED")} disabled={loading === "APPROVED"}>
            {loading === "APPROVED" ? "Approving…" : "Approve"}
          </Button>
        )}
        {t.status !== "REJECTED" && (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/5"
            onClick={() => updateStatus("REJECTED")}
            disabled={loading === "REJECTED"}
          >
            {loading === "REJECTED" ? "Rejecting…" : "Reject"}
          </Button>
        )}
        {t.status !== "PENDING" && (
          <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => updateStatus("PENDING")} disabled={loading === "PENDING"}>
            Move to pending
          </Button>
        )}
      </div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed py-16 text-center">
      <p className="text-sm text-muted-foreground">No {label} testimonials yet</p>
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
      <TabsList className="h-9">
        <TabsTrigger value="pending" className="text-sm gap-1.5">
          Pending
          {pending.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs rounded-full">
              {pending.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="approved" className="text-sm gap-1.5">
          Approved
          {approved.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs rounded-full">
              {approved.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="rejected" className="text-sm gap-1.5">
          Rejected
          {rejected.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs rounded-full">
              {rejected.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-3 mt-4">
        {pending.length === 0 ? <EmptyState label="pending" /> : pending.map((t) => <TestimonialCard key={t.id} t={t} onUpdate={handleUpdate} />)}
      </TabsContent>

      <TabsContent value="approved" className="space-y-3 mt-4">
        {approved.length === 0 ? <EmptyState label="approved" /> : approved.map((t) => <TestimonialCard key={t.id} t={t} onUpdate={handleUpdate} />)}
      </TabsContent>

      <TabsContent value="rejected" className="space-y-3 mt-4">
        {rejected.length === 0 ? <EmptyState label="rejected" /> : rejected.map((t) => <TestimonialCard key={t.id} t={t} onUpdate={handleUpdate} />)}
      </TabsContent>
    </Tabs>
  )
}
