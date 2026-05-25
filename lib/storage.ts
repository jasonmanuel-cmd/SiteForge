/**
 * File Storage Service
 * Handles file uploads to local filesystem or S3
 */

import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local'
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'

export interface UploadResult {
  fileName: string
  fileType: string
  mimeType: string
  fileSize: number
  storagePath: string
  storageUrl: string
}

/**
 * Initialize storage (create upload directory if needed)
 */
export async function initializeStorage(): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    try {
      await fs.access(UPLOAD_DIR)
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true })
    }
  }
}

/**
 * Save file to storage
 */
export async function saveFile(
  file: Buffer,
  originalFileName: string,
  mimeType: string
): Promise<UploadResult> {
  const fileExtension = path.extname(originalFileName)
  const fileType = fileExtension.substring(1) // Remove the dot
  const uniqueFileName = `${uuidv4()}${fileExtension}`

  if (STORAGE_TYPE === 'local') {
    // Save to local filesystem
    const storagePath = path.join(UPLOAD_DIR, uniqueFileName)
    await fs.writeFile(storagePath, file)

    return {
      fileName: originalFileName,
      fileType,
      mimeType,
      fileSize: file.length,
      storagePath,
      storageUrl: `/uploads/${uniqueFileName}`,
    }
  }

  // TODO: Implement S3 upload for production
  // For now, fallback to local
  throw new Error('S3 storage not yet implemented')
}

/**
 * Read file from storage
 */
export async function readFile(storagePath: string): Promise<Buffer> {
  if (STORAGE_TYPE === 'local') {
    return fs.readFile(storagePath)
  }

  // TODO: Implement S3 download for production
  throw new Error('S3 storage not yet implemented')
}

/**
 * Delete file from storage
 */
export async function deleteFile(storagePath: string): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    try {
      await fs.unlink(storagePath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
    return
  }

  // TODO: Implement S3 delete for production
  throw new Error('S3 storage not yet implemented')
}

/**
 * Convert file to base64 for AI processing
 */
export async function fileToBase64(storagePath: string): Promise<string> {
  const buffer = await readFile(storagePath)
  return buffer.toString('base64')
}
