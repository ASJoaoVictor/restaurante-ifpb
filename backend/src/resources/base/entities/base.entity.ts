import { ApiDateTimeProperty, ApiUUIDProperty } from '../../../utils/swagger-decorators'

export class BaseEntity {
  @ApiUUIDProperty()
  id: string

  @ApiDateTimeProperty({ nullable: true })
  createdAt: string | null

  @ApiDateTimeProperty({ nullable: true })
  updatedAt: string | null
}
