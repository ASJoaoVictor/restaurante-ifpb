import { IsString } from 'class-validator'
import { ApiNonEmptyStringProperty } from '../../../utils/swagger-decorators'

export class FileParamDto {
  @ApiNonEmptyStringProperty({ example: 'file-name.pdf' })
  @IsString()
  fileName: string
}
