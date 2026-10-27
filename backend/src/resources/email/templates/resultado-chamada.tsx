import { Heading, Img, Text } from '@react-email/components'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React from 'react'
import { env } from '../../../config/env.config'
import { timeAdverb } from '../../../utils/date'
import { Chamada } from '../../chamadas/entities/chamada.entity'
import { emailImgURL, MainAction } from './components/common'
import EmailLayout from './components/layout'

export function ResultadoChamadaEmail({ chamada }: { chamada: Chamada }) {
  const timeAdverbResult = timeAdverb(chamada.data)
  const formattedDate = <strong key={0}>{dayjs(chamada.data).format('DD [de] MMMM')}</strong>
  const dateDescription = timeAdverbResult
    ? ['de ', <strong key={1}>{timeAdverbResult}</strong>, ', dia ', formattedDate]
    : ['do dia ', formattedDate]

  const preview = `Resultado divulgado para o ${chamada.nome} de ${dayjs(chamada.data).format('DD [de] MMMM')}`

  return (
    <EmailLayout preview={preview}>
      <Img src={emailImgURL('img/logo.png')} alt="IFPB Meals Logo" height={48} className={classNames('mb-8')} />

      <Heading as="h1">
        Resultado divulgado para o <u>{chamada.nome}</u>!
      </Heading>

      <Text className={classNames('text-lg')}>
        Veja se você conseguiu sua vaga no <u>{chamada.nome}</u> {dateDescription}.
      </Text>

      <div className={classNames('my-8')}>
        <MainAction
          buttonText="ACESSE A LISTA DE CONTEMPLADOS"
          buttonColor="green"
          buttonURL={`${env.APP_URL}/resultado/${chamada.id}`}
        />
      </div>
    </EmailLayout>
  )
}
