import { BadRequestException } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage, memoryStorage } from 'multer'
import { env } from './env.config'

export const MAX_FILE_SIZE_5MB = 5 * 1024 * 1024
export const MAX_FILE_SIZE_10MB = 10 * 1024 * 1024
export const UPLOADS_DIR = 'public/uploads'
export const TEMP_DIR = 'temp'

export const uploadConfig: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_5MB }
}

export const uploadComprovanteConfig: MulterOptions = {
  ...uploadConfig,
  storage: env.VERCEL ? memoryStorage() : diskStorage({ destination: TEMP_DIR }),
  limits: { fileSize: MAX_FILE_SIZE_10MB },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new BadRequestException('Apenas arquivos PDF, DOC, DOCX, JPEG, PNG e WEBP são permitidos'), false)
    }
  }
}

export const uploadImportAlunosConfig: MulterOptions = {
  ...uploadConfig,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new BadRequestException('Apenas arquivos Excel são permitidos'), false)
    }
  }
}
