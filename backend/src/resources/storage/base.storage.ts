import { Injectable } from '@nestjs/common'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { ReadableStreamLike, StorageFile } from './dto/file.dto'

@Injectable()
export abstract class FileStorage {
  abstract getFile(fileName: string): Promise<StorageFile | null>

  abstract saveFile(fileName: string, bufferOrStream: Buffer | ReadableStreamLike): Promise<string>

  abstract deleteFile(fileName: string): Promise<void>

  protected createUniqueFileName(originalFileName: string): string {
    const uuid = uuidv4()
    const fileType = path.extname(originalFileName)
    const fileName = `${uuid}${fileType}`
    return fileName
  }
}
