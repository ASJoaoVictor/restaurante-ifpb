import { Logger, Module } from '@nestjs/common'
import { env } from '../../config/env.config'
import { FileStorage } from './base.storage'
import { LocalFileStorage } from './local.storage'
import { StorageController } from './storage.controller'
import { VercelBlobFileStorage } from './vercel-blob.storage'

@Module({
  controllers: [StorageController],
  providers: [
    LocalFileStorage,
    VercelBlobFileStorage,
    {
      provide: FileStorage,
      useFactory: (local: LocalFileStorage, vercelBlob: VercelBlobFileStorage) => {
        const logger = new Logger(StorageModule.name)

        if (env.BLOB_STORE_ID) {
          logger.log('Using VercelBlobFileStorage for file storage')
          return vercelBlob
        }

        logger.log('Using LocalFileStorage for file storage')
        return local
      },
      inject: [LocalFileStorage, VercelBlobFileStorage]
    }
  ],
  exports: [FileStorage]
})
export class StorageModule {}
