import { Aluno } from '@/api/endpoints/api.schemas'
import dayjs from 'dayjs'

export function isSuspenso(aluno: Pick<Aluno, 'suspensoAte'>) {
  return aluno.suspensoAte && dayjs().isSameOrBefore(aluno.suspensoAte, 'day')
}
