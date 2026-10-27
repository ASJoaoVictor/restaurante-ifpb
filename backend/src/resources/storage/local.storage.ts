import { Injectable } from '@nestjs/common'
import { createReadStream, createWriteStream, existsSync } from 'fs'
import { mkdir, stat, unlink, writeFile } from 'fs/promises'
import { lookup } from 'mime-types'
import path from 'path'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import { UPLOADS_DIR } from '../../config/upload.config'
import { FileStorage } from './base.storage'
import { ReadableStreamLike, StorageFile } from './dto/file.dto'

@Injectable()
export class LocalFileStorage extends FileStorage {
  async getFile(fileName: string): Promise<StorageFile | null> {
    fileName = path.basename(fileName)
    const filePath = path.join(UPLOADS_DIR, fileName)

    if (!existsSync(filePath)) {
      return null
    }

    const mimeType = lookup(fileName) || null
    const { size } = await stat(filePath)
    const readStream = createReadStream(filePath)
    const stream = Readable.toWeb(readStream)

    return { fileName, mimeType, size, stream }
  }

  async saveFile(fileName: string, bufferOrStream: Buffer | ReadableStreamLike): Promise<string> {
    fileName = path.basename(fileName)

    await mkdir(UPLOADS_DIR, { recursive: true })
    const uniqueFileName = this.createUniqueFileName(fileName)
    const filePath = path.join(UPLOADS_DIR, uniqueFileName)

    if (bufferOrStream instanceof Buffer) {
      await writeFile(filePath, bufferOrStream)
    } else {
      await pipeline(bufferOrStream, createWriteStream(filePath))
    }

    return uniqueFileName
  }

  async deleteFile(fileName: string): Promise<void> {
    fileName = path.basename(fileName)
    await unlink(path.join(UPLOADS_DIR, fileName))
  }
}
