import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Clock,
  Loader2,
  CheckCircle2,
  TableProperties,
} from 'lucide-react'
import { sagaApi, type AgendamentoDTO, type PredioDTO, type TurmaDTO } from '../services/api'
import type { NavigationItem } from '../App'

interface DashboardProps {
  onNavigate: (section: NavigationItem) => void
}

// Ícones dos stat cards com suas cores brand
const statCards = [
  { label: 'Total de Salas', icon: Building2, iconColor: '#1E3A8A', bg: '#EEF2FF', valueKey: 'salas' as const },
  { label: 'Professores',    icon: Users,     iconColor: '#FBBF24', bg: '#FFFBEB', valueKey: 'prof'  as const },
  { label: 'Disciplinas',    icon: BookOpen,  iconColor: '#3B82F6', bg: '#EFF6FF', valueKey: 'disc'  as const },
  { label: 'Turmas',         icon: GraduationCap, iconColor: '#F59E0B', bg: '#FFF7ED', valueKey: 'turmas' as const },
]

interface DynamicAlert {
  id: number
  type: 'warning' | 'error' | 'info'
  title: string
  message: string
}

function generateAlerts(
  predios: PredioDTO[],
  turmas: TurmaDTO[],
  agendamentos: AgendamentoDTO[]
): DynamicAlert[] {
  const alerts: DynamicAlert[] = []
  let id = 1

  // 1. Conflitos de capacidade: turma com mais alunos do que a sala suporta
  for (const ag of agendamentos) {
    const turmaQtd = ag.turma.quantidade ?? 0
    const salaCapacidade = ag.sala.capacidade ?? 999
    if (turmaQtd > salaCapacidade) {
      alerts.push({
        id: id++,
        type: 'warning',
        title: 'Conflito de Capacidade',
        message: `${ag.turma.codigo_turma} (${turmaQtd} alunos) na sala ${ag.sala.numero_sala} (capacidade ${salaCapacidade})`,
      })
    }
  }

  // 2. Turmas sem agendamento
  const turmasComAgendamento = new Set(agendamentos.map(a => a.turma.id_turma))
  const turmasSemAgendamento = turmas.filter(t => !turmasComAgendamento.has(t.id_turma))
  if (turmasSemAgendamento.length > 0) {
    alerts.push({
      id: id++,
      type: 'info',
      title: 'Ensalamento Pendente',
      message: `${turmasSemAgendamento.length} turma${turmasSemAgendamento.length > 1 ? 's' : ''} aguardando alocação de sala`,
    })
  }

  // 3. Salas sem utilização
  const salasComAgendamento = new Set(agendamentos.map(a => a.sala.id_sala))
  const totalSalas = predios.reduce((acc, p) => acc + p.salas.length, 0)
  const salasOciosas = totalSalas - salasComAgendamento.size
  if (salasOciosas > 0 && totalSalas > 0) {
    alerts.push({
      id: id++,
      type: 'info',
      title: 'Salas Ociosas',
      message: `${salasOciosas} de ${totalSalas} salas não possuem agendamentos`,
    })
  }

  // Se tudo OK
  if (alerts.length === 0) {
    alerts.push({
      id: id++,
      type: 'info',
      title: 'Sistema OK',
      message: 'Nenhum conflito ou pendência detectada',
    })
  }

  return alerts
}

interface ActivityItem {
  action: string
  details: string
  badge: string
}

function generateActivities(
  predios: PredioDTO[],
  turmas: TurmaDTO[],
  agendamentos: AgendamentoDTO[]
): ActivityItem[] {
  const activities: ActivityItem[] = []

  const totalSalas = predios.reduce((acc, p) => acc + p.salas.length, 0)
  if (totalSalas > 0) {
    activities.push({
      action: `${totalSalas} salas registradas`,
      details: predios.map(p => `${p.nome} (${p.salas.length})`).join(', '),
      badge: 'Salas',
    })
  }

  if (turmas.length > 0) {
    const porTurno: Record<string, number> = {}
    turmas.forEach(t => { porTurno[t.turno] = (porTurno[t.turno] || 0) + 1 })
    const turnoStr = Object.entries(porTurno).map(([k, v]) => `${v} ${k.toLowerCase()}`).join(', ')
    activities.push({
      action: `${turmas.length} turmas ativas`,
      details: turnoStr,
      badge: 'Turmas',
    })
  }

  if (agendamentos.length > 0) {
    const diasUnicos = new Set(agendamentos.map(a => a.dia_semana)).size
    activities.push({
      action: `${agendamentos.length} agendamentos`,
      details: `Distribuídos em ${diasUnicos} dia${diasUnicos > 1 ? 's' : ''} da semana`,
      badge: 'Grade',
    })
  }

  if (activities.length === 0) {
    activities.push({
      action: 'Sem dados no sistema',
      details: 'Importe dados na tela Grade Horário',
      badge: 'Vazio',
    })
  }

  return activities
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [totalSalas, setTotalSalas] = useState<number | null>(null)
  const [totalProf, setTotalProf] = useState<number | null>(null)
  const [totalDisc, setTotalDisc] = useState<number | null>(null)
  const [totalTurmas, setTotalTurmas] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const [prediosData, setPrediosData] = useState<PredioDTO[]>([])
  const [turmasData, setTurmasData] = useState<TurmaDTO[]>([])
  const [agendamentosData, setAgendamentosData] = useState<AgendamentoDTO[]>([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [predios, professores, disciplinas, turmas, agendamentos] = await Promise.allSettled([
          sagaApi.predios.getAll(),
          sagaApi.professores.getAll(),
          sagaApi.disciplinas.getAll(),
          sagaApi.turmas.getAll(),
          sagaApi.agendamentos.getAll(),
        ])

        if (predios.status === 'fulfilled') {
          setPrediosData(predios.value)
          setTotalSalas(predios.value.reduce((acc, p) => acc + p.salas.length, 0))
        }
        if (professores.status === 'fulfilled') {
          setTotalProf(professores.value.length)
        }
        if (disciplinas.status === 'fulfilled') {
          setTotalDisc(disciplinas.value.length)
        }
        if (turmas.status === 'fulfilled') {
          setTurmasData(turmas.value)
          setTotalTurmas(turmas.value.length)
        }
        if (agendamentos.status === 'fulfilled') {
          setAgendamentosData(agendamentos.value)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const statValues = {
    salas:  totalSalas,
    prof:   totalProf,
    disc:   totalDisc,
    turmas: totalTurmas,
  }

  const statSubtitles = {
    salas:  totalSalas !== null ? 'Registradas no sistema' : 'Sem conexão',
    prof:   totalProf !== null ? 'Cadastrados' : 'Sem conexão',
    disc:   totalDisc !== null ? 'Cadastradas' : 'Sem conexão',
    turmas: totalTurmas !== null ? 'Ativas no semestre' : 'Sem conexão',
  }

  const dynamicAlerts = useMemo(
    () => generateAlerts(prediosData, turmasData, agendamentosData),
    [prediosData, turmasData, agendamentosData]
  )

  const recentActivities = useMemo(
    () => generateActivities(prediosData, turmasData, agendamentosData),
    [prediosData, turmasData, agendamentosData]
  )

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div>
        <h1 style={{ color: '#1E3A8A', fontWeight: 700, fontSize: '24px', margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>
          Visão geral do sistema de ensalamento acadêmico
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, icon: Icon, iconColor, bg, valueKey }) => (
          <Card
            key={label}
            style={{ cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,138,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle style={{ color: '#374151', fontSize: '14px', fontWeight: 500 }}>
                {label}
              </CardTitle>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color={iconColor} />
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>
                {loading
                  ? <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#1E3A8A' }} />
                  : (statValues[valueKey] ?? '—')}
              </div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                {statSubtitles[valueKey]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Alerts + Quick Actions ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Alertas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#1E3A8A' }}>
              <AlertTriangle className="h-5 w-5" style={{ color: '#FBBF24' }} />
              Alertas do Sistema
            </CardTitle>
            <CardDescription>
              Conflitos e notificações gerados automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" style={{ color: '#1E3A8A' }} />
                <span className="text-muted-foreground">Analisando dados...</span>
              </div>
            ) : (
              dynamicAlerts.map((alert) => (
                <Alert key={alert.id} className={alert.type === 'error' ? 'border-destructive' : alert.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}>
                  {alert.type === 'info' && alert.title === 'Sistema OK'
                    ? <CheckCircle2 className="h-4 w-4" />
                    : <AlertTriangle className="h-4 w-4" />}
                  <AlertTitle className="flex items-center justify-between">
                    {alert.title}
                    <Badge variant={alert.type === 'error' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'default'}>
                      {alert.type === 'error' ? 'Erro' : alert.type === 'warning' ? 'Atenção' : 'Info'}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    {alert.message}
                  </AlertDescription>
                </Alert>
              ))
            )}
          </CardContent>
        </Card>

        {/* Ações rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#1E3A8A' }}>
              <TrendingUp className="h-5 w-5" style={{ color: '#1E3A8A' }} />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso direto às funções principais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={() => onNavigate('agendamento')}>
              <Calendar className="mr-2 h-4 w-4" />
              Ver Agendamentos
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => onNavigate('grade')}>
              <TableProperties className="mr-2 h-4 w-4" />
              Grade de Horários
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => onNavigate('grade')}>
              <Building2 className="mr-2 h-4 w-4" />
              Importar Salas
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => onNavigate('grade')}>
              <Users className="mr-2 h-4 w-4" />
              Importar Professores
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Resumo do Sistema ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#1E3A8A' }}>
            <Clock className="h-5 w-5" style={{ color: '#1E3A8A' }} />
            Resumo do Sistema
          </CardTitle>
          <CardDescription>
            Visão geral dos dados cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin mr-2" style={{ color: '#1E3A8A' }} />
              <span className="text-muted-foreground">Carregando...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: '#F8F9FA', transition: 'background-color 0.15s ease, transform 0.15s ease', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EEF2FF'; e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F8F9FA'; e.currentTarget.style.transform = 'translateX(0)' }}
                >
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '14px', color: '#1a1a2e' }}>{activity.action}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280' }}>{activity.details}</p>
                  </div>
                  <Badge variant="outline">{activity.badge}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}