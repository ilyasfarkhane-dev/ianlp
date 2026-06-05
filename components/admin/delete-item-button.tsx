'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { deleteImportantDate } from '@/app/admin/(dashboard)/dates/actions'
import { deletePartner } from '@/app/admin/(dashboard)/partners/actions'
import { deleteSpeaker } from '@/app/admin/(dashboard)/speakers/actions'

type DeleteAction = 'speaker' | 'date' | 'partner'

const deleteActions: Record<
  DeleteAction,
  (id: string) => Promise<{ error?: string; success?: boolean }>
> = {
  speaker: deleteSpeaker,
  date: deleteImportantDate,
  partner: deletePartner,
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
