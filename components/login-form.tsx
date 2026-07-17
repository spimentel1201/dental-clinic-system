'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

const ROLES: Record<string, string> = {
  doctor: 'Odontólogo / Administrador',
  recepcion: 'Recepción',
}

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rol, setRol] = useState('doctor')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/'), 600)
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
            <FieldLabel htmlFor="rol">Perfil de acceso</FieldLabel>
            <Select value={rol} onValueChange={(v) => v && setRol(String(v))}>
              <SelectTrigger id="rol" className="w-full">
                <SelectValue>{ROLES[rol]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="doctor">Odontólogo / Administrador</SelectItem>
                  <SelectItem value="recepcion">Recepción</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              El perfil determina los módulos y permisos disponibles.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="usuario">Usuario o correo</FieldLabel>
            <Input
              id="usuario"
              type="text"
              placeholder="doctora@dentaclinic.pe"
              autoComplete="username"
              required
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
              >
                {'¿Olvidaste tu contraseña?'}
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
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

          <Field>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner data-icon="inline-start" /> : null}
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Acceso restringido al personal autorizado. Toda la actividad queda registrada para
        garantizar la seguridad de los datos clínicos.
      </p>
    </div>
  )
}
