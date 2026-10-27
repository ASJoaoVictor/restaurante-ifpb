import { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import { readFileSync } from 'fs'
import path from 'path'
import React from 'react'
import { Chamada } from '../entities/chamada.entity'
import { pdfStyles as styles } from './inscricoes-pdf.styles'

const FONT_REGULAR = require.resolve('@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff')
const FONT_BOLD = require.resolve('@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff')
const LOGO = readFileSync(path.resolve('public/img/logo.png'))
const ROWS_PER_PAGE = 32

Font.register({
  family: 'Open Sans',
  fonts: [
    { fontWeight: 400, src: FONT_REGULAR },
    { fontWeight: 700, src: FONT_BOLD }
  ]
})

Font.registerHyphenationCallback((word) => [word])

export interface InscricoesPdfRow {
  id: string
  badges: string[]
  name: string
}

interface Props {
  chamada: Chamada
  rows: InscricoesPdfRow[]
  title: string
  totalContemplados: number
}

export function InscricoesPdfDocument({ chamada, rows, title, totalContemplados }: Props) {
  const pageCount = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE))
  const paddedRows = Array.from({ length: pageCount * ROWS_PER_PAGE }, (_, index) => rows[index] ?? null)
  const pages = chunk(paddedRows, ROWS_PER_PAGE)
  const hasNee = rows.some((row) => row.badges.includes('NEE*'))

  return (
    <Document
      author="IFPB Meals"
      creator="IFPB Meals - Restaurante Estudantil"
      producer="IFPB Meals - Restaurante Estudantil"
      subject={chamada.nome}
      title={title}
    >
      {pages.map((pageRows, pageIndex) => (
        <Page key={pageIndex} orientation="portrait" size="A4" style={styles.page}>
          <Header chamada={chamada} title={title} />
          <Table ordinalOffset={pageIndex * ROWS_PER_PAGE} rows={pageRows} />
          <Footer
            chamada={chamada}
            currentPage={pageIndex + 1}
            hasNee={hasNee}
            totalContemplados={totalContemplados}
            totalPages={pages.length}
          />
        </Page>
      ))}
    </Document>
  )
}

function Header({ chamada, title }: { chamada: Chamada; title: string }) {
  const formattedDate = dayjs(chamada.data).locale('pt-br').format('dddd (DD/MM/YYYY)')
  const date = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <>
      <View style={styles.header}>
        <View style={styles.brand}>
          <Image src={LOGO} style={styles.brandLogo} />
        </View>
        <View style={styles.callInfo}>
          <Text style={styles.callName}>{chamada.nome}</Text>
          <Text style={styles.callDate}>{date}</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
    </>
  )
}

function Table({ rows, ordinalOffset }: { rows: (InscricoesPdfRow | null)[]; ordinalOffset: number }) {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.cell, styles.headerCell, styles.ordinalCell]}>ORD</Text>
        <Text style={[styles.cell, styles.headerCell, styles.nameCell]}>ALUNO(A)</Text>
        <Text style={[styles.cell, styles.headerCell, styles.markCell]}>P</Text>
        <Text style={[styles.cell, styles.headerCell, styles.markCell, styles.lastCell]}>F</Text>
      </View>
      {rows.map((row, index) => (
        <View key={row?.id ?? `empty-${index}`} style={styles.tableRow}>
          <View style={[styles.cell, styles.ordinalCell]}>
            <Text style={styles.ordinal}>{row ? String(ordinalOffset + index + 1).padStart(2, '0') : ''}</Text>
          </View>
          <View style={[styles.cell, styles.nameCell]}>
            {row && (
              <View style={styles.nameContent}>
                <Text style={styles.name}>{row.name}</Text>
                <View style={styles.badges}>
                  {row.badges.map((badge) => (
                    <Text key={badge} style={styles.badge}>
                      {badge}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
          <View style={[styles.cell, styles.markCell]} />
          <View style={[styles.cell, styles.markCell, styles.lastCell]} />
        </View>
      ))}
    </View>
  )
}

function Footer({
  chamada,
  currentPage,
  hasNee,
  totalContemplados,
  totalPages
}: {
  chamada: Chamada
  currentPage: number
  hasNee: boolean
  totalContemplados: number
  totalPages: number
}) {
  const ratio = chamada.vagas ? Math.min(totalContemplados / chamada.vagas, 1) : 0
  const occupancy = chamada.vagas
    ? `${totalContemplados}/${chamada.vagas} vagas preenchidas`
    : `${totalContemplados} contemplados`

  return (
    <View style={styles.footer}>
      {hasNee && <Text style={styles.legend}>* NEE — Necessidades Educacionais Específicas</Text>}
      <View style={styles.footerRow}>
        <View style={styles.progress}>
          <View style={[styles.progressValue, { width: `${ratio * 100}%` }]} />
        </View>
        <Text style={styles.occupancy}>{occupancy}</Text>
        <Text style={styles.pageNumber}>
          Página {currentPage} / {totalPages}
        </Text>
      </View>
    </View>
  )
}

function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  )
}
