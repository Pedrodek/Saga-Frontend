import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { Dashboard } from "./components/Dashboard"
import { SalasManager } from "./components/SalasManager"
import { ProfessoresManager } from "./components/ProfessoresManager" 
import { DisciplinasManager } from "./components/DisciplinasManager"
import { TurmasManager } from "./components/TurmasManager"
import { EnsalamentoExecutor } from "./components/EnsalamentoExecutor"
import { Relatorios } from "./components/Relatorios"
import { Configuracoes } from "./components/Configuracoes"
import { LoginPage } from "./components/LoginPage"
import { UserProfile } from "./components/UserProfile"
import { Toaster } from "./components/ui/sonner"
import { Button } from "./components/ui/button"
import { LogOut, User } from 'lucide-react'

export type NavigationItem = 'dashboard' | 'salas' | 'professores' | 'disciplinas' | 'turmas' | 'ensalamento' | 'relatorios' | 'configuracoes' | 'perfil'

interface UserData {
  email: string
  nome: string
  perfil: string
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavigationItem>('dashboard')
  const [user, setUser] = useState<UserData | null>(null)

  const handleLogin = (userData: UserData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setActiveSection('dashboard')
  }

  // Se o usuário não estiver logado, mostrar tela de login
  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    )
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'salas':
        return <SalasManager />
      case 'professores':
        return <ProfessoresManager />
      case 'disciplinas':
        return <DisciplinasManager />
      case 'turmas':
        return <TurmasManager />
      case 'ensalamento':
        return <EnsalamentoExecutor />
      case 'relatorios':
        return <Relatorios />
      case 'configuracoes':
        return <Configuracoes />
      case 'perfil':
        return <UserProfile user={user} />
      default:
        return <Dashboard />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar 
          activeSection={activeSection} 
          onNavigate={setActiveSection}
          user={user}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b bg-background">
            <div className="flex h-16 items-center justify-between px-2 md:px-4 gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <SidebarTrigger />
                <div className="ml-4 min-w-0 flex-1">
                  {/* Título responsivo */}
                  <h1 className="truncate">
                    <span className="sm:hidden">UniRoom</span>
                    <span className="hidden sm:inline lg:hidden">Sistema de Ensalamento</span>
                    <span className="hidden lg:inline">Sistema de Ensalamento Acadêmico</span>
                  </h1>
                  <p className="text-muted-foreground hidden sm:block truncate">
                    Coordenação Universitária
                  </p>
                </div>
              </div>
              
              {/* Informações do usuário e logout */}
              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <div className="text-right">
                    <div className="font-medium truncate max-w-32">{user.nome}</div>
                    <div className="text-muted-foreground">{user.perfil}</div>
                  </div>
                </div>
                {/* Versão compacta para mobile */}
                <div className="md:hidden flex items-center">
                  <User className="h-4 w-4" />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-1 md:gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {renderActiveSection()}
          </div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}