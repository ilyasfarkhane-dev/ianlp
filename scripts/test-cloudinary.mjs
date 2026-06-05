/**
 * Test Cloudinary configuration.
 * Run: node --env-file=.env.local scripts/test-cloudinary.mjs
 */

import { v2 as cloudinary } from 'cloudinary'

const checks = []

function pass(name, detail) {
  checks.push({ name, ok: true, detail })
  console.log(`✓ ${name}${detail ? `: ${detail}` : ''}`)
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail })
  console.error(`✗ ${name}${detail ? `: ${detail}` : ''}`)
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()
const publicCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim()

console.log('\nCloudinary configuration test\n')

// 1. Environment variables
if (cloudName && apiKey && apiSecret) {
  pass('Server credentials', 'CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET set')
} else {
  fail('Server credentials', 'Missing CLOUDINARY_CLOUD_NAME, API_KEY, or API_SECRET')
}

if (publicCloudName && uploadPreset) {
  pass('Client upload config', `cloud=${publicCloudName}, preset=${uploadPreset}`)
} else {
  fail(
    'Client upload config',
    'Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'
  )
}

if (cloudName && publicCloudName && cloudName !== publicCloudName) {
  fail('Cloud name consistency', 'CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME differ')
} else if (cloudName && publicCloudName) {
  pass('Cloud name consistency', cloudName)
}

// 2. Server-side API ping
if (cloudName && apiKey && apiSecret) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })

  try {
    const ping = await cloudinary.api.ping()
    if (ping?.status === 'ok') {
      pass('Server API ping', 'Credentials are valid')
    } else {
      fail('Server API ping', JSON.stringify(ping))
    }
  } catch (error) {
    fail('Server API ping', error instanceof Error ? error.message : String(error))
  }

  // 3. Verify upload preset exists
  if (uploadPreset) {
    try {
      const preset = await cloudinary.api.upload_preset(uploadPreset)
      const isUnsigned =
        preset?.unsigned === true ||
        preset?.settings?.unsigned === true ||
        String(preset?.settings?.signing_mode ?? '').toLowerCase() === 'unsigned'
      pass('Upload preset', `"${uploadPreset}" exists (${isUnsigned ? 'unsigned' : 'signed'})`)

      if (!isUnsigned) {
        console.log('  ℹ Preset reports as signed in API — unsigned upload test below is the real check.')
      }
    } catch (error) {
      fail('Upload preset', error instanceof Error ? error.message : String(error))
    }
  }
}

// 4. Test unsigned client upload (tiny 1x1 PNG)
if (publicCloudName && uploadPreset) {
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  const blob = Buffer.from(pngBase64, 'base64')

  const formData = new FormData()
  formData.append('file', new Blob([blob], { type: 'image/png' }), 'test.png')
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'ianlp/test')

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${publicCloudName}/image/upload`,
      { method: 'POST', body: formData }
    )
    const data = await response.json()

    if (response.ok && data.secure_url) {
      pass('Unsigned upload', data.secure_url)

      // Clean up test image via server API
      if (cloudName && apiKey && apiSecret && data.public_id) {
        try {
          await cloudinary.uploader.destroy(data.public_id)
          pass('Cleanup', `Removed test image ${data.public_id}`)
        } catch {
          fail('Cleanup', `Could not delete ${data.public_id} — remove manually in Cloudinary`)
        }
      }
    } else {
      fail('Unsigned upload', data.error?.message ?? `HTTP ${response.status}`)
    }
  } catch (error) {
    fail('Unsigned upload', error instanceof Error ? error.message : String(error))
  }
}

const failed = checks.filter((c) => !c.ok).length
console.log(`\n${failed === 0 ? 'All checks passed.' : `${failed} check(s) failed.`}\n`)
process.exit(failed === 0 ? 0 : 1)
