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
import { Plus, Edit, Trash2, Building2, Users } from 'lucide-react'
import { toast } from 'sonner'

interface Sala {
  id: string
  nome: string
  predio: string
  capacidade: number
  tipo: 'comum' | 'laboratorio' | 'auditorio' | 'biblioteca'
}

// Mock data
const mockSalas: Sala[] = [
  { id: '1', nome: 'A-101', predio: 'Bloco A', capacidade: 40, tipo: 'comum' },
  { id: '2', nome: 'Lab-201', predio: 'Bloco B', capacidade: 25, tipo: 'laboratorio' },
  { id: '3', nome: 'Auditório Central', predio: 'Bloco C', capacidade: 200, tipo: 'auditorio' },
  { id: '4', nome: 'A-102', predio: 'Bloco A', capacidade: 35, tipo: 'comum' },
  { id: '5', nome: 'Lab-301', predio: 'Bloco B', capacidade: 30, tipo: 'laboratorio' },
]

const tiposSala = {
  comum: { label: 'Comum', color: 'default' as const },
  laboratorio: { label: 'Laboratório', color: 'secondary' as const },
  auditorio: { label: 'Auditório', color: 'destructive' as const },
  biblioteca: { label: 'Biblioteca', color: 'outline' as const }
}

export function SalasManager() {
  const [salas, setSalas] = useState<Sala[]>(mockSalas)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSala, setEditingSala] = useState<Sala | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [formData, setFormData] = useState({
    nome: '',
    predio: '',
    capacidade: '',
    tipo: '' as Sala['tipo'] | ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.predio || !formData.capacidade || !formData.tipo) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const salaData = {
      id: editingSala?.id || Math.random().toString(36).substr(2, 9),
      nome: formData.nome,
      predio: formData.predio,
      capacidade: parseInt(formData.capacidade),
      tipo: formData.tipo as Sala['tipo']
    }

    if (editingSala) {
      setSalas(salas.map(s => s.id === editingSala.id ? salaData : s))
      toast.success('Sala atualizada com sucesso')
    } else {
      setSalas([...salas, salaData])
      toast.success('Sala criada com sucesso')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({ nome: '', predio: '', capacidade: '', tipo: '' })
    setEditingSala(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (sala: Sala) => {
    setEditingSala(sala)
    setFormData({
      nome: sala.nome,
      predio: sala.predio,
      capacidade: sala.capacidade.toString(),
      tipo: sala.tipo
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setSalas(salas.filter(s => s.id !== id))
    toast.success('Sala removida com sucesso')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Gerenciamento de Salas</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie as salas disponíveis para ensalamento
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Sala
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSala ? 'Editar Sala' : 'Nova Sala'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações da sala
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Sala *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: A-101, Lab Informática 1"
                />
              </div>
              <div>
                <Label htmlFor="predio">Prédio *</Label>
                <Input
                  id="predio"
                  value={formData.predio}
                  onChange={(e) => setFormData({ ...formData, predio: e.target.value })}
                  placeholder="Ex: Bloco A, Prédio Principal"
                />
              </div>
              <div>
                <Label htmlFor="capacidade">Capacidade *</Label>
                <Input
                  id="capacidade"
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                  placeholder="Ex: 40"
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Sala *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value as Sala['tipo'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comum">Sala Comum</SelectItem>
                    <SelectItem value="laboratorio">Laboratório</SelectItem>
                    <SelectItem value="auditorio">Auditório</SelectItem>
                    <SelectItem value="biblioteca">Biblioteca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingSala ? 'Atualizar' : 'Criar'}
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
            {salas.map((sala) => (
              <Card key={sala.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {sala.nome}
                    </span>
                    <Badge variant={tiposSala[sala.tipo].color}>
                      {tiposSala[sala.tipo].label}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{sala.predio}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{sala.capacidade} pessoas</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(sala)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(sala.id)}
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
                    <TableHead>Prédio</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salas.map((sala) => (
                    <TableRow key={sala.id}>
                      <TableCell>{sala.nome}</TableCell>
                      <TableCell>{sala.predio}</TableCell>
                      <TableCell>{sala.capacidade}</TableCell>
                      <TableCell>
                        <Badge variant={tiposSala[sala.tipo].color}>
                          {tiposSala[sala.tipo].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(sala)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(sala.id)}
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