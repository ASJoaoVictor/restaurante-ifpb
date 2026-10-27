import { UserRolesItem } from '@/api/endpoints/api.schemas'
import { type Tokens } from '@chakra-ui/react'
import { type LinkProps } from '@tanstack/react-router'
import { type IconType } from 'react-icons'
import {
  RiBook2Line,
  RiDoorLine,
  RiHome2Line,
  RiImportLine,
  RiListCheck2,
  RiQrCodeLine,
  RiRestaurant2Line,
  RiUserAddLine,
  RiUserLine
} from 'react-icons/ri'

export interface MenuItem {
  url: LinkProps['to']
  label: string
  description: string
  icon: IconType
  color: Tokens['colors']
  borderColor: Tokens['colors']
  role?: UserRolesItem[]
  hideInAdmin?: boolean
}

export const menuList: MenuItem[] = [
  {
    label: 'Tela inicial',
    description: 'Página inicial do aluno',
    url: '/',
    icon: RiHome2Line,
    color: 'gray.50',
    borderColor: 'gray.200',
    role: ['aluno'],
    hideInAdmin: true
  },

  // EM BREVE
  // {
  //   label: 'Todas as Chamadas',
  //   description: 'Visualize todas as chamadas',
  //   url: '/chamadas',
  //   icon: RiListCheck2,
  //   color: 'gray.50',
  //   borderColor: 'gray.200',
  //   role: ['aluno']
  // },

  {
    label: 'Meu Perfil',
    description: 'Gerencie suas informações pessoais',
    url: '/meu-perfil',
    icon: RiUserLine,
    color: 'gray.50',
    borderColor: 'gray.200',
    role: ['aluno']
  },

  {
    label: 'Meu QR code',
    description: 'Visualize seu QR code',
    url: '/qrcode',
    icon: RiQrCodeLine,
    color: 'gray.50',
    borderColor: 'gray.200',
    role: ['aluno']
  },

  {
    label: 'Tela inicial',
    description: 'Página inicial',
    url: '/admin',
    icon: RiHome2Line,
    color: 'gray.50',
    borderColor: 'gray.200',
    role: ['admin', 'gestor', 'colaborador'],
    hideInAdmin: true
  },

  {
    label: 'Gerenciar Chamadas',
    description: 'Visualize e edite chamadas',
    url: '/admin/chamadas',
    icon: RiListCheck2,
    color: 'purple.50',
    borderColor: 'purple.200',
    role: ['admin', 'gestor']
  },

  {
    label: 'Gerenciar Chamadas',
    description: 'Visualize e marque presença nas chamadas',
    url: '/admin/chamadas',
    icon: RiListCheck2,
    color: 'purple.50',
    borderColor: 'purple.200',
    role: ['colaborador']
  },

  {
    label: 'Gerenciar Refeições',
    description: 'Controle refeições disponíveis',
    url: '/admin/refeicoes',
    icon: RiRestaurant2Line,
    color: 'orange.50',
    borderColor: 'orange.200',
    role: ['admin', 'gestor']
  },

  {
    label: 'Gerenciar Alunos',
    description: 'Visualize e edite alunos',
    url: '/admin/alunos',
    icon: RiUserLine,
    color: 'green.50',
    borderColor: 'green.200',
    role: ['admin']
  },

  {
    label: 'Gerenciar Alunos',
    description: 'Visualize e marque falta nos alunos',
    url: '/admin/alunos',
    icon: RiUserLine,
    color: 'green.50',
    borderColor: 'green.200',
    role: ['gestor']
  },

  {
    label: 'Gerenciar Usuários',
    description: 'Visualize e edite usuários do sistema',
    url: '/admin/usuarios',
    icon: RiUserAddLine,
    color: 'purple.50',
    borderColor: 'purple.200',
    role: ['admin']
  },

  {
    label: 'Gerenciar Turmas',
    description: 'Visualize e edite turmas',
    url: '/admin/turmas',
    icon: RiDoorLine,
    color: 'cyan.50',
    borderColor: 'cyan.200',
    role: ['admin']
  },

  {
    label: 'Gerenciar Cursos',
    description: 'Visualize e edite cursos',
    url: '/admin/cursos',
    icon: RiBook2Line,
    color: 'blue.50',
    borderColor: 'blue.200',
    role: ['admin']
  },

  {
    label: 'Importar Alunos do SUAP',
    description: 'Sincronize os dados do SUAP',
    url: '/admin/alunos/importar',
    icon: RiImportLine,
    color: 'pink.50',
    borderColor: 'pink.200',
    role: ['admin']
  }
]
