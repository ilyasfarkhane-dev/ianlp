'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LOCALE_LABELS, LOCALES, type Locale } from '@/types/database'

type LocaleField = {
  name?: string
  affiliation?: string
  bio?: string
  label?: string
  description?: string
  alt_text?: string
}

type LocaleFieldGroupProps = {
  values: Record<Locale, LocaleField>
  onChange: (locale: Locale, field: keyof LocaleField, value: string) => void
  fields: Array<'name' | 'affiliation' | 'bio' | 'label' | 'description' | 'alt_text'>
}

const fieldConfig: Record<
  keyof LocaleField,
  { label: string; multiline?: boolean; placeholder?: string }
> = {
  name: { label: 'Name', placeholder: 'Speaker name' },
  affiliation: { label: 'Affiliation', placeholder: 'University or organization' },
  bio: { label: 'Biography', multiline: true, placeholder: 'Short biography' },
  label: { label: 'Label', placeholder: 'e.g. Paper Submission Deadline' },
  description: { label: 'Description', multiline: true, placeholder: 'Additional details' },
  alt_text: { label: 'Alt text', placeholder: 'Logo description for accessibility' },
}

export function LocaleFieldGroup({ values, onChange, fields }: LocaleFieldGroupProps) {
  return (
    <Tabs defaultValue="en" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {LOCALES.map((locale) => (
          <TabsTrigger key={locale} value={locale} className="cursor-pointer">
            {LOCALE_LABELS[locale]}
          </TabsTrigger>
        ))}
      </TabsList>
      {LOCALES.map((locale) => (
        <TabsContent key={locale} value={locale} className="mt-4 space-y-4">
          {fields.map((field) => {
            const config = fieldConfig[field]
            const id = `${locale}-${field}`

            return (
              <div key={field} className="space-y-2">
                <Label htmlFor={id}>{config.label}</Label>
                {config.multiline ? (
                  <Textarea
                    id={id}
                    value={values[locale][field] ?? ''}
                    onChange={(e) => onChange(locale, field, e.target.value)}
                    placeholder={config.placeholder}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={id}
                    value={values[locale][field] ?? ''}
                    onChange={(e) => onChange(locale, field, e.target.value)}
                    placeholder={config.placeholder}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  />
                )}
              </div>
            )
          })}
        </TabsContent>
      ))}
    </Tabs>
  )
}
