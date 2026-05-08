import {
  LayoutDashboard,
  CalendarClock,
  TableProperties,
  GraduationCap
} from 'lucide-react'
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

const SIDEBAR_BG = '#1E3A8A'
const SIDEBAR_BG_DARK = '#172554'
const GOLD = '#FBBF24'
const WHITE = '#ffffff'
const WHITE_60 = 'rgba(255,255,255,0.6)'
const WHITE_12 = 'rgba(255,255,255,0.12)'
const WHITE_15 = 'rgba(255,255,255,0.15)'

const navItems = [
  { id: 'dashboard' as NavigationItem, label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'agendamento' as NavigationItem, label: 'Agendamento', Icon: CalendarClock },
  { id: 'grade' as NavigationItem, label: 'Grade Horário', Icon: TableProperties },
]

export function AppSidebar({ activeSection, onNavigate, user }: AppSidebarProps) {
  const getInitials = (nome: string) =>
    nome.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        background: `linear-gradient(180deg, ${SIDEBAR_BG} 0%, ${SIDEBAR_BG_DARK} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── LOGO ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '24px 20px 20px',
          borderBottom: `1px solid ${WHITE_15}`,
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(251,191,36,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <GraduationCap size={22} color={GOLD} />
        </div>
        <div>
          <div style={{ color: WHITE, fontWeight: 700, fontSize: '18px', lineHeight: 1.2 }}>
            SAGA
          </div>
          <div style={{ color: WHITE_60, fontSize: '11px', marginTop: '2px' }}>
            UMESP
          </div>
        </div>
      </div>

      {/* ── MENU LABEL ── */}
      <div
        style={{
          color: WHITE_60,
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '20px 20px 8px',
        }}
      >
        MENU
      </div>

      {/* ── NAV ITEMS ── */}
      <nav style={{ padding: '0 12px', flex: 1 }}>
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '4px',
                transition: 'background 0.15s ease',
                background: isActive ? GOLD : 'transparent',
                color: isActive ? '#1a1a2e' : WHITE,
                fontWeight: isActive ? 600 : 400,
                fontSize: '14px',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = WHITE_12
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                }
              }}
            >
              <Icon size={16} color={isActive ? '#1a1a2e' : WHITE} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      {/* ── FOOTER / USER ── */}
      <div
        style={{
          borderTop: `1px solid ${WHITE_15}`,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(251,191,36,0.18)',
            border: `1.5px solid rgba(251,191,36,0.4)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: GOLD,
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          {getInitials(user.nome)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: WHITE,
              fontWeight: 500,
              fontSize: '13px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.nome.split(' ')[0]}
          </div>
          <div style={{ color: WHITE_60, fontSize: '11px' }}>{user.perfil}</div>
        </div>
      </div>
    </aside>
  )
}