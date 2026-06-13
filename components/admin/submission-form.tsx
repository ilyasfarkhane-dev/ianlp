'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FileText, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { updateSubmissionSettings } from '@/app/admin/(dashboard)/submission/actions'
import { FormLoadingOverlay } from '@/components/ui/form-loading-overlay'
import { LoadingButton } from '@/components/ui/loading-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { SubmissionLocaleContent } from '@/lib/submission-settings'

type SubmissionFormProps = {
  initial: SubmissionLocaleContent
}

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {children}
    </div>
  )
}

function FieldGroup({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

function StringListEditor({
  idPrefix,
  label,
  items,
  onChange,
}: {
  idPrefix: string
  label: string
  items: string[]
  onChange: (items: string[]) => void
}) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }

  function addItem() {
    onChange([...items, ''])
  }

  function removeItem(index: number) {
    if (items.length === 1) {
      onChange([''])
      return
    }
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${idPrefix}-${index}`} className="flex gap-2">
            <Input
              id={`${idPrefix}-${index}`}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(index)}
              aria-label={`Remove ${label} item ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={addItem}
      >
        <Plus className="h-4 w-4" />
        Add item
      </Button>
    </div>
  )
}

function SubmissionFields({
  content,
  onChange,
}: {
  content: SubmissionLocaleContent
  onChange: (next: SubmissionLocaleContent) => void
}) {
  function updateField<K extends keyof SubmissionLocaleContent>(key: K, value: SubmissionLocaleContent[K]) {
    onChange({ ...content, [key]: value })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Section header</CardTitle>
          <CardDescription>Title and intro shown at the top of the submission section.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <FieldGroup label="Label" htmlFor="submission-label">
            <Input
              id="submission-label"
              value={content.label}
              onChange={(e) => updateField('label', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Title" htmlFor="submission-title">
            <Input
              id="submission-title"
              value={content.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Subtitle" htmlFor="submission-subtitle">
            <Textarea
              id="submission-subtitle"
              value={content.subtitle}
              onChange={(e) => updateField('subtitle', e.target.value)}
              rows={2}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submission platform</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup label="Card title" htmlFor="submission-platform">
              <Input
                id="submission-platform"
                value={content.platform}
                onChange={(e) => updateField('platform', e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Badge label" htmlFor="submission-platformDesc">
              <Input
                id="submission-platformDesc"
                value={content.platformDesc}
                onChange={(e) => updateField('platformDesc', e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Link URL" htmlFor="submission-platformUrl">
              <Input
                id="submission-platformUrl"
                type="url"
                value={content.platformUrl}
                onChange={(e) => updateField('platformUrl', e.target.value)}
                placeholder="https://easychair.org/conferences/?conf=ianlp2026"
              />
            </FieldGroup>
            <StringListEditor
              idPrefix="submission-platform"
              label="Bullet points"
              items={content.platformItems}
              onChange={(items) => updateField('platformItems', items)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Paper format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup label="Card title" htmlFor="submission-format">
              <Input
                id="submission-format"
                value={content.format}
                onChange={(e) => updateField('format', e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Badge label" htmlFor="submission-formatDesc">
              <Input
                id="submission-formatDesc"
                value={content.formatDesc}
                onChange={(e) => updateField('formatDesc', e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Link URL" htmlFor="submission-formatUrl">
              <Input
                id="submission-formatUrl"
                type="url"
                value={content.formatUrl}
                onChange={(e) => updateField('formatUrl', e.target.value)}
                placeholder="https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines"
              />
            </FieldGroup>
            <StringListEditor
              idPrefix="submission-format"
              label="Bullet points"
              items={content.formatItems}
              onChange={(items) => updateField('formatItems', items)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup label="Card title" htmlFor="submission-keyReqs">
              <Input
                id="submission-keyReqs"
                value={content.keyReqs}
                onChange={(e) => updateField('keyReqs', e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label="Badge label" htmlFor="submission-keyReqsDesc">
              <Input
                id="submission-keyReqsDesc"
                value={content.keyReqsDesc}
                onChange={(e) => updateField('keyReqsDesc', e.target.value)}
              />
            </FieldGroup>
            <StringListEditor
              idPrefix="submission-keyReqs"
              label="Bullet points"
              items={content.keyReqsItems}
              onChange={(items) => updateField('keyReqsItems', items)}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quality & ethics</CardTitle>
          <CardDescription>Sidebar title and the two ethics cards below the main row.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup label="Sidebar title" htmlFor="submission-qualityEthics">
            <Input
              id="submission-qualityEthics"
              value={content.qualityEthics}
              onChange={(e) => updateField('qualityEthics', e.target.value)}
            />
          </FieldGroup>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-border p-4">
              <FieldGroup label="Evaluation criteria title" htmlFor="submission-evaluationCriteria">
                <Input
                  id="submission-evaluationCriteria"
                  value={content.evaluationCriteria}
                  onChange={(e) => updateField('evaluationCriteria', e.target.value)}
                />
              </FieldGroup>
              <StringListEditor
                idPrefix="submission-evaluation"
                label="Evaluation items"
                items={content.evaluationItems}
                onChange={(items) => updateField('evaluationItems', items)}
              />
            </div>

            <div className="space-y-4 rounded-lg border border-border p-4">
              <FieldGroup label="Plagiarism & integrity title" htmlFor="submission-plagiarism">
                <Input
                  id="submission-plagiarism"
                  value={content.plagiarism}
                  onChange={(e) => updateField('plagiarism', e.target.value)}
                />
              </FieldGroup>
              <StringListEditor
                idPrefix="submission-plagiarism"
                label="Integrity items"
                items={content.plagiarismItems}
                onChange={(items) => updateField('plagiarismItems', items)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SubmissionForm({ initial }: SubmissionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initial)

  useEffect(() => {
    setForm(initial)
  }, [initial])

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial])

  function handleReset() {
    setForm(initial)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await updateSubmissionSettings(form)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Submission guidelines updated')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6" aria-busy={loading}>
      <FormLoadingOverlay loading={loading} label="Saving submission guidelines…" />

      <Card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <SectionIcon>
            <FileText className="h-5 w-5" aria-hidden />
          </SectionIcon>
          <div>
            <CardTitle>Homepage submission section</CardTitle>
            <CardDescription>
              Content for the Submission Guidelines block on the conference homepage. Platform and
              format card titles link to the URLs below.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <SubmissionFields content={form} onChange={setForm} />

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:-mx-6 md:px-6">
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading || !isDirty}
            className="cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Saving…"
            disabled={!isDirty}
            className="cursor-pointer"
          >
            Save changes
          </LoadingButton>
        </div>
      </div>
    </form>
  )
}
