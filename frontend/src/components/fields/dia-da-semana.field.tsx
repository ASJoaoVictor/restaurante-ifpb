import { CreateRefeicaoDto, CreateRefeicaoDtoDiaDaSemana } from '@/api/endpoints/api.schemas'
import { Button, Wrap } from '@chakra-ui/react'
import { HookField } from './common/hook-field'

export function DiaDaSemanaField() {
  return (
    // BUG: O orval não sabe criar o tipo de Enum com null corretamente
    <HookField<CreateRefeicaoDto> name="diaDaSemana" label="Dia da Semana" defaultValue={null as any}>
      {({ field, formState }) => (
        <Wrap gap={1}>
          <Button
            variant={!field.value ? 'solid' : 'outline'}
            onClick={() => field.onChange(null)}
            disabled={formState.isSubmitting}
          >
            (Qualquer)
          </Button>
          <Button
            variant={field.value === CreateRefeicaoDtoDiaDaSemana.domingo ? 'solid' : 'outline'}
            onClick={() => field.onChange(CreateRefeicaoDtoDiaDaSemana.domingo)}
            disabled={formState.isSubmitting}
          >
            Dom
          </Button>
          <Button
            variant={field.value === CreateRefeicaoDtoDiaDaSemana.segunda ? 'solid' : 'outline'}
            onClick={() => field.onChange(CreateRefeicaoDtoDiaDaSemana.segunda)}
            disabled={formState.isSubmitting}
          >
            Seg
          </Button>
          <Button
            variant={field.value === CreateRefeicaoDtoDiaDaSemana.terca ? 'solid' : 'outline'}
            onClick={() => field.onChange(CreateRefeicaoDtoDiaDaSemana.terca)}
            disabled={formState.isSubmitting}
          >
            Ter
          </Button>
          <Button
            variant={field.value === CreateRefeicaoDtoDiaDaSemana.quarta ? 'solid' : 'outline'}
            onClick={() => field.onChange(CreateRefeicaoDtoDiaDaSemana.quarta)}
            disabled={formState.isSubmitting}
          >
            Qua
          </Button>
          <Button
            variant={field.value === CreateRefeicaoDtoDiaDaSemana.quinta ? 'solid' : 'outline'}
            onClick={() => field.onChange(CreateRefeicaoDtoDiaDaSemana.quinta)}
            disabled={formState.isSubmitting}
          >
            Qui
          </Button>
          <Button
            variant={field.value === CreateRefeicaoDtoDiaDaSemana.sexta ? 'solid' : 'outline'}
            onClick={() => field.onChange(CreateRefeicaoDtoDiaDaSemana.sexta)}
            disabled={formState.isSubmitting}
          >
            Sex
          </Button>
          <Button
            variant={field.value === CreateRefeicaoDtoDiaDaSemana.sabado ? 'solid' : 'outline'}
            onClick={() => field.onChange(CreateRefeicaoDtoDiaDaSemana.sabado)}
            disabled={formState.isSubmitting}
          >
            Sáb
          </Button>
        </Wrap>
      )}
    </HookField>
  )
}
