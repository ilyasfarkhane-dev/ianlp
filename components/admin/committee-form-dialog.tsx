'use client'

import { useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormLoadingOverlay } from '@/components/ui/form-loading-overlay'
import { LoadingButton } from '@/components/ui/loading-button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createCommitteeMember,
  updateCommitteeMember,
} from '@/app/admin/(dashboard)/committees/actions'
import { buildTranslationsForAllLocales } from '@/lib/admin/translations'
import {
  COMMITTEE_ICON_LABELS,
  COMMITTEE_ICONS,
  type CommitteeIcon,
  type CommitteeMemberWithTranslations,
  type CommitteeType,
} from '@/types/database'

function getMemberFields(member?: CommitteeMemberWithTranslations) {
  const translation =
    member?.committee_member_translations.find((t) => t.locale === 'en') ??
    member?.committee_member_translations[0]

  return {
    name: translation?.name ?? '',
    affiliation: translation?.affiliation ?? '',
    roleLabel: translation?.role_label ?? '',
  }
}

function parseCommitteeIcon(icon: string | null | undefined): CommitteeIcon {
  if (icon && COMMITTEE_ICONS.includes(icon as CommitteeIcon)) {
    return icon as CommitteeIcon
  }

  return 'user-round'
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

type CommitteeFormDialogProps = {
  member?: CommitteeMemberWithTranslations
  defaultSortOrder?: number
  defaultCommitteeType?: CommitteeType
  lockCommitteeType?: boolean
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommitteeFormDialog({
  member,
  defaultSortOrder = 0,
  defaultCommitteeType = 'pc_chair',
  lockCommitteeType = false,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: CommitteeFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [committeeType, setCommitteeType] = useState<CommitteeType>(
    member?.committee_type ?? defaultCommitteeType
  )
  const [icon, setIcon] = useState<CommitteeIcon>(parseCommitteeIcon(member?.icon))
  const [email, setEmail] = useState(member?.email ?? '')
  const [isPublished, setIsPublished] = useState(member?.is_published ?? true)
  const [name, setName] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [roleLabel, setRoleLabel] = useState('')

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const showEmail =
    committeeType === 'institution' || committeeType === 'pc_chair' || committeeType === 'organizing'

  function setOpen(nextOpen: boolean) {
    if (isControlled) {
      onOpenChange?.(nextOpen)
    } else {
      setInternalOpen(nextOpen)
    }
  }

  useEffect(() => {
    if (!open) return

    const fields = getMemberFields(member)
    setCommitteeType(member?.committee_type ?? defaultCommitteeType)
    setIcon(parseCommitteeIcon(member?.icon))
    setEmail(member?.email ?? '')
    setIsPublished(member?.is_published ?? true)
    setName(fields.name)
    setAffiliation(fields.affiliation)
    setRoleLabel(fields.roleLabel)
  }, [open, member, defaultCommitteeType])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    if (committeeType === 'institution' && !roleLabel.trim()) {
      toast.error('Role label is required for institution committee cards')
      return
    }

    const translations = buildTranslationsForAllLocales({
      name: name.trim(),
      affiliation: affiliation.trim(),
      role_label: roleLabel.trim(),
    })

    setLoading(true)

    const sharedPayload = {
      committee_type: committeeType,
      icon: committeeType === 'institution' ? icon : null,
      email: email.trim(),
      is_published: isPublished,
      translations,
    }

    const result = member
      ? await updateCommitteeMember(member.id, sharedPayload)
      : await createCommitteeMember({
          sort_order: defaultSortOrder,
          ...sharedPayload,
        })

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(member ? 'Member updated' : 'Member created')
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Add member
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <form onSubmit={handleSubmit} className="relative flex min-h-0 flex-1 flex-col" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving member…" />
          <DialogHeader className="shrink-0 border-b border-border px-6 pt-6 pb-4">
            <DialogTitle>{member ? 'Edit committee member' : 'Add committee member'}</DialogTitle>
            <DialogDescription>
              Set member type and visibility on the left, profile details on the right.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <FormSection title="Basics" description="How this member appears on the committees page.">
                {lockCommitteeType && !member ? (
                  <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground">Section</p>
                    <p className="text-sm font-medium text-foreground">
                      {committeeType === 'pc_chair'
                        ? 'Program Committee Chairs'
                        : committeeType === 'scientific'
                          ? 'Scientific Committee'
                          : committeeType === 'reviewer'
                            ? 'External Reviewers & Advisors'
                            : committeeType === 'institution'
                              ? 'Institution Committee'
                              : 'Organizing Committee'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-committee_type`}>Type</Label>
                    <Select
                      value={committeeType}
                      onValueChange={(value) => setCommitteeType(value as CommitteeType)}
                    >
                      <SelectTrigger id={`${formId}-committee_type`} className="cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pc_chair">Program chair</SelectItem>
                        <SelectItem value="scientific">Scientific committee</SelectItem>
                        <SelectItem value="reviewer">External reviewer</SelectItem>
                        <SelectItem value="institution">Institution card</SelectItem>
                        <SelectItem value="organizing">Organizing member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {committeeType === 'institution' ? (
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-icon`}>Card icon</Label>
                    <Select value={icon} onValueChange={(value) => setIcon(value as CommitteeIcon)}>
                      <SelectTrigger id={`${formId}-icon`} className="cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMITTEE_ICONS.map((value) => (
                          <SelectItem key={value} value={value}>
                            {COMMITTEE_ICON_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                {showEmail ? (
                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-email`}>Email (optional)</Label>
                    <Input
                      id={`${formId}-email`}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                    />
                  </div>
                ) : null}

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <Label htmlFor={`${formId}-published`}>Published</Label>
                    <p className="text-xs text-muted-foreground">Visible on the public website</p>
                  </div>
                  <Switch
                    id={`${formId}-published`}
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
              </FormSection>

              <div className="lg:border-l lg:border-border lg:pl-8">
                <FormSection title="Content" description="Name and affiliation shown on the card.">
                  {committeeType === 'institution' ? (
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-role_label`}>
                        Role label
                        <span className="ml-1 text-destructive">*</span>
                      </Label>
                      <Input
                        id={`${formId}-role_label`}
                        value={roleLabel}
                        onChange={(e) => setRoleLabel(e.target.value)}
                        placeholder="General Chair"
                        required
                      />
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-name`}>
                      Name
                      <span className="ml-1 text-destructive">*</span>
                    </Label>
                    <Input
                      id={`${formId}-name`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Prof. Jane Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${formId}-affiliation`}>Affiliation / details</Label>
                    <Textarea
                      id={`${formId}-affiliation`}
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      placeholder="University, department, country"
                      rows={3}
                    />
                  </div>
                </FormSection>
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText={member ? 'Saving…' : 'Creating…'}
              className="cursor-pointer"
            >
              {member ? 'Save changes' : 'Create member'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
