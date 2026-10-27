import { Module } from '@nestjs/common'
import { DrizzleModule } from '../../drizzle/drizzle.module'
import { InternalController } from './internal.controller'
import { InternalService } from './internal.service'

@Module({
  imports: [DrizzleModule],
  controllers: [InternalController],
  providers: [InternalService],
  exports: [InternalService]
})
export class InternalModule {}
