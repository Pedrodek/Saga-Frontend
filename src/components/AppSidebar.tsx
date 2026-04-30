import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BookOpen, 
  GraduationCap, 
  CalendarDays, 
  FileText, 
  Settings,
  User
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "./ui/sidebar"
import { Avatar, AvatarFallback } from "./ui/avatar"
import type { NavigationItem } from '../App'

interface AppSidebarProps {
  activeSection: NavigationItem
  onNavigate: (section: NavigationItem) => void
  user: {
    email: string
    nome: string
    perfil: string
  }
}

export function AppSidebar({ activeSection, onNavigate, user }: AppSidebarProps) {
  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Filtrar itens baseado no perfil do usuário
  const getNavigationItems = () => {
    const allItems = [
      {
        id: 'dashboard' as NavigationItem,
        title: 'Dashboard',
        icon: LayoutDashboard,
        allowedProfiles: ['Administrador', 'Coordenador', 'Professor']
      },
      {
        id: 'salas' as NavigationItem,
        title: 'Salas',
        icon: Building2,
        allowedProfiles: ['Administrador', 'Coordenador', 'Professor']
      },
      {
        id: 'professores' as NavigationItem,
        title: 'Professores',
        icon: Users,
        allowedProfiles: ['Administrador', 'Coordenador']
      },
      {
        id: 'disciplinas' as NavigationItem,
        title: 'Disciplinas',
        icon: BookOpen,
        allowedProfiles: ['Administrador', 'Coordenador', 'Professor']
      },
      {
        id: 'turmas' as NavigationItem,
        title: 'Turmas',
        icon: GraduationCap,
        allowedProfiles: ['Administrador', 'Coordenador', 'Professor']
      },
      {
        id: 'ensalamento' as NavigationItem,
        title: 'Ensalamento',
        icon: CalendarDays,
        allowedProfiles: ['Administrador', 'Coordenador']
      },
      {
        id: 'relatorios' as NavigationItem,
        title: 'Relatórios',
        icon: FileText,
        allowedProfiles: ['Administrador', 'Coordenador', 'Professor']
      },
      {
        id: 'configuracoes' as NavigationItem,
        title: 'Configurações',
        icon: Settings,
        allowedProfiles: ['Administrador']
      }
    ]

    return allItems.filter(item => 
      item.allowedProfiles.includes(user.perfil)
    )
  }

  const navigationItems = getNavigationItems()
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-6 text-primary" />
          <div>
            <h2>UniRoom</h2>
            <p className="text-muted-foreground">Sistema de Ensalamento</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeSection === item.id}
                  >
                    <button
                      onClick={() => onNavigate(item.id)}
                      className="flex items-center gap-3 w-full"
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t px-6 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={activeSection === 'perfil'}
            >
              <button
                onClick={() => onNavigate('perfil')}
                className="flex items-center gap-3 w-full"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {getInitials(user.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{user.nome.split(' ')[0]}</div>
                  <div className="text-xs text-muted-foreground">{user.perfil}</div>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}