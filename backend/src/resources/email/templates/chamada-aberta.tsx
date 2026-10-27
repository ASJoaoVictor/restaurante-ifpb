import { Heading, Img, Section, Text } from '@react-email/components'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React from 'react'
import { env } from '../../../config/env.config'
import { timeAdverb } from '../../../utils/date'
import { Chamada } from '../../chamadas/entities/chamada.entity'
import { emailImgURL, MainAction } from './components/common'
import EmailLayout from './components/layout'

export function ChamadaAbertaEmail({ chamada }: { chamada: Chamada }) {
  const timeAdverbResult = timeAdverb(chamada.data)
  const formattedDate = <strong key={0}>{dayjs(chamada.data).format('DD [de] MMMM')}</strong>
  const dateDescription = timeAdverbResult
    ? ['de ', <strong key={1}>{timeAdverbResult}</strong>, ', dia ', formattedDate]
    : ['do dia ', formattedDate]

  const preview = `Inscrições abertas para o ${chamada.nome} de ${dayjs(chamada.data).format('DD [de] MMMM')}`

  return (
    <EmailLayout preview={preview}>
      <Img src={emailImgURL('img/logo.png')} alt="IFPB Meals Logo" height={48} className={classNames('mb-8')} />

      <Heading as="h1">
        Inscrições abertas para o <u>{chamada.nome}</u>!
      </Heading>

      <Text className={classNames('text-lg')}>
        Garanta sua vaga para o <u>{chamada.nome}</u> {dateDescription}.
      </Text>

      {chamada.vagas !== null && <Text className={classNames('text-md')}>👉 Vagas limitadas, inscreva-se já!</Text>}

      <div className={classNames('my-8')}>
        <MainAction buttonText="INSCREVER" buttonColor="sky" buttonURL={env.APP_URL} />
      </div>

      {!!(
        chamada.dataHoraAbertura ||
        chamada.dataHoraFechamento ||
        chamada.dataHoraDivulgacaoResultado ||
        chamada.dataHoraFinalizacao
      ) && (
        <Section>
          <Heading as="h3">📅 Datas importantes</Heading>
          {chamada.dataHoraAbertura && (
            <Text>
              <strong>Abertura das inscrições:</strong> {formatHumanDate(chamada.dataHoraAbertura)}
              <br />
              <span className={classNames('text-gray-500', 'text-xs')}>
                Momento em que as inscrições ficam disponíveis
              </span>
            </Text>
          )}

          {chamada.dataHoraFechamento && (
            <Text>
              <strong>Fechamento das inscrições:</strong> {formatHumanDate(chamada.dataHoraFechamento)}
              <br />
              <span className={classNames('text-gray-500', 'text-xs')}>
                Após esse horário não é possível inscrever, mas ainda pode cancelar
              </span>
            </Text>
          )}

          {chamada.dataHoraDivulgacaoResultado && (
            <Text>
              <strong>Divulgação do resultado:</strong> {formatHumanDate(chamada.dataHoraDivulgacaoResultado)}
              <br />
              <span className={classNames('text-gray-500', 'text-xs')}>Lista de alunos contemplados será publicada</span>
            </Text>
          )}

          {chamada.dataHoraFinalizacao && (
            <Text>
              <strong>Finalização da chamada:</strong> {formatHumanDate(chamada.dataHoraFinalizacao)}
              <br />
              <span className={classNames('text-gray-500', 'text-xs')}>
                A partir desse horário não será mais possível cancelar
              </span>
            </Text>
          )}

          {/* Data de encerramento para o aluno é irrelevante */}
        </Section>
      )}
    </EmailLayout>
  )
}

function formatHumanDate(date: string) {
  const timeAdverbResult = timeAdverb(date)
  const formattedDate = dayjs(date).format('DD [de] MMMM, [às] HH:mm')
  return [timeAdverbResult, formattedDate].filter(Boolean).join(', ')
}
