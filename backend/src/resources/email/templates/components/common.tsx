import { Column, Img, Link, Row } from '@react-email/components'
import classNames from 'classnames'
import React, { PropsWithChildren } from 'react'
import { env } from '../../../../config/env.config'

export function emailImgURL(iconName: string) {
  return `${env.BACKEND_APP_URL}/api/public/${iconName}`
}

export function Divider(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={classNames('border-b-gray-200', 'border-0', 'border-b', 'border-solid', 'my-5', props.className)}
    />
  )
}

export function Table(props: React.ComponentProps<'table'> & { caption?: React.ReactNode }) {
  return (
    <div
      className={classNames(
        'relative',
        'overflow-x-auto',
        'rounded-lg',
        'border',
        'border-solid',
        'border-gray-200',
        'my-6',
        'zoom-70',
        'sm_zoom-100'
      )}
    >
      {props.caption}
      <table
        {...props}
        className={classNames(
          'w-full',
          'text-sm',
          'text-center',
          'text-gray-500',
          'border',
          'border-gray-200',
          'border-collapse',
          props.className
        )}
      />
    </div>
  )
}

export function Tr(props: React.ComponentProps<'tr'>) {
  return <tr {...props} className={classNames(props.className)} />
}

export function Th(props: React.ComponentProps<'th'>) {
  return (
    <th
      {...props}
      scope="col"
      className={classNames('px-3', 'py-2', 'md_px-4', 'md_py-3', 'uppercase', props.className)}
    />
  )
}

export function Td(props: React.ComponentProps<'td'>) {
  return (
    <td
      {...props}
      className={classNames('border', 'border-solid', 'border-gray-200', 'px-3', 'py-2', 'md_px-4', props.className)}
    />
  )
}

export function Thead(props: React.ComponentProps<'thead'>) {
  return (
    <thead {...props} className={classNames('text-xs', 'text-gray-700', 'uppercase', 'bg-gray-50', props.className)} />
  )
}

export function Tbody(props: React.ComponentProps<'tbody'>) {
  return <tbody {...props} className={classNames(props.className)} />
}

export function Tfoot(props: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot {...props} className={classNames('text-xs', 'text-gray-700', 'uppercase', 'bg-gray-50', props.className)} />
  )
}

export function A(props: React.ComponentProps<'a'>) {
  return <a {...props} className={classNames('font-medium', 'text-blue-600', props.className)} />
}

export function Caption(props: {
  children: React.ReactNode
  iconName: string
  buttonText: string
  buttonURL: string
  buttonColor: string
  noButton?: boolean
}) {
  return (
    <div
      className={classNames(
        'p-3',
        'text-lg',
        'font-semibold',
        'text-center',
        'md_text-left',
        'text-gray-900',
        'bg-white',
        'uppercase',
        'bg-gray-50'
      )}
    >
      <table>
        <tr>
          <td>
            <Img src={emailImgURL('icons/' + props.iconName)} height={24} className="mr-2" />
          </td>
          <td className="w-full text-left">{props.children}</td>
          {!props.noButton && (
            <td>
              <a
                href={props.buttonURL}
                className={classNames(
                  'no-underline',
                  'px-3',
                  'py-2',
                  'text-xs',
                  'font-medium',
                  'text-white',
                  `bg-${props.buttonColor}-700`,
                  'rounded-full',
                  'whitespace-nowrap'
                )}
              >
                {props.buttonText}
              </a>
            </td>
          )}
        </tr>
      </table>
    </div>
  )
}

export function Acao({ color, icon, children }: { color: string; icon: string } & PropsWithChildren) {
  return (
    <Row
      width={0}
      className={classNames(
        'border',
        'border-solid',
        `border-${color}-700`,
        'font-medium',
        'rounded-full',
        'px-2',
        'pr-3',
        'py-1',
        'text-lg',
        `text-${color}-700`
      )}
    >
      <Column>
        <Img src={emailImgURL(icon)} width={24} height={24} />
      </Column>
      <Column className={classNames('pl-2')}>{children}</Column>
    </Row>
  )
}

export function MainAction(
  props: { buttonText: string; buttonURL: string; buttonColor: string } & React.ComponentProps<'a'>
) {
  const { buttonText, buttonURL, buttonColor, ...rest } = props
  return (
    <Link
      href={buttonURL}
      {...rest}
      className={classNames(
        `bg-${buttonColor}-700`,
        'font-medium',
        'rounded-full',
        'px-6',
        'py-3',
        'text-lg',
        'text-white',
        props.className
      )}
    >
      {buttonText}
    </Link>
  )
}
