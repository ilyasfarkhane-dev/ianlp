import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { SpeakerFormDialog } from '@/components/admin/speaker-form-dialog'
import { DeleteItemButton } from '@/components/admin/delete-item-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Pencil, User } from 'lucide-react'
import type { SpeakerWithTranslations } from '@/types/database'

export default async function AdminSpeakersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: speakers, error } = await supabase
    .from('speakers')
    .select('*, speaker_translations(*)')
    .order('sort_order', { ascending: true })

  const speakerList = (speakers ?? []) as SpeakerWithTranslations[]

  return (
    <>
      <AdminHeader
        title="Speakers"
        description="Manage keynote and invited speakers"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>All speakers</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load speakers. Check your Supabase connection.'
                  : `${speakerList.length} speaker(s) in the database`}
              </CardDescription>
            </div>
            <SpeakerFormDialog />
          </CardHeader>
          <CardContent>
            {speakerList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <User className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No speakers yet. Add your first speaker.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {speakerList.map((speaker) => {
                    const enTranslation =
                      speaker.speaker_translations.find((t) => t.locale === 'en') ??
                      speaker.speaker_translations[0]

                    return (
                      <TableRow key={speaker.id} className="transition-colors duration-200 hover:bg-muted/50">
                        <TableCell>
                          {speaker.image_path ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-border">
                              <Image
                                src={speaker.image_path}
                                alt={enTranslation?.name ?? 'Speaker'}
                                fill
                                className="object-cover object-top"
                                sizes="40px"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{enTranslation?.name ?? '—'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {speaker.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{speaker.sort_order}</TableCell>
                        <TableCell>
                          <Badge variant={speaker.is_published ? 'default' : 'outline'}>
                            {speaker.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <SpeakerFormDialog
                              speaker={speaker}
                              trigger={
                                <Button variant="ghost" size="icon" className="cursor-pointer">
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              }
                            />
                            <DeleteItemButton
                              action="speaker"
                              id={speaker.id}
                              title="Delete speaker?"
                              description="This will permanently remove the speaker and all translations."
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
