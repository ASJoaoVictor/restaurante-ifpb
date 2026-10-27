import { Module } from '@nestjs/common'
import { DrizzleModule } from '../../drizzle/drizzle.module'
import { CampiService } from './campi.service'

@Module({
  imports: [DrizzleModule],
  providers: [CampiService],
  exports: [CampiService]
})
export class CampiModule {}
