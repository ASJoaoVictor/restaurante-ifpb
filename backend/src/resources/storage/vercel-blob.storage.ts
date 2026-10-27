import { Injectable } from '@nestjs/common'
import { del, get, put } from '@vercel/blob'
import path from 'path'
import { Readable } from 'stream'
import { FileStorage } from './base.storage'
import { ReadableStreamLike, StorageFile } from './dto/file.dto'

@Injectable()
export class VercelBlobFileStorage extends FileStorage {
  async getFile(fileName: string): Promise<StorageFile | null> {
    fileName = path.basename(fileName)

    const blobResult = await get(fileName, { access: 'private' })
    if (!blobResult) return null

    const { blob, stream } = blobResult
    if (!stream) return null

    const mimeType = blob.contentType
    const { size } = blob

    return { fileName, mimeType, size, stream }
  }

  async saveFile(fileName: string, bufferOrStream: Buffer | ReadableStreamLike): Promise<string> {
    fileName = path.basename(fileName)

    const uniqueFileName = this.createUniqueFileName(fileName)
    await put(uniqueFileName, bufferOrStream as unknown as Readable, { access: 'private' })

    return uniqueFileName
  }

  async deleteFile(fileName: string): Promise<void> {
    fileName = path.basename(fileName)
    await del(fileName)
  }
}
