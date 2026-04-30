import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Alert, AlertDescription } from "./ui/alert"
import { GraduationCap, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface LoginPageProps {
  onLogin: (userData: { email: string; nome: string; perfil: string }) => void
}

// Mock usuarios para demonstração
const mockUsuarios = [
  {
    email: 'admin@universidade.edu',
    senha: 'admin123',
    nome: 'Administrador do Sistema',
    perfil: 'Administrador'
  },
  {
    email: 'coord.eng@universidade.edu',
    senha: 'coord123',
    nome: 'Coordenador de Engenharia',
    perfil: 'Coordenador'
  },
  {
    email: 'joao.silva@universidade.edu',
    senha: 'prof123',
    nome: 'Prof. João Silva',
    perfil: 'Professor'
  }
]

export function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.senha) {
      setError('Por favor, preencha todos os campos')
      return
    }

    setIsLoading(true)

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Verificar credenciais
    const usuario = mockUsuarios.find(
      u => u.email === formData.email && u.senha === formData.senha
    )

    if (usuario) {
      toast.success(`Bem-vindo, ${usuario.nome}!`)
      onLogin({
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil
      })
    } else {
      setError('Email ou senha incorretos')
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (tipo: 'admin' | 'coordenador' | 'professor') => {
    const usuarios = {
      admin: mockUsuarios[0],
      coordenador: mockUsuarios[1],
      professor: mockUsuarios[2]
    }

    const usuario = usuarios[tipo]
    setFormData({
      email: usuario.email,
      senha: usuario.senha
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Título */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">UniRoom</h1>
          <p className="text-muted-foreground">
            Sistema de Ensalamento Acadêmico
          </p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Fazer Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@universidade.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground">
                  Lembrar de mim
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Links auxiliares */}
            <div className="mt-4 text-center space-y-2">
              <Button variant="link" className="text-sm text-muted-foreground">
                Esqueceu sua senha?
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demonstração - Usuários de teste */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Demonstração</CardTitle>
            <CardDescription className="text-center">
              Use os usuários de teste abaixo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('admin')}
            >
              <div className="text-left">
                <div className="font-medium">Administrador</div>
                <div className="text-sm text-muted-foreground">admin@universidade.edu</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('coordenador')}
            >
              <div className="text-left">
                <div className="font-medium">Coordenador</div>
                <div className="text-sm text-muted-foreground">coord.eng@universidade.edu</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('professor')}
            >
              <div className="text-left">
                <div className="font-medium">Professor</div>
                <div className="text-sm text-muted-foreground">joao.silva@universidade.edu</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Universidade. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}