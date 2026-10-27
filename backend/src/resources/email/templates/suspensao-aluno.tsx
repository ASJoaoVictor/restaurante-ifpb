import { Heading, Img, Text } from '@react-email/components'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React from 'react'
import { Aluno } from '../../alunos/entities/aluno.entity'
import { emailImgURL } from './components/common'
import EmailLayout from './components/layout'

export function SuspensaoAlunoEmail({
  aluno,
  maximoDeFaltas,
  diasDeSuspensao
}: {
  aluno: Omit<Aluno, 'refeicoesRestritas'>
  maximoDeFaltas: number
  diasDeSuspensao: number
}) {
  const preview = `Você foi suspenso do restaurante estudantil por ${diasDeSuspensao} dias devido ao acúmulo de ${maximoDeFaltas} faltas.`

  return (
    <EmailLayout preview={preview}>
      <Img src={emailImgURL('img/logo.png')} alt="IFPB Meals Logo" height={48} className={classNames('mb-8')} />

      <Heading as="h1">Você foi suspenso do restaurante estudantil por {diasDeSuspensao} dias.</Heading>

      <Text className={classNames('text-lg')}>
        Você atingiu o número máximo de faltas permitidas ({maximoDeFaltas}) no restaurante estudantil. Até{' '}
        <b>{dayjs(aluno.suspensoAte).format('DD/MM/YYYY')}</b>, você não poderá realizar novas inscrições.
      </Text>
    </EmailLayout>
  )
}
