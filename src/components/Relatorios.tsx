import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Building2,
  GraduationCap,
  BarChart3,
  PieChart,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'

// Mock data para relatórios
const mockEnsalamentos = [
  {
    id: '1',
    turma: 'MAT001-A',
    sala: 'A-101',
    professor: 'Dr. João Silva',
    curso: 'Engenharia',
    periodo: 'Matutino',
    predio: 'Bloco A',
    horario: 'Segunda 08:00-10:00',
    alunos: 35,
    capacidadeSala: 40
  },
  {
    id: '2',
    turma: 'INF102-B',
    sala: 'Lab-201',
    professor: 'Dra. Maria Santos',
    curso: 'Ciência da Computação',
    periodo: 'Vespertino',
    predio: 'Bloco B',
    horario: 'Terça 14:00-16:00',
    alunos: 28,
    capacidadeSala: 30
  },
  {
    id: '3',
    turma: 'FIS201-A',
    sala: 'A-102',
    professor: 'Prof. Pedro Costa',
    curso: 'Física',
    periodo: 'Noturno',
    predio: 'Bloco A',
    horario: 'Quarta 19:00-21:00',
    alunos: 32,
    capacidadeSala: 35
  }
]

const cursos = ['Todos', 'Engenharia', 'Ciência da Computação', 'Física', 'Matemática']
const periodos = ['Todos', 'Matutino', 'Vespertino', 'Noturno']
const predios = ['Todos', 'Bloco A', 'Bloco B', 'Bloco C']

export function Relatorios() {
  const [filtros, setFiltros] = useState({
    curso: 'Todos',
    periodo: 'Todos',
    predio: 'Todos',
    dataInicio: '',
    dataFim: ''
  })
  const [dadosFiltrados, setDadosFiltrados] = useState(mockEnsalamentos)

  const aplicarFiltros = () => {
    let dados = mockEnsalamentos

    if (filtros.curso !== 'Todos') {
      dados = dados.filter(item => item.curso === filtros.curso)
    }
    if (filtros.periodo !== 'Todos') {
      dados = dados.filter(item => item.periodo === filtros.periodo)
    }
    if (filtros.predio !== 'Todos') {
      dados = dados.filter(item => item.predio === filtros.predio)
    }

    setDadosFiltrados(dados)
    toast.success('Filtros aplicados com sucesso')
  }

  const limparFiltros = () => {
    setFiltros({
      curso: 'Todos',
      periodo: 'Todos',
      predio: 'Todos',
      dataInicio: '',
      dataFim: ''
    })
    setDadosFiltrados(mockEnsalamentos)
    toast.success('Filtros limpos')
  }

  const exportarRelatorio = (formato: 'excel' | 'pdf') => {
    const formatoTexto = formato === 'excel' ? 'Excel' : 'PDF'
    toast.success(`Relatório exportado para ${formatoTexto}`)
  }

  const obterEstatisticas = () => {
    const totalTurmas = dadosFiltrados.length
    const totalAlunos = dadosFiltrados.reduce((acc, item) => acc + item.alunos, 0)
    const prediosUnicos = [...new Set(dadosFiltrados.map(item => item.predio))].length
    const cursosUnicos = [...new Set(dadosFiltrados.map(item => item.curso))].length
    const ocupacaoMedia = dadosFiltrados.reduce((acc, item) =>
      acc + (item.alunos / item.capacidadeSala), 0) / totalTurmas * 100

    return {
      totalTurmas,
      totalAlunos,
      prediosUnicos,
      cursosUnicos,
      ocupacaoMedia: Math.round(ocupacaoMedia)
    }
  }

  const estatisticas = obterEstatisticas()

  return (
    <div className="space-y-6">
      <div>
        <h1>Relatórios e Exportações</h1>
        <p className="text-muted-foreground">
          Gere relatórios detalhados do ensalamento com filtros personalizados
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Relatório
          </CardTitle>
          <CardDescription>
            Configure os filtros para personalizar seu relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <Label htmlFor="curso">Curso</Label>
              <Select
                value={filtros.curso}
                onValueChange={(value) => setFiltros({ ...filtros, curso: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso} value={curso}>
                      {curso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="periodo">Período</Label>
              <Select
                value={filtros.periodo}
                onValueChange={(value) => setFiltros({ ...filtros, periodo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map((periodo) => (
                    <SelectItem key={periodo} value={periodo}>
                      {periodo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="predio">Prédio</Label>
              <Select
                value={filtros.predio}
                onValueChange={(value) => setFiltros({ ...filtros, predio: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {predios.map((predio) => (
                    <SelectItem key={predio} value={predio}>
                      {predio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={aplicarFiltros}>
              <Filter className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Turmas</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalTurmas}</div>
            <p className="text-xs text-muted-foreground">
              Turmas no relatório
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Alunos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalAlunos}</div>
            <p className="text-xs text-muted-foreground">
              Alunos atendidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Prédios</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.prediosUnicos}</div>
            <p className="text-xs text-muted-foreground">
              Prédios utilizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Cursos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.cursosUnicos}</div>
            <p className="text-xs text-muted-foreground">
              Cursos atendidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Ocupação Média</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.ocupacaoMedia}%</div>
            <p className="text-xs text-muted-foreground">
              Das salas utilizadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dados e Exportação */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dados do Relatório
              </CardTitle>
              <CardDescription>
                {dadosFiltrados.length} registro(s) encontrado(s)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => exportarRelatorio('excel')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button onClick={() => exportarRelatorio('pdf')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tabela" className="w-full">
            <TabsList>
              <TabsTrigger value="tabela">Tabela Detalhada</TabsTrigger>
              <TabsTrigger value="resumo">Resumo por Curso</TabsTrigger>
              <TabsTrigger value="ocupacao">Ocupação de Salas</TabsTrigger>
            </TabsList>

            <TabsContent value="tabela" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turma</TableHead>
                    <TableHead>Sala</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Alunos</TableHead>
                    <TableHead>Ocupação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosFiltrados.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.turma}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {item.sala}
                        </div>
                      </TableCell>
                      <TableCell>{item.professor}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.curso}</Badge>
                      </TableCell>
                      <TableCell>{item.periodo}</TableCell>
                      <TableCell>{item.horario}</TableCell>
                      <TableCell>{item.alunos}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            {Math.round((item.alunos / item.capacidadeSala) * 100)}%
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${(item.alunos / item.capacidadeSala) > 0.9
                              ? 'bg-red-100 text-red-800'
                              : (item.alunos / item.capacidadeSala) > 0.7
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                            {item.alunos}/{item.capacidadeSala}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="resumo" className="mt-4">
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3>Resumo por Curso</h3>
                <p className="text-muted-foreground">
                  Visualização em desenvolvimento - Gráficos e estatísticas por curso
                </p>
              </div>
            </TabsContent>

            <TabsContent value="ocupacao" className="mt-4">
              <div className="text-center py-8">
                <PieChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3>Análise de Ocupação</h3>
                <p className="text-muted-foreground">
                  Visualização em desenvolvimento - Análise detalhada da ocupação das salas
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {dadosFiltrados.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3>Nenhum dado encontrado</h3>
            <p className="text-muted-foreground">
              Não há registros que correspondam aos filtros selecionados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}