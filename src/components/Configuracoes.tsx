import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import {
  Settings,
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  Bell,
  Database,
  Palette,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

interface Usuario {
  id: string
  nome: string
  email: string
  perfil: 'admin' | 'coordenador' | 'professor'
  status: 'ativo' | 'inativo'
  ultimoAcesso: string
}

// Mock data
const mockUsuarios: Usuario[] = [
  {
    id: '1',
    nome: 'Admin Sistema',
    email: 'admin@universidade.edu',
    perfil: 'admin',
    status: 'ativo',
    ultimoAcesso: '2024-01-15 14:30'
  },
  {
    id: '2',
    nome: 'Coord. Engenharia',
    email: 'coord.eng@universidade.edu',
    perfil: 'coordenador',
    status: 'ativo',
    ultimoAcesso: '2024-01-15 09:15'
  },
  {
    id: '3',
    nome: 'Prof. João Silva',
    email: 'joao.silva@universidade.edu',
    perfil: 'professor',
    status: 'ativo',
    ultimoAcesso: '2024-01-14 16:45'
  }
]

const perfilConfig = {
  admin: { label: 'Administrador', color: 'destructive' as const },
  coordenador: { label: 'Coordenador', color: 'default' as const },
  professor: { label: 'Professor', color: 'secondary' as const }
}

export function Configuracoes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [configuracoes, setConfiguracoes] = useState({
    notificacoes: true,
    backupAutomatico: true,
    tema: 'claro',
    idioma: 'portugues',
    horarioOperacao: '07:00-22:00'
  })
  const [userForm, setUserForm] = useState({
    nome: '',
    email: '',
    perfil: '' as Usuario['perfil'] | '',
    status: 'ativo' as Usuario['status']
  })

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!userForm.nome || !userForm.email || !userForm.perfil) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const userData = {
      id: editingUser?.id || Math.random().toString(36).substr(2, 9),
      nome: userForm.nome,
      email: userForm.email,
      perfil: userForm.perfil as Usuario['perfil'],
      status: userForm.status,
      ultimoAcesso: editingUser?.ultimoAcesso || 'Nunca'
    }

    if (editingUser) {
      setUsuarios(usuarios.map(u => u.id === editingUser.id ? userData : u))
      toast.success('Usuário atualizado com sucesso')
    } else {
      setUsuarios([...usuarios, userData])
      toast.success('Usuário criado com sucesso')
    }

    resetUserForm()
  }

  const resetUserForm = () => {
    setUserForm({ nome: '', email: '', perfil: '', status: 'ativo' })
    setEditingUser(null)
    setIsUserDialogOpen(false)
  }

  const handleEditUser = (user: Usuario) => {
    setEditingUser(user)
    setUserForm({
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      status: user.status
    })
    setIsUserDialogOpen(true)
  }

  const handleDeleteUser = (id: string) => {
    setUsuarios(usuarios.filter(u => u.id !== id))
    toast.success('Usuário removido com sucesso')
  }

  const handleConfigChange = (key: string, value: any) => {
    setConfiguracoes({ ...configuracoes, [key]: value })
    toast.success('Configuração atualizada')
  }

  const salvarConfiguracoes = () => {
    toast.success('Configurações salvas com sucesso')
  }

  const exportarDados = () => {
    toast.success('Dados exportados com sucesso')
  }

  const importarDados = () => {
    toast.success('Dados importados com sucesso')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Gerencie usuários, permissões e configurações gerais do sistema
        </p>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="dados">Dados</TabsTrigger>
        </TabsList>

        {/* Gerenciamento de Usuários */}
        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gerenciamento de Usuários
                  </CardTitle>
                  <CardDescription>
                    Cadastre e gerencie usuários do sistema
                  </CardDescription>
                </div>
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetUserForm()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                      </DialogTitle>
                      <DialogDescription>
                        Preencha as informações do usuário
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          value={userForm.nome}
                          onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
                          placeholder="Ex: João Silva"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          placeholder="usuario@universidade.edu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="perfil">Perfil de Acesso *</Label>
                        <Select
                          value={userForm.perfil}
                          onValueChange={(value) => setUserForm({ ...userForm, perfil: value as Usuario['perfil'] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o perfil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="coordenador">Coordenador</SelectItem>
                            <SelectItem value="professor">Professor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={userForm.status}
                          onValueChange={(value) => setUserForm({ ...userForm, status: value as Usuario['status'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={resetUserForm}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingUser ? 'Atualizar' : 'Criar'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant={perfilConfig[usuario.perfil].color}>
                          {perfilConfig[usuario.perfil].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={usuario.status === 'ativo' ? 'default' : 'secondary'}>
                          {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{usuario.ultimoAcesso}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(usuario)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(usuario.id)}
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

        {/* Configurações do Sistema */}
        <TabsContent value="sistema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Ajuste as configurações gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tema">Tema</Label>
                    <Select
                      value={configuracoes.tema}
                      onValueChange={(value) => handleConfigChange('tema', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claro">Claro</SelectItem>
                        <SelectItem value="escuro">Escuro</SelectItem>
                        <SelectItem value="automatico">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="idioma">Idioma</Label>
                    <Select
                      value={configuracoes.idioma}
                      onValueChange={(value) => handleConfigChange('idioma', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portugues">Português</SelectItem>
                        <SelectItem value="ingles">Inglês</SelectItem>
                        <SelectItem value="espanhol">Espanhol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="horario">Horário de Operação</Label>
                    <Input
                      id="horario"
                      value={configuracoes.horarioOperacao}
                      onChange={(e) => handleConfigChange('horarioOperacao', e.target.value)}
                      placeholder="07:00-22:00"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações do sistema
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.notificacoes}
                      onCheckedChange={(checked) => handleConfigChange('notificacoes', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Backup Automático</Label>
                      <p className="text-sm text-muted-foreground">
                        Backup diário dos dados
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.backupAutomatico}
                      onCheckedChange={(checked) => handleConfigChange('backupAutomatico', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={salvarConfiguracoes}>
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="seguranca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Gerencie políticas de segurança e acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3>Configurações de Segurança</h3>
                <p className="text-muted-foreground">
                  Em desenvolvimento - Políticas de senha, autenticação e auditoria
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gerenciamento de Dados */}
        <TabsContent value="dados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gerenciamento de Dados
              </CardTitle>
              <CardDescription>
                Backup, importação e exportação de dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Exportar Dados</CardTitle>
                    <CardDescription>
                      Exporte todos os dados do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={exportarDados} className="w-full">
                      <Database className="mr-2 h-4 w-4" />
                      Exportar Dados
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Importar Dados</CardTitle>
                    <CardDescription>
                      Importe dados de backup
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={importarDados} variant="outline" className="w-full">
                      <Database className="mr-2 h-4 w-4" />
                      Importar Dados
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Status do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <p className="text-sm text-muted-foreground">Disponibilidade</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">2.5GB</div>
                      <p className="text-sm text-muted-foreground">Espaço Usado</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">1,254</div>
                      <p className="text-sm text-muted-foreground">Registros</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}