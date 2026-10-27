import { ChamadaAluno, CreateInscricaoDto } from '@/api/endpoints/api.schemas'
import { useAuth } from '@/contexts/auth'
import { DAYS } from '@/utils/date'
import { Button, ButtonGroup, ColorPalette, IconButton } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { RiQuestionLine } from 'react-icons/ri'
import { Alert } from '../ui/alert'
import { ToggleTip } from '../ui/toggle-tip'
import { HookField } from './common/hook-field'

type ContraturnoOption = {
  label: string
  value: boolean
  color: ColorPalette
}

const options: ContraturnoOption[] = [
  { label: 'Não', value: false, color: 'red' },
  { label: 'Sim', value: true, color: 'blue' }
]

export function ContraturnoField({ chamada }: { chamada: ChamadaAluno }) {
  const { me } = useAuth()
  const temContraturnoTurma = me.turma?.diasContraturno.includes(DAYS[dayjs(chamada.data).day()])

  return (
    <>
      <Alert
        title="Detectamos que sua turma tem aula no contraturno no dia da refeição, então não é necessário enviar comprovante."
        hidden={!temContraturnoTurma}
      />

      <HookField<CreateInscricaoDto>
        name="temAulaContraturno"
        label={<ContraturnoHelp />}
        helperText={
          !temContraturnoTurma ? 'Se você tiver aula no contraturno, será necessário enviar um comprovante' : ''
        }
        defaultValue={!!temContraturnoTurma}
      >
        {({ field, formState }) => (
          <ButtonGroup attached ref={field.ref}>
            {options.map((data, index) => (
              <Button
                key={index}
                w={36}
                colorPalette={data.color}
                variant={field.value === data.value ? 'solid' : 'outline'}
                onClick={() => field.onChange(data.value)}
                disabled={temContraturnoTurma || field.disabled || formState.isSubmitting}
              >
                {data.label}
              </Button>
            ))}
          </ButtonGroup>
        )}
      </HookField>
    </>
  )
}

function ContraturnoHelp() {
  return (
    <>
      Você tem aula no contraturno?
      <ToggleTip content="Por exemplo, se você normalmente tem aula pela manhã, mas neste dia você também terá aula à tarde">
        <IconButton size="xs" variant="ghost">
          <RiQuestionLine />
        </IconButton>
      </ToggleTip>
    </>
  )
}
