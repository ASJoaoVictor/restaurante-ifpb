import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export function IsOptionalEnum<T extends string>(values: readonly T[]) {
  return applyDecorators(
    IsOptional(),
    Transform(({ value }) => (values.includes(value) ? value : undefined))
  )
}
