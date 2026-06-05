'use server'

import {
  deleteFromCloudinary,
  getCloudinaryPublicId,
  isCloudinaryConfigured,
  uploadToCloudinary,
} from '@/lib/cloudinary'
import type { CloudinaryFolder } from '@/types/cloudinary'

export async function uploadImage(formData: FormData) {
  if (!isCloudinaryConfigured()) {
    return {
      error:
        'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local',
    }
  }

  const file = formData.get('file')
  const folder = formData.get('folder')

  if (!(file instanceof File)) {
    return { error: 'No image file selected' }
  }

  if (folder !== 'ianlp/speakers' && folder !== 'ianlp/partners') {
    return { error: 'Invalid upload folder' }
  }

  try {
    const result = await uploadToCloudinary(file, folder as CloudinaryFolder)
    return { url: result.url, publicId: result.publicId }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}

export async function removeCloudinaryImage(url: string) {
  if (!isCloudinaryConfigured()) {
    return { error: 'Cloudinary is not configured' }
  }

  const publicId = getCloudinaryPublicId(url)
  if (!publicId) {
    return { success: true }
  }

  try {
    await deleteFromCloudinary(publicId)
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete image',
    }
  }
}
