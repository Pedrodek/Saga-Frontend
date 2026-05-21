import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { sagaApi, type AgendamentoDTO } from '../services/api'

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
  day: string // 'SEGUNDA' | 'TERCA' | ... or 'Atual' for CSV imports
  hasClass: boolean
}

type GradeContextType = {
  gradeEntries: GradeEntry[]
  setGradeEntries: React.Dispatch<React.SetStateAction<GradeEntry[]>>
  loading: boolean
  refreshEntries: () => Promise<void>
}

const GradeContext = createContext<GradeContextType | undefined>(undefined)

function inferPeriodFromTime(horaInicio: string): GradeEntry['period'] {
  // horaInicio comes as ISO string like "1970-01-01T08:00:00.000Z"
  const date = new Date(horaInicio)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const totalMinutes = hours * 60 + minutes

  if (totalMinutes >= 480 && totalMinutes < 720) return 'Matutino'       // 08:00 - 12:00
  if (totalMinutes >= 780 && totalMinutes < 930) return 'Vespertino'     // 13:00 - 15:30
  if (totalMinutes >= 930 && totalMinutes < 1080) return 'Diurno'        // 15:30 - 18:00
  return 'Noite'                                                         // 19:00+
}

function formatTime(horaInicio: string, horaFim: string): string {
  const fmt = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
  }
  return `${fmt(horaInicio)} - ${fmt(horaFim)}`
}

function agendamentoToGradeEntry(ag: AgendamentoDTO): GradeEntry {
  return {
    id: ag.id_agendamento,
    course: ag.turma.curso.codigo_curso,
    discipline: ag.turma.codigo_turma,
    time: formatTime(ag.hora_inicio, ag.hora_fim),
    className: ag.turma.codigo_turma,
    teacher: ag.professor.nome,
    room: `${ag.sala.numero_sala} / ${ag.sala.predio.nome}`,
    join: 'Não',
    students: ag.turma.quantidade ?? 0,
    period: inferPeriodFromTime(ag.hora_inicio),
    day: ag.dia_semana,
    hasClass: true,
  }
}

export function GradeProvider({ children }: { children: ReactNode }) {
  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    try {
      const agendamentos = await sagaApi.agendamentos.getAll()
      setGradeEntries(agendamentos.map(agendamentoToGradeEntry))
    } catch (err) {
      console.warn('Não foi possível carregar agendamentos do backend:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  return (
    <GradeContext.Provider value={{ gradeEntries, setGradeEntries, loading, refreshEntries: fetchEntries }}>
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
