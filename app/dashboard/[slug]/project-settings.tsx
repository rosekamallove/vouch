"use client"

import { useState } from "react"
import { toast } from "sonner"

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
      <div className="card bg-base-200 border border-base-300">
        <div className="card-body">
          <h3 className="font-semibold text-sm mb-3">Collection page branding</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text text-xs">Logo URL</span></label>
              <input
                type="url"
                className="input input-bordered input-sm w-full"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-xs">Brand colour</span></label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-9 h-9 rounded cursor-pointer border border-base-300"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                />
                <input
                  type="text"
                  className="input input-bordered input-sm flex-1"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  placeholder="#f5a623"
                />
              </div>
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label"><span className="label-text text-xs">Headline</span></label>
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                placeholder="Share your experience with us"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label"><span className="label-text text-xs">Description</span></label>
              <textarea
                className="textarea textarea-bordered textarea-sm w-full"
                placeholder="Tell us what you think — it only takes 2 minutes"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Preview */}
          {(logoUrl || headline) && (
            <div className="mt-4 rounded-xl p-4 text-center space-y-2 border" style={{ backgroundColor: brandColor + "22", borderColor: brandColor + "44" }}>
              {logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="logo preview" className="h-10 object-contain mx-auto" />
              )}
              {headline && <p className="font-bold text-sm">{headline}</p>}
              <p className="text-xs text-base-content/50">Collection page preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom questions */}
      <div className="card bg-base-200 border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm">Custom questions</h3>
              <p className="text-xs text-base-content/50 mt-0.5">Up to 3 extra fields on the collection form</p>
            </div>
            {customFields.length < 3 && (
              <button className="btn btn-ghost btn-xs" onClick={addField}>+ Add field</button>
            )}
          </div>

          {customFields.length === 0 ? (
            <p className="text-xs text-base-content/40 italic">No custom fields yet</p>
          ) : (
            <div className="space-y-3">
              {customFields.map((field, i) => (
                <div key={field.id} className="border border-base-300 rounded-lg p-3 space-y-2 bg-base-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-base-content/60">Field {i + 1}</span>
                    <button className="btn btn-ghost btn-xs text-error" onClick={() => removeField(field.id)}>Remove</button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      className="input input-bordered input-xs w-full"
                      placeholder="Label (e.g. What's your role?)"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                    />
                    <input
                      type="text"
                      className="input input-bordered input-xs w-full"
                      placeholder="Placeholder text"
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    <span className="text-xs">Required</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
        {saving ? <span className="loading loading-spinner loading-xs" /> : "Save settings"}
      </button>
    </div>
  )
}
