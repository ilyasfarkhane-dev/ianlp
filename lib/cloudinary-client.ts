import type { CloudinaryFolder } from '@/types/cloudinary'

type CloudinaryUploadResponse = {
  secure_url: string
  public_id: string
  error?: { message: string }
}

export function isCloudinaryUploadConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim()
  )
}

export async function uploadImageToCloudinary(
  file: File,
  folder: CloudinaryFolder
): Promise<{ url: string; publicId: string }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim()

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary upload is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local'
    )
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('Image must be 5 MB or smaller')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = (await response.json()) as CloudinaryUploadResponse

  if (!response.ok) {
    throw new Error(data.error?.message ?? 'Failed to upload image to Cloudinary')
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}
