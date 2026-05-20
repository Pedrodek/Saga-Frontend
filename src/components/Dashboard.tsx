import { useState, useEffect } from 'react'
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
  Loader2
} from 'lucide-react'
import { sagaApi } from '../services/api'

const mockAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Conflito de Capacidade',
    message: 'Sala A-201 com 35 alunos para capacidade de 30',
    time: '2 min atrás'
  },
  {
    id: 2,
    type: 'error',
    title: 'Professor Indisponível',
    message: 'Prof. Silva tem conflito de horário na terça às 14h',
    time: '15 min atrás'
  },
  {
    id: 3,
    type: 'info',
    title: 'Ensalamento Pendente',
    message: '12 turmas aguardando alocação de sala',
    time: '1h atrás'
  }
]

const mockRecentActivities = [
  { action: 'Nova turma criada', details: 'Algoritmos II - Turma A', time: '10 min' },
  { action: 'Sala editada', details: 'Lab Informática 3 - Capacidade alterada', time: '25 min' },
  { action: 'Professor cadastrado', details: 'Dr. Maria Santos - Matemática', time: '1h' }
]

// Ícones dos stat cards com suas cores brand
const statCards = [
  { label: 'Total de Salas', icon: Building2, iconColor: '#1E3A8A', bg: '#EEF2FF', valueKey: 'salas' as const },
  { label: 'Professores',    icon: Users,     iconColor: '#FBBF24', bg: '#FFFBEB', valueKey: 'prof'  as const },
  { label: 'Disciplinas',    icon: BookOpen,  iconColor: '#3B82F6', bg: '#EFF6FF', valueKey: 'disc'  as const },
  { label: 'Turmas',         icon: GraduationCap, iconColor: '#F59E0B', bg: '#FFF7ED', valueKey: 'turmas' as const },
]

export function Dashboard() {
  const [totalSalas, setTotalSalas] = useState<number | null>(null)
  const [totalProf, setTotalProf] = useState<number | null>(null)
  const [totalDisc, setTotalDisc] = useState<number | null>(null)
  const [totalTurmas, setTotalTurmas] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [predios, professores, disciplinas, turmas] = await Promise.allSettled([
          sagaApi.predios.getAll(),
          sagaApi.professores.getAll(),
          sagaApi.disciplinas.getAll(),
          sagaApi.turmas.getAll(),
        ])

        if (predios.status === 'fulfilled') {
          setTotalSalas(predios.value.reduce((acc, p) => acc + p.salas.length, 0))
        }
        if (professores.status === 'fulfilled') {
          setTotalProf(professores.value.length)
        }
        if (disciplinas.status === 'fulfilled') {
          setTotalDisc(disciplinas.value.length)
        }
        if (turmas.status === 'fulfilled') {
          setTotalTurmas(turmas.value.length)
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
          <Card key={label}>
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
              Conflitos e notificações importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAlerts.map((alert) => (
              <Alert key={alert.id} className={alert.type === 'error' ? 'border-destructive' : alert.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  {alert.title}
                  <Badge variant={alert.type === 'error' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'default'}>
                    {alert.type === 'error' ? 'Erro' : alert.type === 'warning' ? 'Atenção' : 'Info'}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  {alert.message}
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </AlertDescription>
              </Alert>
            ))}
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
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Executar Ensalamento
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Nova Sala
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Cadastrar Professor
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <GraduationCap className="mr-2 h-4 w-4" />
              Criar Turma
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Atividades recentes ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#1E3A8A' }}>
            <Clock className="h-5 w-5" style={{ color: '#1E3A8A' }} />
            Atividades Recentes
          </CardTitle>
          <CardDescription>
            Últimas alterações no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRecentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#F8F9FA' }}>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '14px', color: '#1a1a2e' }}>{activity.action}</p>
                  <p style={{ fontSize: '12px', color: '#6B7280' }}>{activity.details}</p>
                </div>
                <Badge variant="outline">{activity.time}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}