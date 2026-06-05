import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/admin-header'
import { PartnerFormDialog } from '@/components/admin/partner-form-dialog'
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
import { Building2, Pencil } from 'lucide-react'
import type { PartnerWithTranslations } from '@/types/database'

export default async function AdminPartnersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: partners, error } = await supabase
    .from('partners')
    .select('*, partner_translations(*)')
    .order('sort_order', { ascending: true })

  const partnerList = (partners ?? []) as PartnerWithTranslations[]

  return (
    <>
      <AdminHeader
        title="Partners"
        description="Manage sponsor and partner logos"
        email={user?.email}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>All partners</CardTitle>
              <CardDescription>
                {error
                  ? 'Could not load partners. Check your Supabase connection.'
                  : `${partnerList.length} partner(s) in the database`}
              </CardDescription>
            </div>
            <PartnerFormDialog />
          </CardHeader>
          <CardContent>
            {partnerList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <Building2 className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No partners yet. Add your first partner.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Logo</TableHead>
                    <TableHead>Alt text</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnerList.map((partner) => {
                    const enTranslation =
                      partner.partner_translations.find((t) => t.locale === 'en') ??
                      partner.partner_translations[0]

                    return (
                      <TableRow key={partner.id} className="transition-colors duration-200 hover:bg-muted/50">
                        <TableCell>
                          <div className="relative h-10 w-20 overflow-hidden rounded ring-1 ring-border">
                            <Image
                              src={partner.logo_path}
                              alt={enTranslation?.alt_text ?? 'Partner'}
                              fill
                              className="object-contain p-1"
                              sizes="80px"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{enTranslation?.alt_text ?? '—'}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {partner.url ?? '—'}
                        </TableCell>
                        <TableCell>{partner.sort_order}</TableCell>
                        <TableCell>
                          <Badge variant={partner.is_published ? 'default' : 'outline'}>
                            {partner.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <PartnerFormDialog
                              partner={partner}
                              trigger={
                                <Button variant="ghost" size="icon" className="cursor-pointer">
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              }
                            />
                            <DeleteItemButton
                              action="partner"
                              id={partner.id}
                              title="Delete partner?"
                              description="This will permanently remove the partner and all translations."
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
