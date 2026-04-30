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
import { Plus, Edit, Trash2, BookOpen, Hash } from 'lucide-react'
import { toast } from 'sonner'

interface Disciplina {
  id: string
  nome: string
  codigo: string
  areaAtuacao: string
  cargaHoraria: number
}

// Mock data
const mockDisciplinas: Disciplina[] = [
  {
    id: '1',
    nome: 'Cálculo Diferencial e Integral I',
    codigo: 'MAT001',
    areaAtuacao: 'Matemática',
    cargaHoraria: 60
  },
  {
    id: '2',
    nome: 'Algoritmos e Estruturas de Dados',
    codigo: 'INF102',
    areaAtuacao: 'Programação',
    cargaHoraria: 80
  },
  {
    id: '3',
    nome: 'Física Experimental I',
    codigo: 'FIS201',
    areaAtuacao: 'Física',
    cargaHoraria: 40
  },
  {
    id: '4',
    nome: 'Estatística Aplicada',
    codigo: 'EST301',
    areaAtuacao: 'Estatística',
    cargaHoraria: 60
  },
  {
    id: '5',
    nome: 'Química Orgânica',
    codigo: 'QUI101',
    areaAtuacao: 'Química',
    cargaHoraria: 80
  }
]

const areasAtuacao = [
  'Matemática', 'Física', 'Química', 'Biologia', 'Programação',
  'Algoritmos', 'Estatística', 'Cálculo', 'História', 'Geografia',
  'Literatura', 'Filosofia', 'Sociologia', 'Psicologia', 'Engenharia'
]

const cargasHorarias = [20, 40, 60, 80, 100, 120]

export function DisciplinasManager() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(mockDisciplinas)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [filterArea, setFilterArea] = useState<string>('todas')
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    areaAtuacao: '',
    cargaHoraria: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.codigo || !formData.areaAtuacao || !formData.cargaHoraria) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    // Validar se código já existe
    const codigoExiste = disciplinas.some(d =>
      d.codigo.toLowerCase() === formData.codigo.toLowerCase() &&
      d.id !== editingDisciplina?.id
    )

    if (codigoExiste) {
      toast.error('Código da disciplina já existe')
      return
    }

    const disciplinaData = {
      id: editingDisciplina?.id || Math.random().toString(36).substr(2, 9),
      nome: formData.nome,
      codigo: formData.codigo.toUpperCase(),
      areaAtuacao: formData.areaAtuacao,
      cargaHoraria: parseInt(formData.cargaHoraria)
    }

    if (editingDisciplina) {
      setDisciplinas(disciplinas.map(d => d.id === editingDisciplina.id ? disciplinaData : d))
      toast.success('Disciplina atualizada com sucesso')
    } else {
      setDisciplinas([...disciplinas, disciplinaData])
      toast.success('Disciplina criada com sucesso')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({ nome: '', codigo: '', areaAtuacao: '', cargaHoraria: '' })
    setEditingDisciplina(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (disciplina: Disciplina) => {
    setEditingDisciplina(disciplina)
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      areaAtuacao: disciplina.areaAtuacao,
      cargaHoraria: disciplina.cargaHoraria.toString()
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDisciplinas(disciplinas.filter(d => d.id !== id))
    toast.success('Disciplina removida com sucesso')
  }

  const disciplinasFiltradas = filterArea === 'todas'
    ? disciplinas
    : disciplinas.filter(d => d.areaAtuacao === filterArea)

  const getAreaColor = (area: string) => {
    const colors = {
      'Matemática': 'default',
      'Física': 'secondary',
      'Química': 'destructive',
      'Programação': 'outline',
      'Estatística': 'default'
    } as const
    return colors[area as keyof typeof colors] || 'default'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gerenciamento de Disciplinas</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie as disciplinas do currículo acadêmico
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDisciplina ? 'Editar Disciplina' : 'Nova Disciplina'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações da disciplina
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Disciplina *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Cálculo Diferencial e Integral I"
                />
              </div>
              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ex: MAT001"
                />
              </div>
              <div>
                <Label htmlFor="area">Área de Atuação *</Label>
                <Select
                  value={formData.areaAtuacao}
                  onValueChange={(value) => setFormData({ ...formData, areaAtuacao: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areasAtuacao.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="carga">Carga Horária *</Label>
                <Select
                  value={formData.cargaHoraria}
                  onValueChange={(value) => setFormData({ ...formData, cargaHoraria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a carga horária" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargasHorarias.map((carga) => (
                      <SelectItem key={carga} value={carga.toString()}>
                        {carga}h
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
                  {editingDisciplina ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-4">
        <Label htmlFor="filtro">Filtrar por área:</Label>
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as áreas</SelectItem>
            {areasAtuacao.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline">
          {disciplinasFiltradas.length} disciplina(s)
        </Badge>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'cards' | 'table')}>
        <TabsList>
          <TabsTrigger value="cards">Visualização em Cards</TabsTrigger>
          <TabsTrigger value="table">Visualização em Tabela</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {disciplinasFiltradas.map((disciplina) => (
              <Card key={disciplina.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="truncate">{disciplina.nome}</span>
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    {disciplina.codigo}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={getAreaColor(disciplina.areaAtuacao)}>
                        {disciplina.areaAtuacao}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {disciplina.cargaHoraria}h
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(disciplina)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(disciplina.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
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
                    <TableHead>Código</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Carga Horária</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplinasFiltradas.map((disciplina) => (
                    <TableRow key={disciplina.id}>
                      <TableCell className="max-w-xs truncate">
                        {disciplina.nome}
                      </TableCell>
                      <TableCell>{disciplina.codigo}</TableCell>
                      <TableCell>
                        <Badge variant={getAreaColor(disciplina.areaAtuacao)}>
                          {disciplina.areaAtuacao}
                        </Badge>
                      </TableCell>
                      <TableCell>{disciplina.cargaHoraria}h</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(disciplina)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(disciplina.id)}
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

      {disciplinasFiltradas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3>Nenhuma disciplina encontrada</h3>
            <p className="text-muted-foreground">
              {filterArea === 'todas'
                ? 'Começe criando uma nova disciplina'
                : `Não há disciplinas na área ${filterArea}`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}