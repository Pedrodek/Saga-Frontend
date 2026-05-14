import { useState } from 'react'
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
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#F8F9FA' }}>
        {/* ── SIDEBAR ── */}
        <AppSidebar
          activeSection={activeSection}
          onNavigate={setActiveSection}
          user={user}
        />

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* ── TOP HEADER BAR ── */}
          <header
            style={{
              height: '64px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              flexShrink: 0,
            }}
          >
            {/* Left: Page Title */}
            <div>
              <h1
                style={{
                  color: '#1E3A8A',
                  fontWeight: 600,
                  fontSize: '16px',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                Sistema de Alocação e Gestão Acadêmica
              </h1>
              <p
                style={{
                  color: '#6B7280',
                  fontSize: '12px',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                Unidade Rudge Ramos
              </p>
            </div>

            {/* Right: User info + logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="#1E3A8A" />
                <div>
                  <div style={{ fontWeight: 500, fontSize: '13px', lineHeight: 1.2, color: '#1a1a2e' }}>
                    {user.nome}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.2 }}>
                    {user.perfil}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </header>

          {/* ── PAGE CONTENT ── */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {renderActiveSection()}
          </main>
        </div>
      </div>
      <Toaster />
    </GradeProvider>
  )
}