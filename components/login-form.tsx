'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Stethoscope, AlertCircle } from 'lucide-react'
import { useAuth, type UserRole } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

export function LoginForm() {
  const router = useRouter()
  const { login, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // Redirect based on role - specialists go directly to their appointments
      const redirectUrl = email.includes('especialista') ? '/citas' : '/'
      router.push(redirectUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
          <Stethoscope className="size-6" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Ingresa tus credenciales para acceder al sistema de gestión.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="correo@clinicadental.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </Field>

          {error && (
            <div className="flex gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <Field>
            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full"
            >
              {loading ? <Spinner data-icon="inline-start" /> : null}
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {/* Test Users */}
      <div className="space-y-3 border-t border-border pt-6">
        <p className="text-xs font-semibold text-muted-foreground">
          USUARIOS DE PRUEBA
        </p>
        <div className="space-y-2 text-xs">
          <div className="rounded-lg bg-muted p-3">
            <p className="font-medium">👨‍⚕️ Odontólogo (Admin)</p>
            <p className="mt-1 font-mono text-muted-foreground/75">
              admin@clinicadental.com
            </p>
            <p className="font-mono text-muted-foreground/75">Admin123!</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="font-medium">👨‍🔬 Especialista Externo</p>
            <p className="mt-1 font-mono text-muted-foreground/75">
              especialista@clinicadental.com
            </p>
            <p className="font-mono text-muted-foreground/75">
              Especialista123!
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Acceso restringido al personal autorizado. Toda la actividad queda registrada para
        garantizar la seguridad de los datos clínicos.
      </p>
    </div>
  )
}
