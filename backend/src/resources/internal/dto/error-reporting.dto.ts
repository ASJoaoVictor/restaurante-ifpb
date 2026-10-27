import { PickType } from '@nestjs/swagger'
import { FullErrorReport } from '../entities/error-report.entity'

export class ReportErrorDto extends PickType(FullErrorReport, ['name', 'message', 'stack', 'url', 'type', 'details']) {}
