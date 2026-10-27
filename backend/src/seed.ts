import { reset, seed } from 'drizzle-seed'
import { db } from './drizzle/drizzle.module'
import * as schema from './drizzle/schemas'

const schemaTables = {
  alunos: schema.alunos,
  campi: schema.campi,
  refeicoes: schema.refeicoes,
  chamadas: schema.chamadas,
  cursos: schema.cursos,
  inscricoes: schema.inscricoes,
  turmas: schema.turmas,
  users: schema.users
} as const

async function main() {
  await reset(db, schema)

  await db.insert(schema.campi).values({
    id: '00000000-0000-0000-0000-000000000000',
    nome: 'IFPB - Campus Picuí',
    cidade: 'Picuí',
    estado: 'PB',
    maximoDeFaltas: 5
  })

  await db.insert(schema.users).values({
    id: '00000000-0000-0000-0000-000000000000',
    campusId: '00000000-0000-0000-0000-000000000000',
    name: 'Joe',
    email: 'joe@example.com',
    phone: '(11) 99999-9999',
    isAdmin: true
  })

  await seed(db, { ...schemaTables }).refine((funcs) => ({
    campi: {
      count: 3,
      columns: {
        nome: funcs.companyName(),
        cidade: funcs.city(),
        estado: funcs.state(),
        maximoDeFaltas: funcs.int({ minValue: 1, maxValue: 10 })
      },
      with: {
        users: 3,
        cursos: 3,
        turmas: 3,
        chamadas: 6,
        refeicoes: 2
      }
    },

    alunos: {
      count: 10,
      columns: {
        matricula: funcs.int({ minValue: 202312000001, maxValue: 202313000999 }),
        faltas: funcs.weightedRandom([
          { weight: 0.7, value: funcs.default({ defaultValue: 0 }) },
          { weight: 0.25, value: funcs.int({ minValue: 1, maxValue: 3 }) },
          { weight: 0.05, value: funcs.int({ minValue: 4, maxValue: 5 }) }
        ]),
        suspensoAte: funcs.weightedRandom([
          { weight: 0.9, value: funcs.default({ defaultValue: null }) },
          { weight: 0.1, value: funcs.date({ minDate: new Date(2025, 0, 1), maxDate: new Date(2025, 11, 31) }) }
        ]),
        observacoes: funcs.weightedRandom([
          { weight: 0.8, value: funcs.default({ defaultValue: null }) },
          { weight: 0.2, value: funcs.loremIpsum({ sentencesCount: 10 }) }
        ]),
        cidade: funcs.city(),
        estado: funcs.state()
      }
    },

    users: {
      with: { alunos: 1 }
    }

    // TODO: Configurar as tabelas restantes
  }))
}

void main()
