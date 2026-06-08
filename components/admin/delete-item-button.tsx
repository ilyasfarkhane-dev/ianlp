'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { deleteCommitteeMember } from '@/app/admin/(dashboard)/committees/actions'
import { deleteImportantDate } from '@/app/admin/(dashboard)/dates/actions'
import { deletePartner } from '@/app/admin/(dashboard)/partners/actions'
import { deletePricingTier } from '@/app/admin/(dashboard)/pricing/actions'
import { deleteSpeaker } from '@/app/admin/(dashboard)/speakers/actions'
import { deleteTopic } from '@/app/admin/(dashboard)/topics/actions'
import { deleteWorkshop } from '@/app/admin/(dashboard)/register/actions'

type DeleteAction = 'speaker' | 'date' | 'partner' | 'topic' | 'committee' | 'pricing' | 'workshop'

const deleteActions: Record<
  DeleteAction,
  (id: string) => Promise<{ error?: string; success?: boolean }>
> = {
  speaker: deleteSpeaker,
  date: deleteImportantDate,
  partner: deletePartner,
  topic: deleteTopic,
  committee: deleteCommitteeMember,
  pricing: deletePricingTier,
  workshop: deleteWorkshop,
}

type DeleteItemButtonProps = {
  action: DeleteAction
  id: string
  title: string
  description: string
}

export function DeleteItemButton({ action, id, title, description }: DeleteItemButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deleteActions[action](id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Deleted successfully')
    router.refresh()
  }

  return (
    <DeleteConfirmDialog title={title} description={description} onConfirm={handleDelete} />
  )
}
