"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

type CustomField = { id: string; label: string; placeholder: string; required: boolean }

type ProjectSettings = {
  logoUrl: string | null
  brandColor: string | null
  headline: string | null
  description: string | null
  customFields: CustomField[] | null
}

export default function ProjectSettings({
  projectId,
  initial,
}: {
  projectId: string
  initial: ProjectSettings
}) {
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl ?? "")
  const [brandColor, setBrandColor] = useState(initial.brandColor ?? "#f5a623")
  const [headline, setHeadline] = useState(initial.headline ?? "")
  const [description, setDescription] = useState(initial.description ?? "")
  const [customFields, setCustomFields] = useState<CustomField[]>(initial.customFields ?? [])
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoUrl: logoUrl || null, brandColor, headline: headline || null, description: description || null, customFields }),
    })
    if (res.ok) {
      toast.success("Settings saved")
    } else {
      toast.error("Failed to save settings")
    }
    setSaving(false)
  }

  function addField() {
    if (customFields.length >= 3) return
    setCustomFields([...customFields, { id: crypto.randomUUID(), label: "", placeholder: "", required: false }])
  }

  function updateField(id: string, patch: Partial<CustomField>) {
    setCustomFields(customFields.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  function removeField(id: string) {
    setCustomFields(customFields.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Branding */}
      <div className="rounded-xl border border-border p-6 space-y-5">
        <div>
          <h3 className="text-sm font-semibold">Collection page branding</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Customize how your collection form looks to respondents</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground block">Logo URL</label>
            <Input
              type="url"
              placeholder="https://example.com/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground block">Brand colour</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="w-8 h-8 rounded-md border border-border cursor-pointer p-0.5 bg-transparent"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
              />
              <Input
                type="text"
                className="flex-1"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                placeholder="#f5a623"
              />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground block">Headline</label>
            <Input
              type="text"
              placeholder="Share your experience with us"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground block">Description</label>
            <textarea
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
              placeholder="Tell us what you think — it only takes 2 minutes"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Preview */}
        {(logoUrl || headline) && (
          <div className="rounded-lg border p-4 text-center space-y-2 mt-4" style={{ backgroundColor: brandColor + "22", borderColor: brandColor + "44" }}>
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="logo preview" className="h-10 object-contain mx-auto" />
            )}
            {headline && <p className="font-semibold text-sm">{headline}</p>}
            <p className="text-xs text-muted-foreground">Collection page preview</p>
          </div>
        )}
      </div>

      {/* Custom questions */}
      <div className="rounded-xl border border-border p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Custom questions</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Up to 3 extra fields on the collection form</p>
          </div>
          {customFields.length < 3 && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={addField}>
              <Plus className="w-3.5 h-3.5" /> Add field
            </Button>
          )}
        </div>

        {customFields.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No custom fields yet</p>
        ) : (
          <div className="space-y-3">
            {customFields.map((field, i) => (
              <div key={field.id} className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Field {i + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive h-auto py-0.5 px-2 text-xs"
                    onClick={() => removeField(field.id)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Label (e.g. What's your role?)"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                  />
                  <Input
                    placeholder="Placeholder text"
                    value={field.placeholder}
                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`required-${field.id}`}
                    checked={field.required}
                    onCheckedChange={(checked) => updateField(field.id, { required: !!checked })}
                  />
                  <label htmlFor={`required-${field.id}`} className="text-xs cursor-pointer select-none">Required</label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        className="bg-yellow-500 hover:bg-yellow-600 text-white"
        onClick={save}
        disabled={saving}
      >
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
        Save settings
      </Button>
    </div>
  )
}
