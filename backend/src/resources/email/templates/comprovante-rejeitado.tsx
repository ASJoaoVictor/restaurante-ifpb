import { Heading, Img, Text } from '@react-email/components'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React from 'react'
import { InscricaoComAlunoEChamada } from '../../inscricoes/entities/inscricao.entity'
import { emailImgURL } from './components/common'
import EmailLayout from './components/layout'

export function ComprovanteRejeitadoEmail({ inscricao }: { inscricao: InscricaoComAlunoEChamada }) {
  const preview = `O comprovante que você enviou para o ${inscricao.chamada.nome} do dia ${dayjs(inscricao.chamada.data).format('DD [de] MMMM')} foi rejeitado`

  return (
    <EmailLayout preview={preview}>
      <Img src={emailImgURL('img/logo.png')} alt="IFPB Meals Logo" height={48} className={classNames('mb-8')} />

      <Heading as="h1">Comprovante rejeitado</Heading>

      <Text className={classNames('text-lg')}>
        O comprovante que você enviou para o <u>{inscricao.chamada.nome}</u> do dia{' '}
        {dayjs(inscricao.chamada.data).format('DD [de] MMMM')} foi rejeitado. Você ainda pode concorrer a uma vaga, mas
        sua posição na fila será a mesma de uma inscrição sem contraturno.
      </Text>

      {inscricao.inscricao.justificativaRejeicaoComprovanteContraturno && (
        <>
          <Heading as="h2">Justificativa da rejeição</Heading>
          <Text>
            <i>{inscricao.inscricao.justificativaRejeicaoComprovanteContraturno}</i>
          </Text>
        </>
      )}
    </EmailLayout>
  )
}
