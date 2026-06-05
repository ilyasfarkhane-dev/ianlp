import { revalidatePath } from 'next/cache'

const PUBLIC_LOCALES = ['en', 'fr', 'ar'] as const

export function revalidatePublicSite() {
  for (const locale of PUBLIC_LOCALES) {
    revalidatePath(`/${locale}/ianlp`)
  }
}
