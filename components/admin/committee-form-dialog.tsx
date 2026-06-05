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

type CommitteeFormDialogProps = {
  member?: CommitteeMemberWithTranslations
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommitteeFormDialog({
  member,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: CommitteeFormDialogProps) {
  const router = useRouter()
  const formId = useId()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState(member?.sort_order ?? 0)
  const [committeeType, setCommitteeType] = useState<CommitteeType>(
    member?.committee_type ?? 'pc_chair'
  )
  const [icon, setIcon] = useState<CommitteeIcon>(parseCommitteeIcon(member?.icon))
  const [email, setEmail] = useState(member?.email ?? '')
  const [isPublished, setIsPublished] = useState(member?.is_published ?? true)
  const [name, setName] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [roleLabel, setRoleLabel] = useState('')

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

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
    setSortOrder(member?.sort_order ?? 0)
    setCommitteeType(member?.committee_type ?? 'pc_chair')
    setIcon(parseCommitteeIcon(member?.icon))
    setEmail(member?.email ?? '')
    setIsPublished(member?.is_published ?? true)
    setName(fields.name)
    setAffiliation(fields.affiliation)
    setRoleLabel(fields.roleLabel)
  }, [open, member])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    if (committeeType === 'organizing' && !roleLabel.trim()) {
      toast.error('Role label is required for organizing committee cards')
      return
    }

    setLoading(true)
    const payload = {
      sort_order: sortOrder,
      committee_type: committeeType,
      icon: committeeType === 'organizing' ? icon : null,
      email,
      is_published: isPublished,
      translations: buildTranslationsForAllLocales({
        name,
        affiliation,
        role_label: roleLabel,
      }),
    }

    const result = member
      ? await updateCommitteeMember(member.id, payload)
      : await createCommitteeMember(payload)

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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit} className="relative" aria-busy={loading}>
          <FormLoadingOverlay loading={loading} label="Saving member…" />
          <DialogHeader>
            <DialogTitle>{member ? 'Edit committee member' : 'Add committee member'}</DialogTitle>
            <DialogDescription>
              Manage program chairs, reviewers, or organizing committee cards.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`${formId}-sort_order`}>Sort order</Label>
                <Input
                  id={`${formId}-sort_order`}
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${formId}-committee_type`}>Type</Label>
                <Select
                  value={committeeType}
                  onValueChange={(v) => setCommitteeType(v as CommitteeType)}
                >
                  <SelectTrigger id={`${formId}-committee_type`} className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pc_chair">Program chair</SelectItem>
                    <SelectItem value="reviewer">External reviewer</SelectItem>
                    <SelectItem value="organizing">Organizing card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {committeeType === 'organizing' ? (
                <div className="space-y-2">
                  <Label htmlFor={`${formId}-icon`}>Icon</Label>
                  <Select value={icon} onValueChange={(v) => setIcon(v as CommitteeIcon)}>
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
              ) : (
                <div className="hidden sm:block" aria-hidden />
              )}
            </div>

            {committeeType === 'organizing' && (
              <div className="space-y-2">
                <Label htmlFor={`${formId}-role_label`}>Role label</Label>
                <Input
                  id={`${formId}-role_label`}
                  value={roleLabel}
                  onChange={(e) => setRoleLabel(e.target.value)}
                  placeholder="e.g. General Chair"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor={`${formId}-name`}>Name</Label>
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

            {(committeeType === 'organizing' || committeeType === 'pc_chair') && (
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
            )}

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
          </div>

          <DialogFooter>
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
