import { CreateTurmaDto, Curso, Turma } from '@/api/endpoints/api.schemas'
import { useCursosGetAllWithoutPagination } from '@/api/endpoints/cursos'
import { useTurmasCreate, useTurmasUpdate } from '@/api/endpoints/turmas'
import { TURNOS_ARRAY } from '@/enums/turnos'
import { GridItem, SimpleGrid } from '@chakra-ui/react'
import { NumberField, TextField } from '../fields/common/basic-fields'
import { DiaContraturnoField } from '../fields/dia-contraturno.field'
import { ReferencialInputField } from '../fields/common/referencial-input.field'
import { SelectField } from '../fields/common/select.field'
import { BaseForm } from './components/base-form'

export function TurmaForm({ edit }: { edit?: Turma }) {
  const createMutation = useTurmasCreate()
  const updateMutation = useTurmasUpdate()

  return (
    <BaseForm
      edit={edit}
      createMutation={createMutation}
      updateMutation={updateMutation}
      successRedirectPath="/admin/turmas"
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4} mb={4}>
        <NumberField<CreateTurmaDto> name="periodo" label="Período" min={1} int required autoFocus />

        <ReferencialInputField<CreateTurmaDto, Curso>
          name="cursoId"
          itemNamePath="nome"
          label="Curso"
          useListHook={useCursosGetAllWithoutPagination}
          comboboxProps={{ placeholder: 'Selecione o curso' }}
          required
        />

        <TextField<CreateTurmaDto> name="turma" label="Turma" allowEmpty />

        <SelectField<CreateTurmaDto>
          name="turno"
          label="Turno"
          items={TURNOS_ARRAY}
          itemToString={(item) => item.label}
          itemToValue={(item) => item.value}
        />

        <GridItem colSpan={{ base: 1, md: 1, lg: 2 }}>
          <DiaContraturnoField />
        </GridItem>
      </SimpleGrid>
    </BaseForm>
  )
}
