import { v2 as cloudinary } from 'cloudinary'
import type { CloudinaryFolder } from '@/types/cloudinary'

export type { CloudinaryFolder }

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local'
    )
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })

  return cloudinary
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim()
  )
}

export async function uploadToCloudinary(
  file: File,
  folder: CloudinaryFolder
): Promise<{ url: string; publicId: string }> {
  const cloudinaryClient = configureCloudinary()

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('Image must be 5 MB or smaller')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`

  const result = await cloudinaryClient.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    overwrite: false,
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const cloudinaryClient = configureCloudinary()
  await cloudinaryClient.uploader.destroy(publicId)
}

export function getCloudinaryPublicId(url: string): string | null {
  if (!url.includes('res.cloudinary.com')) return null

  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^/]+$/)
  return match?.[1] ?? null
}
