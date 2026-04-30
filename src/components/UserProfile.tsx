import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { User, Mail, Shield, Calendar, Edit } from 'lucide-react'

interface UserProfileProps {
  user: {
    email: string
    nome: string
    perfil: string
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getPerfilColor = (perfil: string) => {
    switch (perfil.toLowerCase()) {
      case 'administrador':
        return 'destructive'
      case 'coordenador':
        return 'default'
      case 'professor':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Perfil do Usuário</h1>
        <p className="text-muted-foreground">
          Visualize e edite suas informações pessoais
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Suas informações básicas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getInitials(user.nome)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3>{user.nome}</h3>
                <Badge variant={getPerfilColor(user.perfil)}>
                  {user.perfil}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Nome Completo</Label>
                <Input value={user.nome} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>
              <div>
                <Label>Perfil de Acesso</Label>
                <Input value={user.perfil} disabled />
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar Informações
            </Button>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Suas últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { acao: 'Login realizado', data: 'Hoje às 09:15', tipo: 'info' },
                { acao: 'Turma editada', data: 'Ontem às 16:30', tipo: 'edit' },
                { acao: 'Relatório gerado', data: '2 dias atrás', tipo: 'report' },
                { acao: 'Sala cadastrada', data: '3 dias atrás', tipo: 'create' }
              ].map((atividade, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{atividade.acao}</p>
                    <p className="text-sm text-muted-foreground">{atividade.data}</p>
                  </div>
                  <Badge variant="outline">
                    {atividade.tipo}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissões do Sistema
          </CardTitle>
          <CardDescription>
            Funcionalidades disponíveis para seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { modulo: 'Dashboard', acesso: true },
              { modulo: 'Salas', acesso: true },
              { modulo: 'Professores', acesso: user.perfil !== 'Professor' },
              { modulo: 'Disciplinas', acesso: true },
              { modulo: 'Turmas', acesso: true },
              { modulo: 'Ensalamento', acesso: user.perfil !== 'Professor' },
              { modulo: 'Relatórios', acesso: true },
              { modulo: 'Configurações', acesso: user.perfil === 'Administrador' }
            ].map((permissao) => (
              <div key={permissao.modulo} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span>{permissao.modulo}</span>
                <Badge variant={permissao.acesso ? 'default' : 'secondary'}>
                  {permissao.acesso ? 'Permitido' : 'Restrito'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}