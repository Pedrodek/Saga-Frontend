import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Progress } from "./ui/progress"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Play,
  Download,
  Calendar,
  Clock,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface EnsalamentoResult {
  turmaId: string
  turmaNome: string
  sala: string
  horario: string
  professor: string
  curso: string
  numeroAlunos: number
  status: 'sucesso' | 'conflito' | 'sem_sala'
  observacoes?: string
}

// Mock data para simulação
const mockResultados: EnsalamentoResult[] = [
  {
    turmaId: '1',
    turmaNome: 'MAT001-A',
    sala: 'A-101',
    horario: 'Segunda 08:00-10:00',
    professor: 'Dr. João Silva',
    curso: 'Engenharia',
    numeroAlunos: 35,
    status: 'sucesso'
  },
  {
    turmaId: '2',
    turmaNome: 'INF102-B',
    sala: 'Lab-201',
    horario: 'Terça 14:00-16:00',
    professor: 'Dra. Maria Santos',
    curso: 'Ciência da Computação',
    numeroAlunos: 28,
    status: 'sucesso'
  },
  {
    turmaId: '3',
    turmaNome: 'FIS201-A',
    sala: '-',
    horario: '-',
    professor: 'Prof. Pedro Costa',
    curso: 'Física',
    numeroAlunos: 42,
    status: 'sem_sala',
    observacoes: 'Capacidade excede salas disponíveis'
  },
  {
    turmaId: '4',
    turmaNome: 'QUI101-C',
    sala: 'A-102',
    horario: 'Quarta 10:00-12:00',
    professor: 'Dra. Ana Costa',
    curso: 'Química',
    numeroAlunos: 30,
    status: 'conflito',
    observacoes: 'Professor indisponível neste horário'
  }
]

const statusConfig = {
  sucesso: {
    label: 'Sucesso',
    color: 'default' as const,
    icon: CheckCircle2,
    textColor: 'text-green-600'
  },
  conflito: {
    label: 'Conflito',
    color: 'destructive' as const,
    icon: AlertTriangle,
    textColor: 'text-yellow-600'
  },
  sem_sala: {
    label: 'Sem Sala',
    color: 'secondary' as const,
    icon: XCircle,
    textColor: 'text-red-600'
  }
}

export function EnsalamentoExecutor() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [hasExecuted, setHasExecuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultados, setResultados] = useState<EnsalamentoResult[]>([])

  const executeEnsalamento = async () => {
    setIsExecuting(true)
    setProgress(0)
    setHasExecuted(false)

    // Simular progresso do algoritmo
    const intervals = [10, 25, 50, 75, 90, 100]

    for (let i = 0; i < intervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setProgress(intervals[i])
    }

    // Finalizar execução
    setResultados(mockResultados)
    setIsExecuting(false)
    setHasExecuted(true)
    toast.success('Ensalamento executado com sucesso!')
  }

  const exportToExcel = () => {
    toast.success('Relatório exportado para Excel')
  }

  const exportToPDF = () => {
    toast.success('Relatório exportado para PDF')
  }

  const getStatusSummary = () => {
    const summary = {
      total: resultados.length,
      sucesso: resultados.filter(r => r.status === 'sucesso').length,
      conflito: resultados.filter(r => r.status === 'conflito').length,
      sem_sala: resultados.filter(r => r.status === 'sem_sala').length
    }
    return summary
  }

  const summary = hasExecuted ? getStatusSummary() : null

  return (
    <div className="space-y-6">
      <div>
        <h1>Execução do Ensalamento</h1>
        <p className="text-muted-foreground">
          Execute o algoritmo de ensalamento e visualize os resultados
        </p>
      </div>

      {/* Card de Execução */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Algoritmo de Ensalamento
          </CardTitle>
          <CardDescription>
            Execute o algoritmo para alocar automaticamente as turmas às salas disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isExecuting && !hasExecuted && (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3>Pronto para Executar</h3>
              <p className="text-muted-foreground mb-4">
                O algoritmo processará todas as turmas cadastradas e tentará alocar salas compatíveis
              </p>
              <Button onClick={executeEnsalamento} size="lg">
                <Play className="mr-2 h-4 w-4" />
                Executar Ensalamento
              </Button>
            </div>
          )}

          {isExecuting && (
            <div className="text-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <h3>Executando Algoritmo...</h3>
              <p className="text-muted-foreground">
                Processando turmas e alocando salas disponíveis
              </p>
              <div className="max-w-md mx-auto">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">{progress}% completo</p>
              </div>
            </div>
          )}

          {hasExecuted && summary && (
            <div className="space-y-4">
              {/* Resumo dos Resultados */}
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Execução Concluída</AlertTitle>
                <AlertDescription>
                  O algoritmo processou {summary.total} turmas com os seguintes resultados:
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      {summary.sucesso} alocadas
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      {summary.conflito} conflitos
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-red-600" />
                      {summary.sem_sala} sem salas
                    </span>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Botões de Ação */}
              <div className="flex gap-2 justify-center">
                <Button onClick={executeEnsalamento} variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  Executar Novamente
                </Button>
                <Button onClick={exportToExcel} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </Button>
                <Button onClick={exportToPDF} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      {hasExecuted && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados do Ensalamento</CardTitle>
            <CardDescription>
              Visualização detalhada da alocação de turmas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tabela" className="w-full">
              <TabsList>
                <TabsTrigger value="tabela">Visualização em Tabela</TabsTrigger>
                <TabsTrigger value="calendario">Visualização por Horário</TabsTrigger>
              </TabsList>

              <TabsContent value="tabela" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Turma</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Alunos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((resultado) => {
                      const StatusIcon = statusConfig[resultado.status].icon
                      return (
                        <TableRow key={resultado.turmaId}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{resultado.turmaNome}</div>
                              <div className="text-sm text-muted-foreground">{resultado.curso}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {resultado.sala !== '-' ? (
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                {resultado.sala}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {resultado.horario !== '-' ? (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {resultado.horario}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{resultado.professor}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {resultado.numeroAlunos}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={statusConfig[resultado.status].color}
                              className="flex items-center gap-1 w-fit"
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig[resultado.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            {resultado.observacoes && (
                              <span className="text-sm text-muted-foreground">
                                {resultado.observacoes}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="calendario" className="mt-4">
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3>Visualização por Horário</h3>
                  <p className="text-muted-foreground">
                    Em desenvolvimento - Grade de horários com visualização de conflitos
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas dos Resultados */}
      {hasExecuted && summary && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Taxa de Sucesso</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((summary.sucesso / summary.total) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.sucesso} de {summary.total} turmas alocadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Conflitos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.conflito}</div>
              <p className="text-xs text-muted-foreground">
                Turmas com conflitos de horário
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Sem Alocação</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.sem_sala}</div>
              <p className="text-xs text-muted-foreground">
                Turmas sem salas compatíveis
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}