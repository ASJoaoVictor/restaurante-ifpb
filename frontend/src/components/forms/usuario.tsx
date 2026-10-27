import { CreateUserDto, User } from '@/api/endpoints/api.schemas'
import { BaseForm } from './components/base-form'
import { CheckboxField, EmailField, TextField } from '../fields/common/basic-fields'
import { SimpleGrid } from '@chakra-ui/react'
import { useUsersCreate, useUsersUpdate } from '@/api/endpoints/users'
import { PhoneField } from '../fields/common/phone.field'

export function UsuarioForm({ edit }: { edit?: User }) {
  const createMutation = useUsersCreate()
  const updateMutation = useUsersUpdate()

  return (
    <BaseForm
      edit={edit}
      createMutation={createMutation}
      updateMutation={updateMutation}
      successRedirectPath="/admin/usuarios"
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        <TextField<CreateUserDto> name="name" label="Nome" required autoFocus />
        <EmailField<CreateUserDto> name="email" label="Email" required />
        <PhoneField<CreateUserDto> name="phone" label="Telefone" placeholder="(xx) xxxxx-xxxx" required />

        <CheckboxField<CreateUserDto> name="isAdmin" label="Administrador">
          Concede permissões administrativas ao usuário
        </CheckboxField>

        <CheckboxField<CreateUserDto> name="isGestor" label="Gestor">
          Concede permissões de gerenciamento de chamadas
        </CheckboxField>

        <CheckboxField<CreateUserDto> name="isColaborador" label="Colaborador">
          Permite acesso a frequência de chamadas
        </CheckboxField>
      </SimpleGrid>
    </BaseForm>
  )
}
