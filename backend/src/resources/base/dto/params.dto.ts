import { IsString, IsUUID } from 'class-validator'
import { ApiUUIDProperty } from '../../../utils/swagger-decorators'

export class UUIDParamDto {
  @ApiUUIDProperty()
  @IsString()
  @IsUUID('loose')
  id: string
}
