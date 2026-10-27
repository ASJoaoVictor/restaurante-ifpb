import { ApiStringProperty } from '../../../utils/swagger-decorators'

export class HealthCheckDto {
  @ApiStringProperty({ example: 'OK' })
  status: 'OK'
}
