# Guía de Implementación - Sistema de Gestión Odontológica con Roles de Especialista Externo

## Descripción General

Se ha implementado un **sistema de autenticación simple con roles** que permite diferenciar el acceso entre:
- **Odontólogo/Administrador**: Acceso completo a todos los módulos
- **Especialista Externo**: Acceso limitado solo a citas, odontograma e historia clínica

Este documento describe:
1. Cómo acceder al sistema
2. Diferencia de accesos por rol
3. Estructura de la base de datos (diagrama)
4. Próximos pasos para implementación con base de datos real

---

## 🔐 Acceso al Sistema

### Usuarios de Prueba

| Rol | Email | Contraseña | Acceso |
|-----|-------|-----------|--------|
| **Odontólogo (Admin)** | `admin@clinicadental.com` | `Admin123!` | Completo |
| **Especialista Externo** | `especialista@clinicadental.com` | `Especialista123!` | Limitado |

### Cómo Iniciar Sesión

1. Ir a `http://localhost:3000/login`
2. Ingresar correo y contraseña
3. Hacer clic en "Ingresar al sistema"
4. Serás redirigido al panel correspondiente según tu rol

---

## 📊 Diferencias de Acceso por Rol

### Odontólogo / Administrador

**Sidebar Visible:**
```
✅ Panel de control
✅ Agenda de citas
✅ Presupuestos
✅ Pagos y caja
✅ Historia clínica
✅ Odontograma
   ├─ Simple (FDI)
   ├─ Con Leyenda
   └─ Por Superficies
✅ Configuración
✅ Cerrar sesión
```

**Funcionalidades:**
- Ver todos los pacientes
- Crear y editar presupuestos
- Registrar pagos
- Crear y editar citas
- Acceder al odontograma
- Asignar citas a especialistas externos
- Configurar el sistema

---

### Especialista Externo

**Sidebar Visible:**
```
✅ Mis citas
✅ Historia clínica
✅ Odontograma
   ├─ Simple (FDI)
   ├─ Con Leyenda
   └─ Por Superficies
✅ Cerrar sesión

❌ Panel de control (oculto)
❌ Presupuestos (oculto)
❌ Pagos y caja (oculto)
❌ Configuración (oculto)
```

**Funcionalidades:**
- Ver solo mis citas asignadas
- Ver odontograma de mis pacientes
- Ver historia clínica de mis pacientes
- ⚠️ Registrar consulta externa (por implementar):
  - Diagnóstico
  - Notas clínicas
  - Fecha próxima cita
  - Presupuesto total
  - Costo por sesión

---

## 🗄️ Estructura de Base de Datos

Consulta el archivo `DATABASE_DIAGRAM.md` para ver el diagrama completo en formato Mermaid con todas las tablas y relaciones.

### Tablas Principales

**Para el rol de Especialista Externo:**

```
SPECIALIST_CONSULTATIONS
├─ id (PK)
├─ paciente_id (FK)
├─ specialist_id (FK)
├─ cita_id (FK, opcional)
├─ fecha_consulta
├─ diagnostico (texto largo)
├─ notas_clinicas (texto largo)
├─ fecha_proxima_cita
├─ presupuesto_total
├─ estado (enum)
└─ SPECIALIST_SESSIONS
   ├─ numero_sesion
   ├─ monto (costo por sesión)
   └─ estado
```

---

## 📝 Formulario para Registrar Consulta Externa

Cuando se implemente, el especialista podrá registrar:

```json
{
  "diagnostico": "Mordida cruzada anterior, apiñamiento leve",
  "notas_clinicas": "Requiere corrección de mordida. Evaluación completa realizada.",
  "fecha_proxima_cita": "2026-07-29",
  "presupuesto_total": 800.00,
  "sesiones": [
    {
      "numero": 1,
      "monto": 200.00,
      "estado": "pendiente"
    },
    {
      "numero": 2,
      "monto": 200.00,
      "estado": "pendiente"
    },
    {
      "numero": 3,
      "monto": 200.00,
      "estado": "pendiente"
    },
    {
      "numero": 4,
      "monto": 200.00,
      "estado": "pendiente"
    }
  ]
}
```

---

## 🛠️ Archivos Modificados

### Nuevos Archivos Creados

1. **`lib/auth-context.tsx`**
   - Context de autenticación con useAuth hook
   - Lógica de login/logout
   - Usuarios de prueba hardcodeados

2. **`app/(app)/protected-layout.tsx`**
   - Wrapper de protección para rutas
   - Redirección a login si no hay usuario

3. **`DATABASE_DIAGRAM.md`**
   - Diagrama ER completo en Mermaid
   - Descripción de todas las tablas
   - Índices recomendados

4. **`IMPLEMENTATION_GUIDE.md`** (este archivo)
   - Guía de uso del sistema
   - Documentación de roles
   - Próximos pasos

### Archivos Modificados

1. **`app/layout.tsx`**
   - Agregado AuthProvider wrapper

2. **`app/(app)/layout.tsx`**
   - Agregado ProtectedLayout para proteger rutas

3. **`components/app-sidebar.tsx`**
   - Menú dinámico basado en rol
   - Muestra diferentes items según user.role
   - Logout funcional

4. **`components/login-form.tsx`**
   - Integración con useAuth context
   - Validación de credenciales
   - Mostrar usuarios de prueba

---

## 🚀 Próximos Pasos para Implementar Base de Datos Real

### Fase 1: Configurar Neon + Drizzle + Better Auth

```bash
# 1. Instalar dependencias
pnpm add better-auth pg drizzle-orm
pnpm add -D @types/pg

# 2. Crear variables de entorno
# DATABASE_URL=postgresql://...
# BETTER_AUTH_SECRET=<generate con: openssl rand -base64 32>
```

### Fase 2: Crear Schema

Usar el `DATABASE_DIAGRAM.md` como referencia para crear las tablas:
1. Tabla `users` con roles (admin, odontologo, especialista)
2. Tabla `specialist_consultations` para registrar consultas externas
3. Tabla `specialist_sessions` para sesiones por especialista
4. Relaciones con `appointments`, `patients`, etc.

### Fase 3: Crear API Routes para Especialista

Endpoints necesarios:
- `GET /api/specialist/appointments` - Mis citas asignadas
- `POST /api/specialist/consultations` - Registrar consulta
- `GET /api/specialist/consultations/:citaId` - Ver consulta
- `GET /api/specialist/patients/:pacienteId` - Ver paciente

### Fase 4: Crear Formulario de Registración de Consulta

En `app/(app)/especialistas/consulta/[id]/page.tsx`:
```tsx
- Campo: Diagnóstico (textarea)
- Campo: Notas clínicas (textarea)
- Campo: Fecha próxima cita (date picker)
- Campo: Presupuesto total (number)
- Tabla dinámicamente editable: Sesiones
  - Número de sesión (auto)
  - Monto por sesión (number)
  - Estado (select: pendiente/pagado)
- Botón: Guardar
```

### Fase 5: Restringir Acceso en API

En cada route handler de especialista, verificar:
```tsx
const userId = await getUserId() // De Better Auth
const specialist = await db.query
  .select()
  .from(specialists)
  .where(eq(specialists.user_id, userId))

// Verificar que las citas pertenezcan a este especialista
```

---

## 🔍 Arquitectura de Autenticación Actual

```
┌─────────────────────────────────────────┐
│          Root Layout (layout.tsx)        │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │      AuthProvider                 │  │
│  │  (almacena user en state + LS)    │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   ThemeProvider             │  │  │
│  │  │                             │  │  │
│  │  │  ┌─────────────────────────┐ │  │  │
│  │  │  │  App Layout             │ │  │  │
│  │  │  │  ┌───────────────────┐   │ │  │  │
│  │  │  │  │ ProtectedLayout   │   │ │  │  │
│  │  │  │  │ (redirect a login)│   │ │  │  │
│  │  │  │  │                   │   │ │  │  │
│  │  │  │  │ ┌───────────────┐ │   │ │  │  │
│  │  │  │  │ │ AppSidebar    │ │   │ │  │  │
│  │  │  │  │ │ (role-based)  │ │   │ │  │  │
│  │  │  │  │ └───────────────┘ │   │ │  │  │
│  │  │  │  │                   │   │ │  │  │
│  │  │  │  │ [Content Pages]   │   │ │  │  │
│  │  │  │  └───────────────────┘   │ │  │  │
│  │  │  └─────────────────────────┘ │  │  │
│  │  └─────────────────────────────┘ │  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📱 Flujo de Login

```
Login Page (login/page.tsx)
    ↓
LoginForm Component
    ├─ Input: Email
    ├─ Input: Password
    └─ Button: Ingresar
        ↓
    useAuth().login()
        ↓
    Validar contra TEST_USERS
        ↓
    Si válido:
    ├─ localStorage.setItem('auth_user', {...})
    ├─ setUser(userData)
    └─ router.push('/')
        ↓
    App Layout (ProtectedLayout)
        ├─ Verifica useAuth().user
        ├─ Si existe: muestra contenido
        └─ Si no existe: redirige a /login
```

---

## 🎯 Casos de Uso

### Caso 1: Odontólogo Asigna Cita a Especialista

1. Odontólogo entra a "Agenda de citas"
2. Selecciona una cita de un paciente
3. Selecciona especialista (ej: Dr. Carlos Mendoza - Ortodoncista)
4. Guarda la cita
5. La cita aparece en "Mis citas" del especialista

### Caso 2: Especialista Registra Consulta Externa

1. Especialista entra a "Mis citas"
2. Ve sus citas asignadas en calendario
3. Hace clic en una cita
4. Abre formulario "Registrar Consulta"
5. Completa:
   - Diagnóstico
   - Notas clínicas
   - Fecha próxima cita
   - Presupuesto total y sesiones
6. Guarda

### Caso 3: Odontólogo Ve Consulta de Especialista

1. Odontólogo entra a "Historia clínica" del paciente
2. Ve sección "Consultas externas"
3. Ve consulta registrada por especialista
4. Puede ver:
   - Diagnóstico
   - Notas
   - Próxima cita
   - Presupuesto y desglose de sesiones

---

## ⚙️ Variables de Entorno (Actual)

Sin base de datos, no se requieren variables. Una vez implementada la BD:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dental_clinic

# Authentication
BETTER_AUTH_SECRET=<generar con: openssl rand -base64 32>
BETTER_AUTH_URL=https://tu-dominio.com (opcional)
```

---

## 🧪 Testing del Sistema

### Test 1: Verificar Login de Odontólogo
```bash
# 1. Ir a http://localhost:3000/login
# 2. Ingresar: admin@clinicadental.com / Admin123!
# 3. Verificar que:
#    - Sidebar muestra "Panel de control", "Presupuestos", "Pagos", etc.
#    - Usuario muestra "Valeria Salas - Odontólogo"
```

### Test 2: Verificar Login de Especialista
```bash
# 1. Logout (Cerrar sesión)
# 2. Ingresar: especialista@clinicadental.com / Especialista123!
# 3. Verificar que:
#    - Sidebar SOLO muestra: "Mis citas", "Historia clínica", "Odontograma"
#    - NO ve: "Presupuestos", "Pagos", "Configuración"
#    - Usuario muestra "Carlos Mendoza - Especialista — Ortodoncista"
```

### Test 3: Verificar Protección de Rutas
```bash
# 1. Logout
# 2. Ir directamente a http://localhost:3000/presupuestos
# 3. Verificar que redirige a /login
```

---

## 📚 Referencias de Archivos

- **`DATABASE_DIAGRAM.md`** - Diagrama completo de la BD
- **`lib/auth-context.tsx`** - Sistema de autenticación
- **`app/(app)/protected-layout.tsx`** - Protección de rutas
- **`components/app-sidebar.tsx`** - Menú dinámico por rol
- **`components/login-form.tsx`** - Formulario de login

---

## ✅ Checklist de Implementación

- [x] Sistema de login con usuarios hardcodeados
- [x] Autenticación basada en contexto de React
- [x] Protección de rutas
- [x] Menú dinámico por rol
- [x] Sidebar para odontólogo con acceso completo
- [x] Sidebar para especialista con acceso limitado
- [x] Diagrama de BD en Mermaid
- [ ] Conectar a base de datos Neon
- [ ] Crear tablas en BD
- [ ] API routes para especialista
- [ ] Formulario de registración de consulta
- [ ] Restricción de acceso en API por usuario

---

## 🤝 Soporte

Para preguntas sobre la implementación, consulta:
1. `DATABASE_DIAGRAM.md` - Estructura de datos
2. `lib/auth-context.tsx` - Sistema de autenticación
3. `components/app-sidebar.tsx` - Lógica de menú por rol

