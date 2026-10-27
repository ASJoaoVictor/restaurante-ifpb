import { Chamada, CreateChamadaDto } from '@/api/endpoints/api.schemas'
import { useChamadasCreate, useChamadasUpdate } from '@/api/endpoints/chamadas'
import { TURNOS_ARRAY } from '@/enums/turnos'
import { Box, GridItem, Icon, SimpleGrid, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { ReactNode } from 'react'
import { Path, useFormContext, useWatch } from 'react-hook-form'
import { RiErrorWarningLine } from 'react-icons/ri'
import { DateField, DateTimeField, NumberField, SwitchField, TextField } from '../fields/common/basic-fields'
import { RefeicaoField } from '../fields/refeicao.field'
import { SelectField } from '../fields/common/select.field'
import { ToggleTip } from '../ui/toggle-tip'
import { BaseForm } from './components/base-form'

export function ChamadaForm({ edit }: { edit?: Chamada }) {
  const createMutation = useChamadasCreate()
  const updateMutation = useChamadasUpdate()

  return (
    <BaseForm
      edit={edit}
      createMutation={createMutation}
      updateMutation={updateMutation}
      successRedirectPath="/admin/chamadas"
    >
      <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
        <GridItem>
          <RefeicaoField edit={edit} />
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 3 }}>
          <VStack gap={4} align="stretch">
            <TextField<CreateChamadaDto> name="nome" label="Nome" required autoFocus />

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              <Data edit={edit} />

              <NumberField<CreateChamadaDto> name="vagas" label="Vagas" min={1} int required />

              <Box>
                <SelectField<CreateChamadaDto>
                  name="turno"
                  label="Turno"
                  items={TURNOS_ARRAY}
                  itemToString={(item) => item.label}
                  itemToValue={(item) => item.value}
                />

                <SwitchField<CreateChamadaDto> name="priorizarMesmoTurno" children="Priorizar mesmo turno" mt={2} />
              </Box>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
              <DataHoraAcao name="dataHoraAbertura" label="Abertura" autoName="aberturaAutomatica" edit={edit} />
              <DataHoraAcao name="dataHoraFechamento" label="Fechamento" autoName="fechamentoAutomatico" edit={edit} />
              <DataHoraAcao
                name="dataHoraDivulgacaoResultado"
                label="Divulgação Resultado"
                autoName="divulgacaoAutomatica"
                edit={edit}
              />
              <DataHoraAcao
                name="dataHoraFinalizacao"
                label="Finalização"
                autoName="finalizacaoAutomatica"
                edit={edit}
              />
              <DataHoraAcao
                name="dataHoraEncerramento"
                label="Encerramento"
                autoName="encerramentoAutomatico"
                edit={edit}
              />
            </SimpleGrid>
          </VStack>
        </GridItem>
      </SimpleGrid>
    </BaseForm>
  )
}

function Data({ edit }: { edit?: Chamada }) {
  const { control } = useFormContext<CreateChamadaDto>()
  const dataHora = useWatch({ control, name: 'data' })

  return (
    <Box>
      <DateField<CreateChamadaDto> name="data" label="Data" required />
      {!edit && dataHora && dayjs(dataHora).isBefore(dayjs(), 'days') && (
        <Box textStyle="xs" mt={1.5} fontWeight="medium" color="orange.solid">
          Aviso: Data passada
        </Box>
      )}
    </Box>
  )
}

function DataHoraAcao({
  name,
  label,
  autoName,
  edit
}: {
  name: Path<CreateChamadaDto>
  label: string
  autoName: Path<CreateChamadaDto>
  edit?: Chamada
}) {
  const { control } = useFormContext<CreateChamadaDto>()
  const dataHora = useWatch({ control, name }) as string
  const automatico = useWatch({ control, name: autoName }) as boolean

  const labelElement: ReactNode[] = [label]

  const automaticoDataPassada = !edit && automatico && dataHora && dayjs(dataHora).isBefore()
  if (automaticoDataPassada) {
    labelElement.push(
      <ToggleTip content="Esta data é anterior à data atual, a ação será realizada automaticamente assim que a chamada for criada">
        <Icon color="orange.solid">
          <RiErrorWarningLine />
        </Icon>
      </ToggleTip>
    )
  }

  return (
    <Box colorPalette={automaticoDataPassada ? 'orange' : undefined}>
      <DateTimeField<CreateChamadaDto> name={name} label={labelElement} />
      <SwitchField<CreateChamadaDto> name={autoName} children="Automático" mt={2} />
    </Box>
  )
}
