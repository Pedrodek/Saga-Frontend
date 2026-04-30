import { 
  LayoutDashboard, 
  CalendarClock,
  TableProperties,
  GraduationCap
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

  const navigationItems = [
    {
      id: 'dashboard' as NavigationItem,
      title: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'agendamento' as NavigationItem,
      title: 'Agendamento',
      icon: CalendarClock,
    },
    {
      id: 'grade' as NavigationItem,
      title: 'Grade Horário',
      icon: TableProperties,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-6 text-primary" />
          <div>
            <h2>SAGA</h2>
            <p className="text-muted-foreground">Gestão Acadêmica</p>
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
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {getInitials(user.nome)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <div className="font-medium text-sm">{user.nome.split(' ')[0]}</div>
            <div className="text-xs text-muted-foreground">{user.perfil}</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}