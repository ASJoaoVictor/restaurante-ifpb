import { useAlunosCreate, useAlunosUpdate } from '@/api/endpoints/alunos'
import { Aluno, CreateAlunoDto, Refeicao, Turma, UpdateAlunoDto } from '@/api/endpoints/api.schemas'
import { useRefeicoesGetAllWithoutPagination } from '@/api/endpoints/refeicoes'
import { useTurmasGetAllWithoutPagination } from '@/api/endpoints/turmas'
import { useAuth } from '@/contexts/auth'
import { formatTurma } from '@/utils/formatters'
import { GridItem, SimpleGrid } from '@chakra-ui/react'
import {
  CheckboxField,
  DateField,
  EmailField,
  NumberField,
  TextAreaField,
  TextField
} from '../fields/common/basic-fields'
import { PhoneField } from '../fields/common/phone.field'
import { SelectEntityField } from '../fields/common/select-entity.field'
import { BaseForm } from './components/base-form'

export function AlunoForm({ edit }: { edit?: Aluno }) {
  const { me } = useAuth()
  const createMutation = useAlunosCreate()
  const updateMutation = useAlunosUpdate()

  return (
    <BaseForm
      edit={edit}
      createMutation={createMutation}
      updateMutation={updateMutation}
      successRedirectPath="/admin/alunos"
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <TextField<CreateAlunoDto>
          name="usuario.name"
          label="Nome"
          placeholder="Digite o nome completo"
          required
          autoFocus
        />

        <TextField<CreateAlunoDto> name="matricula" label="Matrícula" required />

        <EmailField<CreateAlunoDto> name="usuario.email" label="E-mail" placeholder="exemplo@email.com" required />

        <PhoneField<CreateAlunoDto> name="usuario.phone" label="Telefone" placeholder="(xx) xxxxx-xxxx" required />

        <SelectEntityField<CreateAlunoDto, Turma>
          name="turmaId"
          label="Turma"
          useListHook={useTurmasGetAllWithoutPagination}
          itemToString={(item) => formatTurma(item, item.curso)}
          itemToValue={(item) => item.id}
        />

        <SelectEntityField<CreateAlunoDto, Refeicao>
          name="refeicoesRestritas"
          label="Refeições com edital do SUAP"
          useListHook={useRefeicoesGetAllWithoutPagination}
          itemToString={(item) => item.nome}
          itemToValue={(item) => item.id}
          multiple
        />

        <TextField<CreateAlunoDto> name="cidade" label="Cidade" placeholder="Digite a cidade" required />

        <TextField<CreateAlunoDto>
          name="estado"
          label="Estado"
          placeholder="Digite o estado"
          minLength={2}
          maxLength={2}
          required
        />

        {edit && <DateField<UpdateAlunoDto> name="suspensoAte" label="Suspenso até" />}

        {edit && (
          <NumberField<UpdateAlunoDto>
            name="faltas"
            label="Faltas"
            placeholder="Digite número de faltas"
            min={0}
            max={me.campus?.maximoDeFaltas}
            required
          />
        )}

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <CheckboxField<CreateAlunoDto> name="possuiNEE" label="Possui NEE">
            Possui Necessidades Educacionais Especiais (NEE)
          </CheckboxField>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <TextAreaField<CreateAlunoDto>
            name="observacoes"
            label="Observações"
            placeholder="Informações adicionais sobre o aluno"
          />
        </GridItem>
      </SimpleGrid>
    </BaseForm>
  )
}
