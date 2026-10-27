import { Readable } from 'stream'
import { ReadableStream } from 'stream/web'

export type ReadableStreamLike = globalThis.ReadableStream | ReadableStream | Readable

export interface StorageFile {
  fileName: string | null
  mimeType: string | null
  size: number | null
  stream: ReadableStreamLike
}
