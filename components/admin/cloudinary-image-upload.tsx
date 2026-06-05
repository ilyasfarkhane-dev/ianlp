'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadImageToCloudinary, isCloudinaryUploadConfigured } from '@/lib/cloudinary-client'
import type { CloudinaryFolder } from '@/types/cloudinary'
import { cn } from '@/lib/utils'

type CloudinaryImageUploadProps = {
  value: string
  onChange: (url: string) => void
  folder: CloudinaryFolder
  label: string
  description?: string
  previewClassName?: string
  required?: boolean
}

export function CloudinaryImageUpload({
  value,
  onChange,
  folder,
  label,
  description,
  previewClassName,
  required,
}: CloudinaryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const isConfigured = isCloudinaryUploadConfigured()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isConfigured) {
      toast.error(
        'Cloudinary upload is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local'
      )
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setUploading(true)

    try {
      const result = await uploadImageToCloudinary(file, folder)
      onChange(result.url)
      toast.success('Image uploaded to Cloudinary')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>{label}</Label>
       
      </div>

      {value ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div
            className={cn(
              'relative overflow-hidden rounded-lg border border-border bg-muted',
              previewClassName ?? 'h-32 w-32'
            )}
          >
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              className={cn(
                'object-cover',
                folder === 'ianlp/partners' && 'object-contain p-2'
              )}
              sizes="128px"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
           
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading || !isConfigured}
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Replace image
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange('')}
                className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || !isConfigured}
          className={cn(
            'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8',
            'transition-colors duration-200 hover:border-primary hover:bg-muted/50',
            (uploading || !isConfigured) && 'pointer-events-none opacity-60'
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Uploading to Cloudinary…</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Click to upload {required ? '(required)' : ''}
              </span>
              <span className="text-xs text-muted-foreground">PNG, JPG, WEBP — max 5 MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
