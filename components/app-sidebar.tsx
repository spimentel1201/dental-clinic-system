'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  Wallet,
  FileText,
  Smile,
  Settings,
  LogOut,
  Stethoscope,
  DollarSign,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Menú para Odontólogo (Admin)
const odontologoNavItems = [
  { href: '/', label: 'Panel de control', icon: LayoutDashboard },
  { href: '/citas', label: 'Agenda de citas', icon: CalendarDays },
  { href: '/presupuestos', label: 'Presupuestos', icon: DollarSign },
  { href: '/pagos', label: 'Pagos y caja', icon: Wallet },
  { href: '/historia', label: 'Historia clínica', icon: FileText },
]

// Menú para Especialista Externo
const especialistaNavItems = [
  { href: '/citas', label: 'Mis citas', icon: CalendarDays },
  { href: '/historia', label: 'Historia clínica', icon: FileText },
]

const odontogramaItems = [
  { href: '/odontograma', label: 'Simple (FDI)' },
  { href: '/odontograma-leyenda', label: 'Con Leyenda' },
  { href: '/odontograma-superficies', label: 'Por Superficies' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Determinar qué menú mostrar según el rol
  const navItems = user?.role === 'especialista' ? especialistaNavItems : odontologoNavItems
  const showOdontograma = true
  const showConfiguration = user?.role !== 'especialista'
  const showPresupuestos = user?.role !== 'especialista'
  const userInitials = (user?.nombres?.[0] || '') + (user?.apellidos?.[0] || '')
  const userRole = user?.role === 'especialista' ? 'Especialista' : 'Odontólogo'

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Stethoscope className="size-4.5" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">Clínica Dental</span>
          <span className="text-[11px] leading-tight text-sidebar-foreground/60">
            Mollendo, Arequipa
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Navegación principal">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}

        {/* Odontogram submenu */}
        {showOdontograma && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75">
              <Smile className="size-4.5 shrink-0" aria-hidden="true" />
              Odontograma
            </div>
            <div className="ml-6 flex flex-col gap-1">
              {odontogramaItems.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                      active
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="flex flex-col gap-1 border-t border-sidebar-border p-3">
        {showConfiguration && (
          <Link
            href="/configuracion"
            aria-current={pathname === '/configuracion' ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === '/configuracion'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            <Settings className="size-4.5 shrink-0" aria-hidden="true" />
            Configuración
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
        >
          <LogOut className="size-4.5 shrink-0" aria-hidden="true" />
          Cerrar sesión
        </button>
        <div className="mt-2 flex items-center gap-3 rounded-lg bg-sidebar-accent/60 px-3 py-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">
              {user?.nombres} {user?.apellidos}
            </span>
            <span className="truncate text-[11px] text-sidebar-foreground/60">
              {userRole}
              {user?.especialidad && ` — ${user.especialidad}`}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
