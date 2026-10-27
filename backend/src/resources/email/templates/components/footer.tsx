import { Img, Link } from '@react-email/components'
import * as React from 'react'
import { env } from '../../../../config/env.config'
import { Divider, emailImgURL } from './common'
import classNames from 'classnames'

export default function EmailFooter() {
  return (
    <>
      <Divider />

      <div className="text-gray-400 text-xs">
        <div className="text-center">
          Este e-mail foi enviado automaticamente pelo sistema. Por favor, não responda a este e-mail.
        </div>

        <div className="text-center">
          Você está recebendo este e-mail porque está cadastrado(a) no{' '}
          <Link href={env.APP_URL} className="underline text-inherit">
            IFPB Meals
          </Link>
        </div>
      </div>

      <Divider />

      <Img src={emailImgURL('img/logo.png')} alt="IFPB Meals Logo" height={36} className={classNames('mb-1')} />

      <div className="mt-2 text-xs">{new Date().getFullYear()} - IFPB - Campus Picuí</div>
    </>
  )
}
