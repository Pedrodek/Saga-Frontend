import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Clock,
  Moon,
  AlertTriangle,
  CheckCircle2,
  Users,
  BookOpen,
  Loader2,
  Trash2
} from 'lucide-react'
import { useGrade } from '../context/GradeContext'
import { NovoAgendamentoDialog } from './NovoAgendamentoDialog'
import { sagaApi } from '../services/api'
import { toast } from 'sonner'

const periodConfig = [
  { name: 'Matutino' as const, time: '08:00 - 10:00', icon: Sun, color: 'text-amber-500' },
  { name: 'Vespertino' as const, time: '13:00 - 15:00', icon: Sunset, color: 'text-orange-500' },
  { name: 'Diurno' as const, time: '15:30 - 17:30', icon: Clock, color: 'text-blue-500' },
  { name: 'Noite' as const, time: '19:30 - 21:10', icon: Moon, color: 'text-indigo-500' },
]

const WEEKDAYS = [
  { key: 'DOMINGO', label: 'Domingo', jsDay: 0 },
  { key: 'SEGUNDA', label: 'Segunda-feira', jsDay: 1 },
  { key: 'TERCA', label: 'Terça-feira', jsDay: 2 },
  { key: 'QUARTA', label: 'Quarta-feira', jsDay: 3 },
  { key: 'QUINTA', label: 'Quinta-feira', jsDay: 4 },
  { key: 'SEXTA', label: 'Sexta-feira', jsDay: 5 },
  { key: 'SABADO', label: 'Sábado', jsDay: 6 },
]

export function Agendamento() {
  const { gradeEntries, loading, refreshEntries } = useGrade()
  const [dayOffset, setDayOffset] = useState(0)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const today = new Date()
  const currentDate = new Date(today)
  currentDate.setDate(today.getDate() + dayOffset)
  const currentWeekdayIdx = currentDate.getDay() // 0=Dom, 6=Sáb

  const currentWeekday = WEEKDAYS[currentWeekdayIdx]

  // Limites: Domingo (início da semana) e Sábado (fim da semana)
  const todayWeekday = today.getDay()
  const minOffset = -todayWeekday       // Voltar até Domingo
  const maxOffset = 6 - todayWeekday    // Avançar até Sábado

  const canGoPrev = dayOffset > minOffset
  const canGoNext = dayOffset < maxOffset

  const getFormattedDate = () => {
    const day = String(currentDate.getDate()).padStart(2, '0')
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    return `${day}/${month}`
  }

  const getDayLabel = () => {
    const name = currentWeekday.label
    if (dayOffset === 0) return `${name} (Hoje)`
    return `${name}, ${getFormattedDate()}`
  }

  // Filtrar entries pelo dia da semana atual (usando a key do backend: SEGUNDA, TERCA, etc.)
  const currentEntries = gradeEntries.filter((entry) => entry.day === currentWeekday.key)

  const getPeriodStats = (periodName: string) => {
    const entries = currentEntries.filter((entry) => entry.period === periodName)
    const totalEntries = entries.length
    const activeEntries = entries.filter((e) => e.hasClass).length
    const activeCourses = new Set(
      entries.filter((e) => e.hasClass).map((e) => e.course)
    ).size

    const courseGroups = entries.reduce<Record<string, boolean[]>>((acc, entry) => {
      acc[entry.course] = [...(acc[entry.course] ?? []), entry.hasClass]
      return acc
    }, {})

    const fullyActiveCourses = Object.values(courseGroups).filter((list) =>
      list.every(Boolean)
    ).length

    return {
      totalEntries,
      activeEntries,
      courseCount: activeCourses,
      fullyActiveCourses,
    }
  }

  const absentClasses = currentEntries.filter((entry) => !entry.hasClass)

  // Weekday labels for prev/next buttons
  const prevWeekdayIdx = currentWeekdayIdx - 1
  const nextWeekdayIdx = currentWeekdayIdx + 1
  const prevWeekdayLabel = prevWeekdayIdx >= 0 ? WEEKDAYS[prevWeekdayIdx].label : null
  const nextWeekdayLabel = nextWeekdayIdx <= 6 ? WEEKDAYS[nextWeekdayIdx].label : null

  const handleDelete = async (id: number) => {
    if (!confirm('Remover este agendamento?')) return
    setDeletingId(id)
    try {
      await sagaApi.agendamentos.remove(id)
      toast.success('Agendamento removido')
      refreshEntries()
    } catch {
      toast.error('Erro ao remover agendamento')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#1E3A8A', fontWeight: 700, fontSize: '24px', margin: 0 }}>Agendamento</h1>
          <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>
            Visualização da grade e da semana de aulas — Carrossel de Aulas da Semana
          </p>
        </div>
        <NovoAgendamentoDialog onCreated={refreshEntries} />
      </div>

      {/* Navegação Temporal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Navegação por Dia
          </CardTitle>
          <CardDescription>
            Navegue entre os dias da semana (Domingo a Sábado)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setDayOffset(dayOffset - 1)}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {prevWeekdayLabel ?? 'Domingo'}
            </Button>
            <Badge variant="default" className="text-base px-4 py-2">
              {getDayLabel()}
            </Badge>
            <Button
              variant="outline"
              onClick={() => setDayOffset(dayOffset + 1)}
              disabled={!canGoNext}
            >
              {nextWeekdayLabel ?? 'Sábado'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#1E3A8A' }} />
          <span className="ml-3 text-muted-foreground">Carregando agendamentos...</span>
        </div>
      )}

      {/* Carrossel de Períodos */}
      {!loading && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {periodConfig.map((period) => {
              const stats = getPeriodStats(period.name)
              const PeriodIcon = period.icon
              return (
                <Card
                  key={period.name}
                  style={{ cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,138,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '' }}
                  onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
                  onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <PeriodIcon className={`h-5 w-5 ${period.color}`} />
                      {period.name}
                    </CardTitle>
                    <CardDescription>{period.time}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {stats.courseCount} curso{stats.courseCount !== 1 ? 's' : ''} com aula
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3" />
                        <span>{stats.totalEntries} turma{stats.totalEntries !== 1 ? 's' : ''} neste período</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span>{stats.activeEntries} com aula confirmada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>{stats.fullyActiveCourses} curso{stats.fullyActiveCourses !== 1 ? 's' : ''} com todas as turmas em aula</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Lista de Turmas Sem Aula */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Lista de Turmas que Não Terão Aula
              </CardTitle>
              <CardDescription>
                Turmas identificadas sem aula no {getDayLabel().toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentEntries.length === 0 ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Sem agendamentos</AlertTitle>
                  <AlertDescription>
                    Nenhum agendamento encontrado para {getDayLabel().toLowerCase()}.
                    {currentWeekdayIdx === 0 || currentWeekdayIdx === 6
                      ? ' (fim de semana)'
                      : ' Importe dados no Grade Horário ou execute o seed no backend.'}
                  </AlertDescription>
                </Alert>
              ) : absentClasses.length === 0 ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Tudo certo</AlertTitle>
                  <AlertDescription>
                    Todas as {currentEntries.length} turma{currentEntries.length !== 1 ? 's' : ''} têm aula neste dia. Nenhuma ausência identificada.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{absentClasses.length} turma{absentClasses.length !== 1 ? 's' : ''} sem aula</AlertTitle>
                    <AlertDescription>
                      As turmas abaixo não terão aula no {getDayLabel().toLowerCase()}.
                      Verifique a causa raiz (ex: falta de professor ou conflito de sala).
                    </AlertDescription>
                  </Alert>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Curso</TableHead>
                        <TableHead>Disciplina</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead>Professor</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Alunos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {absentClasses.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell>
                            <Badge variant="outline">{cls.course}</Badge>
                          </TableCell>
                          <TableCell>{cls.discipline}</TableCell>
                          <TableCell className="font-medium">{cls.className}</TableCell>
                          <TableCell>{cls.teacher}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{cls.period}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {cls.students}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Tabela de Aulas do Dia ── */}
          {currentEntries.filter(e => e.hasClass).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Aulas do Dia — {getDayLabel()}
                </CardTitle>
                <CardDescription>
                  {currentEntries.filter(e => e.hasClass).length} agendamento(s) neste dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead>Alunos</TableHead>
                      <TableHead style={{ width: '60px' }}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentEntries.filter(e => e.hasClass).map((cls) => (
                      <TableRow
                        key={cls.id}
                        style={{ transition: 'background-color 0.15s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F0F4FF' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '' }}
                      >
                        <TableCell>
                          <Badge variant="outline">{cls.course}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{cls.className}</TableCell>
                        <TableCell className="font-mono text-sm">{cls.time}</TableCell>
                        <TableCell>{cls.teacher}</TableCell>
                        <TableCell>{cls.room}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {cls.students}
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleDelete(cls.id)}
                            disabled={deletingId === cls.id}
                            style={{
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '6px',
                              border: 'none',
                              background: 'transparent',
                              cursor: deletingId === cls.id ? 'wait' : 'pointer',
                              color: '#9CA3AF',
                              transition: 'background-color 0.15s ease, color 0.15s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.color = '#DC2626' }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF' }}
                            onMouseDown={e => { e.currentTarget.style.backgroundColor = '#FECACA' }}
                            onMouseUp={e => { e.currentTarget.style.backgroundColor = '#FEE2E2' }}
                          >
                            {deletingId === cls.id
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Trash2 className="h-4 w-4" />}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
