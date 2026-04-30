import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Plus, Edit, Trash2, GraduationCap, Users, User, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

interface Turma {
  id: string
  nome: string
  curso: string
  periodo: string
  numeroAlunos: number
  professorResponsavel: string
  disciplina: string
  status: 'pendente' | 'alocada' | 'conflito'
}

// Mock data
const mockTurmas: Turma[] = [
  {
    id: '1',
    nome: 'MAT001-A',
    curso: 'Engenharia',
    periodo: 'Matutino',
    numeroAlunos: 35,
    professorResponsavel: 'Dr. João Silva',
    disciplina: 'Cálculo I',
    status: 'alocada'
  },
  {
    id: '2',
    nome: 'INF102-B',
    curso: 'Ciência da Computação',
    periodo: 'Vespertino',
    numeroAlunos: 28,
    professorResponsavel: 'Dra. Maria Santos',
    disciplina: 'Algoritmos',
    status: 'pendente'
  },
  {
    id: '3',
    nome: 'FIS201-A',
    curso: 'Física',
    periodo: 'Noturno',
    numeroAlunos: 42,
    professorResponsavel: 'Prof. Pedro Costa',
    disciplina: 'Física Experimental',
    status: 'conflito'
  }
]

const cursos = [
  'Engenharia Civil', 'Engenharia Elétrica', 'Ciência da Computação',
  'Matemática', 'Física', 'Química', 'Administração', 'Direito'
]

const periodos = ['Matutino', 'Vespertino', 'Noturno', 'Integral']

// Mock data para professores e disciplinas
const professoresDisponiveis = [
  'Dr. João Silva', 'Dra. Maria Santos', 'Prof. Pedro Costa',
  'Dra. Ana Oliveira', 'Prof. Carlos Lima', 'Dra. Fernanda Costa'
]

const disciplinasDisponiveis = [
  'Cálculo I', 'Cálculo II', 'Algoritmos', 'Programação I',
  'Física Experimental', 'Química Orgânica', 'Estatística'
]

const statusColors = {
  pendente: { label: 'Pendente', color: 'secondary' as const },
  alocada: { label: 'Alocada', color: 'default' as const },
  conflito: { label: 'Conflito', color: 'destructive' as const }
}

export function TurmasManager() {
  const [turmas, setTurmas] = useState<Turma[]>(mockTurmas)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [filterCurso, setFilterCurso] = useState<string>('todos')
  const [formData, setFormData] = useState({
    nome: '',
    curso: '',
    periodo: '',
    numeroAlunos: '',
    professorResponsavel: '',
    disciplina: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.curso || !formData.periodo ||
      !formData.numeroAlunos || !formData.professorResponsavel || !formData.disciplina) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    if (parseInt(formData.numeroAlunos) <= 0) {
      toast.error('Número de alunos deve ser maior que zero')
      return
    }

    const turmaData = {
      id: editingTurma?.id || Math.random().toString(36).substr(2, 9),
      nome: formData.nome,
      curso: formData.curso,
      periodo: formData.periodo,
      numeroAlunos: parseInt(formData.numeroAlunos),
      professorResponsavel: formData.professorResponsavel,
      disciplina: formData.disciplina,
      status: 'pendente' as const
    }

    if (editingTurma) {
      setTurmas(turmas.map(t => t.id === editingTurma.id ? turmaData : t))
      toast.success('Turma atualizada com sucesso')
    } else {
      setTurmas([...turmas, turmaData])
      toast.success('Turma criada com sucesso')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome: '', curso: '', periodo: '', numeroAlunos: '',
      professorResponsavel: '', disciplina: ''
    })
    setEditingTurma(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma)
    setFormData({
      nome: turma.nome,
      curso: turma.curso,
      periodo: turma.periodo,
      numeroAlunos: turma.numeroAlunos.toString(),
      professorResponsavel: turma.professorResponsavel,
      disciplina: turma.disciplina
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setTurmas(turmas.filter(t => t.id !== id))
    toast.success('Turma removida com sucesso')
  }

  const turmasFiltradas = turmas.filter(turma => {
    const matchStatus = filterStatus === 'todos' || turma.status === filterStatus
    const matchCurso = filterCurso === 'todos' || turma.curso === filterCurso
    return matchStatus && matchCurso
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gerenciamento de Turmas</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie as turmas para ensalamento
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTurma ? 'Editar Turma' : 'Nova Turma'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações da turma
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Turma *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: MAT001-A, INF102-B"
                />
              </div>
              <div>
                <Label htmlFor="curso">Curso *</Label>
                <Select
                  value={formData.curso}
                  onValueChange={(value) => setFormData({ ...formData, curso: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
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
                <Label htmlFor="periodo">Período *</Label>
                <Select
                  value={formData.periodo}
                  onValueChange={(value) => setFormData({ ...formData, periodo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
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
                <Label htmlFor="numeroAlunos">Número de Alunos *</Label>
                <Input
                  id="numeroAlunos"
                  type="number"
                  value={formData.numeroAlunos}
                  onChange={(e) => setFormData({ ...formData, numeroAlunos: e.target.value })}
                  placeholder="Ex: 35"
                />
              </div>
              <div>
                <Label htmlFor="professor">Professor Responsável *</Label>
                <Select
                  value={formData.professorResponsavel}
                  onValueChange={(value) => setFormData({ ...formData, professorResponsavel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professoresDisponiveis.map((professor) => (
                      <SelectItem key={professor} value={professor}>
                        {professor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="disciplina">Disciplina *</Label>
                <Select
                  value={formData.disciplina}
                  onValueChange={(value) => setFormData({ ...formData, disciplina: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinasDisponiveis.map((disciplina) => (
                      <SelectItem key={disciplina} value={disciplina}>
                        {disciplina}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTurma ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label htmlFor="filtroStatus">Status:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="alocada">Alocada</SelectItem>
              <SelectItem value="conflito">Conflito</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="filtroCurso">Curso:</Label>
          <Select value={filterCurso} onValueChange={setFilterCurso}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os cursos</SelectItem>
              {cursos.map((curso) => (
                <SelectItem key={curso} value={curso}>
                  {curso}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline">
          {turmasFiltradas.length} turma(s)
        </Badge>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'cards' | 'table')}>
        <TabsList>
          <TabsTrigger value="cards">Visualização em Cards</TabsTrigger>
          <TabsTrigger value="table">Visualização em Tabela</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {turmasFiltradas.map((turma) => (
              <Card key={turma.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {turma.nome}
                    </span>
                    <Badge variant={statusColors[turma.status].color}>
                      {statusColors[turma.status].label}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{turma.curso} - {turma.periodo}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{turma.numeroAlunos} alunos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{turma.professorResponsavel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{turma.disciplina}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(turma)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(turma.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Alunos</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turmasFiltradas.map((turma) => (
                    <TableRow key={turma.id}>
                      <TableCell>{turma.nome}</TableCell>
                      <TableCell>{turma.curso}</TableCell>
                      <TableCell>{turma.periodo}</TableCell>
                      <TableCell>{turma.numeroAlunos}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {turma.professorResponsavel}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[turma.status].color}>
                          {statusColors[turma.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(turma)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(turma.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {turmasFiltradas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3>Nenhuma turma encontrada</h3>
            <p className="text-muted-foreground">
              Não há turmas que correspondam aos filtros selecionados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}