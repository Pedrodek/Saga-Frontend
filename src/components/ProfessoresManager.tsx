import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Checkbox } from "./ui/checkbox"
import { Plus, Edit, Trash2, User, Mail, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface Professor {
  id: string
  nome: string
  email: string
  areasAtuacao: string[]
  disponibilidade: string[]
}

// Mock data
const mockProfessores: Professor[] = [
  {
    id: '1',
    nome: 'Dr. João Silva',
    email: 'joao.silva@universidade.edu',
    areasAtuacao: ['Matemática', 'Estatística'],
    disponibilidade: ['Segunda 08:00', 'Terça 14:00', 'Quinta 10:00']
  },
  {
    id: '2',
    nome: 'Dra. Maria Santos',
    email: 'maria.santos@universidade.edu',
    areasAtuacao: ['Programação', 'Algoritmos'],
    disponibilidade: ['Segunda 14:00', 'Quarta 08:00', 'Sexta 16:00']
  },
  {
    id: '3',
    nome: 'Prof. Pedro Costa',
    email: 'pedro.costa@universidade.edu',
    areasAtuacao: ['Física', 'Química'],
    disponibilidade: ['Terça 10:00', 'Quinta 14:00']
  }
]

const areasDisponiveis = [
  'Matemática', 'Física', 'Química', 'Biologia', 'Programação',
  'Algoritmos', 'Estatística', 'Cálculo', 'História', 'Geografia'
]

const horariosDisponiveis = [
  'Segunda 08:00', 'Segunda 10:00', 'Segunda 14:00', 'Segunda 16:00',
  'Terça 08:00', 'Terça 10:00', 'Terça 14:00', 'Terça 16:00',
  'Quarta 08:00', 'Quarta 10:00', 'Quarta 14:00', 'Quarta 16:00',
  'Quinta 08:00', 'Quinta 10:00', 'Quinta 14:00', 'Quinta 16:00',
  'Sexta 08:00', 'Sexta 10:00', 'Sexta 14:00', 'Sexta 16:00'
]

export function ProfessoresManager() {
  const [professores, setProfessores] = useState<Professor[]>(mockProfessores)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    areasAtuacao: [] as string[],
    disponibilidade: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.email || formData.areasAtuacao.length === 0) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const professorData = {
      id: editingProfessor?.id || Math.random().toString(36).substr(2, 9),
      nome: formData.nome,
      email: formData.email,
      areasAtuacao: formData.areasAtuacao,
      disponibilidade: formData.disponibilidade
    }

    if (editingProfessor) {
      setProfessores(professores.map(p => p.id === editingProfessor.id ? professorData : p))
      toast.success('Professor atualizado com sucesso')
    } else {
      setProfessores([...professores, professorData])
      toast.success('Professor cadastrado com sucesso')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({ nome: '', email: '', areasAtuacao: [], disponibilidade: [] })
    setEditingProfessor(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (professor: Professor) => {
    setEditingProfessor(professor)
    setFormData({
      nome: professor.nome,
      email: professor.email,
      areasAtuacao: professor.areasAtuacao,
      disponibilidade: professor.disponibilidade
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setProfessores(professores.filter(p => p.id !== id))
    toast.success('Professor removido com sucesso')
  }

  const handleAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, areasAtuacao: [...formData.areasAtuacao, area] })
    } else {
      setFormData({ ...formData, areasAtuacao: formData.areasAtuacao.filter(a => a !== area) })
    }
  }

  const handleDisponibilidadeChange = (horario: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, disponibilidade: [...formData.disponibilidade, horario] })
    } else {
      setFormData({ ...formData, disponibilidade: formData.disponibilidade.filter(h => h !== horario) })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gerenciamento de Professores</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie os professores do corpo docente
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Professor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProfessor ? 'Editar Professor' : 'Novo Professor'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do professor
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Dr. João Silva"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="professor@universidade.edu"
                />
              </div>

              <div>
                <Label>Áreas de Atuação *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                  {areasDisponiveis.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={`area-${area}`}
                        checked={formData.areasAtuacao.includes(area)}
                        onCheckedChange={(checked) => handleAreaChange(area, checked as boolean)}
                      />
                      <Label htmlFor={`area-${area}`} className="text-sm">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Disponibilidade de Horários</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {horariosDisponiveis.map((horario) => (
                    <div key={horario} className="flex items-center space-x-2">
                      <Checkbox
                        id={`horario-${horario}`}
                        checked={formData.disponibilidade.includes(horario)}
                        onCheckedChange={(checked) => handleDisponibilidadeChange(horario, checked as boolean)}
                      />
                      <Label htmlFor={`horario-${horario}`} className="text-sm">
                        {horario}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProfessor ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'cards' | 'table')}>
        <TabsList>
          <TabsTrigger value="cards">Visualização em Cards</TabsTrigger>
          <TabsTrigger value="table">Visualização em Tabela</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {professores.map((professor) => (
              <Card key={professor.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {professor.nome}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {professor.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Áreas de Atuação:</p>
                    <div className="flex flex-wrap gap-1">
                      {professor.areasAtuacao.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Disponibilidade:
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {professor.disponibilidade.length > 0
                        ? `${professor.disponibilidade.length} horários disponíveis`
                        : 'Nenhum horário cadastrado'
                      }
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(professor)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(professor.id)}
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
                    <TableHead>Email</TableHead>
                    <TableHead>Áreas de Atuação</TableHead>
                    <TableHead>Disponibilidade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {professores.map((professor) => (
                    <TableRow key={professor.id}>
                      <TableCell>{professor.nome}</TableCell>
                      <TableCell>{professor.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {professor.areasAtuacao.slice(0, 2).map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {professor.areasAtuacao.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{professor.areasAtuacao.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {professor.disponibilidade.length} horários
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(professor)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(professor.id)}
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
    </div>
  )
}