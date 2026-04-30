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
  Clock
} from 'lucide-react'

// Mock data para demonstração
const dashboardData = {
  stats: {
    salas: 45,
    professores: 78,
    disciplinas: 124,
    turmas: 156
  },
  alerts: [
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
  ],
  recentActivities: [
    { action: 'Nova turma criada', details: 'Algoritmos II - Turma A', time: '10 min' },
    { action: 'Sala editada', details: 'Lab Informática 3 - Capacidade alterada', time: '25 min' },
    { action: 'Professor cadastrado', details: 'Dr. Maria Santos - Matemática', time: '1h' }
  ]
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de ensalamento acadêmico
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total de Salas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.salas}</div>
            <p className="text-xs text-muted-foreground">
              +2 novas este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Professores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.professores}</div>
            <p className="text-xs text-muted-foreground">
              +5 novos este semestre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Disciplinas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.disciplinas}</div>
            <p className="text-xs text-muted-foreground">
              Ativas no semestre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Turmas</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.turmas}</div>
            <p className="text-xs text-muted-foreground">
              Para ensalamento
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Alertas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas do Sistema
            </CardTitle>
            <CardDescription>
              Conflitos e notificações importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.alerts.map((alert) => (
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
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
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

      {/* Atividades recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
          <CardDescription>
            Últimas alterações no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
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