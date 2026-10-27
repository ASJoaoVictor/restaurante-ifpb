import { CreateRefeicaoDto, Refeicao } from '@/api/endpoints/api.schemas'
import { useRefeicoesCreate, useRefeicoesUpdate } from '@/api/endpoints/refeicoes'
import { TURNOS_ARRAY } from '@/enums/turnos'
import { Box, GridItem, SimpleGrid, Stack, VStack } from '@chakra-ui/react'
import { NumberField, SwitchField, TextField, TimeField } from '../fields/common/basic-fields'
import { DiaDaSemanaField } from '../fields/dia-da-semana.field'
import { SelectField } from '../fields/common/select.field'
import { BaseForm } from './components/base-form'

const DESLOCAMENTO_DIAS = [
  { label: '7 dias antes', value: -7 },
  { label: '6 dias antes', value: -6 },
  { label: '5 dias antes', value: -5 },
  { label: '4 dias antes', value: -4 },
  { label: '3 dias antes', value: -3 },
  { label: '2 dias antes', value: -2 },
  { label: '1 dia antes', value: -1 },
  { label: 'No dia', value: 0 },
  { label: '1 dia depois', value: 1 },
  { label: '2 dias depois', value: 2 },
  { label: '3 dias depois', value: 3 },
  { label: '4 dias depois', value: 4 },
  { label: '5 dias depois', value: 5 },
  { label: '6 dias depois', value: 6 },
  { label: '7 dias depois', value: 7 }
]

export function RefeicaoForm({ edit }: { edit?: Refeicao }) {
  const createMutation = useRefeicoesCreate()
  const updateMutation = useRefeicoesUpdate()

  return (
    <BaseForm
      edit={edit}
      createMutation={createMutation}
      updateMutation={updateMutation}
      successRedirectPath="/admin/refeicoes"
    >
      {/* TODO: aumentar gap entre itens de formulário */}
      <VStack gap={4} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <GridItem colSpan={2}>
            <TextField<CreateRefeicaoDto> name="nome" label="Nome" required autoFocus />
          </GridItem>

          <GridItem>
            <NumberField<CreateRefeicaoDto> name="vagas" label="Vagas" min={1} int />
          </GridItem>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          <Box>
            <SelectField<CreateRefeicaoDto>
              name="turno"
              label="Turno"
              items={TURNOS_ARRAY}
              itemToString={(item) => item.label}
              itemToValue={(item) => item.value}
            />

            <SwitchField<CreateRefeicaoDto> name="priorizarMesmoTurno" children="Priorizar mesmo turno" mt={2} />
          </Box>

          <GridItem colSpan={2}>
            <DiaDaSemanaField />
          </GridItem>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
          <Stack gap={2}>
            <TimeField<CreateRefeicaoDto> name="horarioAbertura" label="Abertura" />
            <SelectField<CreateRefeicaoDto>
              name="deslocamentoDataAbertura"
              items={DESLOCAMENTO_DIAS}
              itemToString={(item) => item.label}
              itemToValue={(item) => item.value}
              defaultValue={0}
              required
            />
            <SwitchField<CreateRefeicaoDto> name="aberturaAutomatica" children="Automático" />
          </Stack>

          <Stack gap={2}>
            <TimeField<CreateRefeicaoDto> name="horarioFechamento" label="Fechamento" />
            <SelectField<CreateRefeicaoDto>
              name="deslocamentoDataFechamento"
              items={DESLOCAMENTO_DIAS}
              itemToString={(item) => item.label}
              itemToValue={(item) => item.value}
              defaultValue={0}
              required
            />
            <SwitchField<CreateRefeicaoDto> name="fechamentoAutomatico" children="Automático" />
          </Stack>

          <Stack gap={2}>
            <TimeField<CreateRefeicaoDto> name="horarioDivulgacaoResultado" label="Divulgação Resultado" />
            <SelectField<CreateRefeicaoDto>
              name="deslocamentoDataDivulgacao"
              items={DESLOCAMENTO_DIAS}
              itemToString={(item) => item.label}
              itemToValue={(item) => item.value}
              defaultValue={0}
              required
            />
            <SwitchField<CreateRefeicaoDto> name="divulgacaoAutomatica" children="Automático" />
          </Stack>

          <Stack gap={2}>
            <TimeField<CreateRefeicaoDto> name="horarioFinalizacao" label="Finalização" />
            <SelectField<CreateRefeicaoDto>
              name="deslocamentoDataFinalizacao"
              items={DESLOCAMENTO_DIAS}
              itemToString={(item) => item.label}
              itemToValue={(item) => item.value}
              defaultValue={0}
              required
            />
            <SwitchField<CreateRefeicaoDto> name="finalizacaoAutomatica" children="Automático" />
          </Stack>

          <Stack gap={2}>
            <TimeField<CreateRefeicaoDto> name="horarioEncerramento" label="Encerramento" />
            <SelectField<CreateRefeicaoDto>
              name="deslocamentoDataEncerramento"
              items={DESLOCAMENTO_DIAS}
              itemToString={(item) => item.label}
              itemToValue={(item) => item.value}
              defaultValue={0}
              required
            />
            <SwitchField<CreateRefeicaoDto> name="encerramentoAutomatico" children="Automático" />
          </Stack>
        </SimpleGrid>
      </VStack>
    </BaseForm>
  )
}
