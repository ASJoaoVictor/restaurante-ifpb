import { CreateTurmaDto, CreateTurmaDtoDiasContraturnoItem } from '@/api/endpoints/api.schemas'
import { DAYS } from '@/utils/date'
import { formatDia } from '@/utils/formatters'
import { Button, For, Wrap } from '@chakra-ui/react'
import { HookField } from './common/hook-field'

export function DiaContraturnoField() {
  return (
    <HookField<CreateTurmaDto> name="diasContraturno" label="Dia(s) Contraturno" defaultValue={[]}>
      {({ field, formState }) => {
        const value = (field.value ?? []) as CreateTurmaDtoDiasContraturnoItem[]
        return (
          <Wrap gap={1}>
            <For each={DAYS}>
              {(day, index) => (
                <Button
                  key={index}
                  variant={value.includes(day) ? 'solid' : 'outline'}
                  justifyContent="start"
                  onClick={() => field.onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day])}
                  disabled={formState.isSubmitting}
                >
                  {formatDia(day, true)}
                </Button>
              )}
            </For>
          </Wrap>
        )
      }}
    </HookField>
  )
}
