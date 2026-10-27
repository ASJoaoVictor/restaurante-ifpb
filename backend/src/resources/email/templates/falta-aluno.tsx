import { Heading, Img, Text } from '@react-email/components'
import classNames from 'classnames'
import React from 'react'
import { Aluno } from '../../alunos/entities/aluno.entity'
import { emailImgURL } from './components/common'
import EmailLayout from './components/layout'

export function FaltaAlunoEmail({
  aluno,
  maximoDeFaltas
}: {
  aluno: Omit<Aluno, 'refeicoesRestritas'>
  maximoDeFaltas: number
}) {
  const preview = `Você possui ${aluno.faltas}/${maximoDeFaltas} faltas no restaurante estudantil`

  return (
    <EmailLayout preview={preview}>
      <Img src={emailImgURL('img/logo.png')} alt="IFPB Meals Logo" height={48} className={classNames('mb-8')} />

      <Heading as="h1">
        Você possui {aluno.faltas}/{maximoDeFaltas} faltas no restaurante estudantil!
      </Heading>

      <Text className={classNames('text-lg')}>
        Fique atento! Ao atingir {maximoDeFaltas} faltas, você será suspenso do uso do restaurante por um mês e não
        poderá realizar novas inscrições durante esse período.
      </Text>
    </EmailLayout>
  )
}
