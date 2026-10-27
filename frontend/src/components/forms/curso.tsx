import { CreateCursoDto, Curso } from '@/api/endpoints/api.schemas'
import { useCursosCreate, useCursosUpdate } from '@/api/endpoints/cursos'
import { BaseForm } from './components/base-form'
import { NumberField, TextField } from '../fields/common/basic-fields'
import { SimpleGrid } from '@chakra-ui/react'

export function CursoForm({ edit }: { edit?: Curso }) {
  const createMutation = useCursosCreate()
  const updateMutation = useCursosUpdate()

  return (
    <BaseForm
      edit={edit}
      createMutation={createMutation}
      updateMutation={updateMutation}
      successRedirectPath="/admin/cursos"
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        <TextField<CreateCursoDto> name="nome" label="Nome" required autoFocus />
        <TextField<CreateCursoDto> name="nomeCurto" label="Nome curto" required />
        <NumberField<CreateCursoDto> name="numeroCurso" label="Número do curso" min={1} int required />
      </SimpleGrid>
    </BaseForm>
  )
}
