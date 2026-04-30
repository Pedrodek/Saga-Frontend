import { createContext, useContext, useState, type ReactNode } from 'react'

export type GradeEntry = {
  id: number
  course: string
  discipline: string
  time: string
  className: string
  teacher: string
  room: string
  join: string
  students: number
  period: 'Matutino' | 'Vespertino' | 'Diurno' | 'Noite'
  day: 'Anterior' | 'Atual' | 'Posterior'
  hasClass: boolean
}

type GradeContextType = {
  gradeEntries: GradeEntry[]
  setGradeEntries: React.Dispatch<React.SetStateAction<GradeEntry[]>>
}

const GradeContext = createContext<GradeContextType | undefined>(undefined)

const initialGradeEntries: GradeEntry[] = [
  {
    id: 1,
    course: 'Gestão',
    discipline: 'Administração Financeira',
    time: '19:30 - 21:10',
    className: 'G1',
    teacher: 'Prof. Silva',
    room: 'Sala 12 / Prédio A',
    join: 'Não',
    students: 28,
    period: 'Noite',
    day: 'Atual',
    hasClass: true,
  },
  {
    id: 2,
    course: 'Gestão',
    discipline: 'Matemática',
    time: '19:30 - 21:10',
    className: 'G2',
    teacher: 'Prof. Souza',
    room: 'Sala 14 / Prédio A',
    join: 'Sim',
    students: 30,
    period: 'Noite',
    day: 'Atual',
    hasClass: true,
  },
  {
    id: 3,
    course: 'Informática',
    discipline: 'Redes de Computadores',
    time: '13:00 - 15:00',
    className: 'TI2',
    teacher: 'Profª Lima',
    room: 'Lab 4 / Prédio B',
    join: 'Sim',
    students: 24,
    period: 'Vespertino',
    day: 'Atual',
    hasClass: true,
  },
  {
    id: 4,
    course: 'Informática',
    discipline: 'Programação Web',
    time: '13:00 - 15:00',
    className: 'TI3',
    teacher: 'Profª Lima',
    room: 'Lab 5 / Prédio B',
    join: 'Não',
    students: 26,
    period: 'Vespertino',
    day: 'Atual',
    hasClass: false,
  },
  {
    id: 5,
    course: 'Saúde',
    discipline: 'Nutrição Básica',
    time: '08:00 - 10:00',
    className: 'S1',
    teacher: 'Profª Rosa',
    room: 'Sala 3 / Prédio C',
    join: 'Não',
    students: 20,
    period: 'Matutino',
    day: 'Atual',
    hasClass: true,
  },
  {
    id: 6,
    course: 'Saúde',
    discipline: 'Anatomia',
    time: '08:00 - 10:00',
    className: 'S2',
    teacher: 'Prof. Carlos',
    room: 'Sala 4 / Prédio C',
    join: 'Não',
    students: 22,
    period: 'Matutino',
    day: 'Atual',
    hasClass: false,
  },
  {
    id: 7,
    course: 'Gestão',
    discipline: 'Gestão de Pessoas',
    time: '08:00 - 10:00',
    className: 'G1',
    teacher: 'Prof. Silva',
    room: 'Sala 11 / Prédio A',
    join: 'Sim',
    students: 28,
    period: 'Matutino',
    day: 'Anterior',
    hasClass: true,
  },
  {
    id: 8,
    course: 'Informática',
    discipline: 'Banco de Dados',
    time: '15:30 - 17:30',
    className: 'TI2',
    teacher: 'Profª Lima',
    room: 'Lab 4 / Prédio B',
    join: 'Não',
    students: 24,
    period: 'Diurno',
    day: 'Posterior',
    hasClass: true,
  },
]

export function GradeProvider({ children }: { children: ReactNode }) {
  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>(initialGradeEntries)

  return (
    <GradeContext.Provider value={{ gradeEntries, setGradeEntries }}>
      {children}
    </GradeContext.Provider>
  )
}

export function useGrade() {
  const context = useContext(GradeContext)
  if (!context) {
    throw new Error('useGrade must be used within GradeProvider')
  }
  return context
}
