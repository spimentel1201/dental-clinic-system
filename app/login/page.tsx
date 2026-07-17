import type { Metadata } from 'next'
import { LoginForm } from '@/components/login-form'
import { Stethoscope, ShieldCheck, CalendarDays, Wallet } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Iniciar sesión — DentaClinic',
  description: 'Acceso al sistema de gestión odontológica integral.',
}

const highlights = [
  {
    icon: CalendarDays,
    title: 'Agenda inteligente',
    description: 'Citas sin cruces de horario y recordatorios diarios.',
  },
  {
    icon: Wallet,
    title: 'Caja flexible',
    description: 'Pagos diferidos y saldo deudor en tiempo real.',
  },
  {
    icon: ShieldCheck,
    title: 'Acceso por roles',
    description: 'Datos clínicos visibles solo para personal autorizado.',
  },
]

export default function LoginPage() {
  return (
    <main className="flex min-h-svh">
      <section className="hidden flex-1 flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Stethoscope className="size-5" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold">DentaClinic</span>
        </div>

        <div className="flex max-w-md flex-col gap-8">
          <h2 className="text-balance text-3xl font-semibold leading-tight">
            Gestión odontológica integral para tu clínica
          </h2>
          <div className="flex flex-col gap-5">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
                  <item.icon className="size-4.5 text-sidebar-primary" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-sm leading-relaxed text-sidebar-foreground/65">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-sidebar-foreground/50">
          Centro Odontológico — Mollendo, Arequipa
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-10">
        <LoginForm />
      </section>
    </main>
  )
}
