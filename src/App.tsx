import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { Dashboard } from "./components/Dashboard"
import { Agendamento } from "./components/Agendamento"
import { GradeHorario } from "./components/GradeHorario"
import { LoginPage } from "./components/LoginPage"
import { GradeProvider } from "./context/GradeContext"
import { Toaster } from "./components/ui/sonner"
import { Button } from "./components/ui/button"
import { LogOut, User } from 'lucide-react'

export type NavigationItem = 'dashboard' | 'agendamento' | 'grade'

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
      case 'agendamento':
        return <Agendamento />
      case 'grade':
        return <GradeHorario />
      default:
        return <Dashboard />
    }
  }

  return (
    <GradeProvider>
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
                    <span className="sm:hidden">SAGA</span>
                    <span className="hidden sm:inline lg:hidden">Sistema SAGA</span>
                    <span className="hidden lg:inline">Sistema de Agendamento e Gestão Acadêmica</span>
                  </h1>
                  <p className="text-muted-foreground hidden sm:block truncate">
                    Unidade Rudge Ramos
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
    </GradeProvider>
  )
}