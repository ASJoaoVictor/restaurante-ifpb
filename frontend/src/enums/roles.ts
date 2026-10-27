import { UserRolesItem } from '@/api/endpoints/api.schemas'

export const ROLES: Record<UserRolesItem, string> = {
  admin: 'Administrador',
  gestor: 'Gestor',
  colaborador: 'Colaborador',
  aluno: 'Aluno'
}
