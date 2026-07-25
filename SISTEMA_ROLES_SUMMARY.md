# 🏥 Sistema de Gestión Odontológica - Acceso por Roles

## Resumen Ejecutivo

Se ha implementado un **sistema de autenticación por roles** que permite diferencias de acceso entre odontólogos y especialistas externos. El sistema es **completamente funcional** con usuarios de prueba hardcodeados (sin BD).

---

## 👥 Usuarios de Prueba

### 1️⃣ Odontólogo / Administrador
```
📧 Email: admin@clinicadental.com
🔐 Password: Admin123!

Acceso: COMPLETO
```

### 2️⃣ Especialista Externo (Ortodoncista)
```
📧 Email: especialista@clinicadental.com
🔐 Password: Especialista123!

Acceso: LIMITADO
```

---

## 🎯 Accesos Diferenciados

### 📋 Menú del Odontólogo
```
✅ Panel de control           → Dashboard con métricas
✅ Agenda de citas            → Ver todas las citas
✅ Presupuestos              → Crear y gestionar presupuestos
✅ Pagos y caja              → Registrar pagos
✅ Historia clínica          → Ver historia de pacientes
✅ Odontograma (3 vistas)    → Registrar hallazgos
✅ Configuración             → Ajustes del sistema
✅ Cerrar sesión             → Logout
```

### 📋 Menú del Especialista Externo
```
✅ Mis citas                 → Solo citas asignadas
✅ Historia clínica          → Historia de sus pacientes
✅ Odontograma (3 vistas)    → Ver odontograma
✅ Cerrar sesión             → Logout

❌ Panel de control          → OCULTO
❌ Presupuestos              → OCULTO
❌ Pagos y caja              → OCULTO
❌ Configuración             → OCULTO
```

---

## 📊 Funcionalidades Implementadas

| Función | Odontólogo | Especialista |
|---------|-----------|--------------|
| Ver dashboard | ✅ | ❌ |
| Ver todas las citas | ✅ | ❌ |
| Ver mis citas | ✅ | ✅ |
| Crear presupuestos | ✅ | ❌ |
| Registrar pagos | ✅ | ❌ |
| Ver historia clínica | ✅ | ✅ |
| Ver odontograma | ✅ | ✅ |
| Acceso a configuración | ✅ | ❌ |
| **Registrar consulta externa** | ❌ | **⏳ Por hacer** |

---

## 🔄 Flujo de Registro - Consulta Externa (A IMPLEMENTAR)

El especialista podrá:

```
Mis citas → Seleccionar cita → Botón "Registrar Consulta"
    ↓
Formulario:
├─ Diagnóstico (textarea)
├─ Notas clínicas (textarea)  
├─ Fecha próxima cita
├─ Presupuesto total
└─ Tabla de sesiones:
   ├─ Sesión 1: $200
   ├─ Sesión 2: $200
   ├─ Sesión 3: $200
   └─ Sesión 4: $200
    ↓
Guardar → Registrada en BD
```

---

## 🗄️ Estructura de Base de Datos

### Tabla: `specialist_consultations`
```sql
CREATE TABLE specialist_consultations (
  id TEXT PRIMARY KEY,
  paciente_id TEXT NOT NULL,          -- Paciente tratado
  specialist_id TEXT NOT NULL,         -- Especialista que registra
  cita_id TEXT,                        -- Cita asociada
  fecha_consulta TIMESTAMP,
  diagnostico TEXT,                   -- Diagnóstico detallado
  notas_clinicas TEXT,                -- Notas del tratamiento
  fecha_proxima_cita DATE,            -- Cuándo vuelve
  presupuesto_total DECIMAL(10,2),   -- Total estimado
  estado ENUM(...),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Tabla: `specialist_sessions`
```sql
CREATE TABLE specialist_sessions (
  id TEXT PRIMARY KEY,
  consulta_id TEXT NOT NULL,          -- De qué consulta
  numero_sesion INT,                  -- Número: 1, 2, 3, 4...
  monto DECIMAL(10,2),               -- Costo de esta sesión
  estado ENUM('pendiente', 'pagado'), 
  fecha_pago DATE,
  created_at TIMESTAMP
)
```

---

## 🔐 Autenticación

### Tecnología
- **Client-side**: React Context + localStorage
- **Future (BD real)**: Better Auth + Neon PostgreSQL

### Flujo Actual
```
Login Form
    ↓
Valida contra TEST_USERS en auth-context.tsx
    ↓
Guarda en localStorage
    ↓
Redirige a dashboard
    ↓
AppSidebar verifica role
    ↓
Muestra menú correspondiente
```

---

## 📁 Archivos Principales

### Nuevos
- **`lib/auth-context.tsx`** - Sistema de autenticación con roles
- **`app/(app)/protected-layout.tsx`** - Protección de rutas
- **`DATABASE_DIAGRAM.md`** - Diagrama ER completo en Mermaid
- **`IMPLEMENTATION_GUIDE.md`** - Guía detallada de implementación

### Modificados
- **`app/layout.tsx`** - Agregado AuthProvider
- **`app/(app)/layout.tsx`** - Agregado ProtectedLayout
- **`components/app-sidebar.tsx`** - Menú dinámico por rol
- **`components/login-form.tsx`** - Integración de autenticación

---

## 🚀 Cómo Probar

### 1. Iniciar el servidor
```bash
pnpm dev
```

### 2. Ir a login
```
http://localhost:3000/login
```

### 3. Probar como Odontólogo
```
Email: admin@clinicadental.com
Password: Admin123!
```
✅ Verás: Panel, Presupuestos, Pagos, Configuración

### 4. Logout
```
Sidebar → Cerrar sesión
```

### 5. Probar como Especialista
```
Email: especialista@clinicadental.com
Password: Especialista123!
```
✅ Verás SOLO: Mis citas, Historia clínica, Odontograma

### 6. Verificar protección
```
Logout → Ir a http://localhost:3000/presupuestos
```
✅ Redirige automáticamente a /login

---

## 📈 Próximos Pasos

### Fase 1: Base de Datos
- [ ] Conectar Neon PostgreSQL
- [ ] Crear tablas según `DATABASE_DIAGRAM.md`
- [ ] Migrar de localStorage a Better Auth

### Fase 2: API de Especialista
- [ ] `GET /api/specialist/appointments` - Mis citas
- [ ] `POST /api/specialist/consultations` - Crear consulta
- [ ] `GET /api/specialist/consultations` - Ver consultas
- [ ] `PUT /api/specialist/consultations/:id` - Editar

### Fase 3: Formulario de Consulta
- [ ] Crear componente SpecialistConsultationForm
- [ ] Integrar en `/app/(app)/citas/page.tsx`
- [ ] Validar campos
- [ ] Guardar en BD

### Fase 4: Restricciones de Acceso
- [ ] Verificar user_id en cada API
- [ ] Especialista solo ve sus citas
- [ ] Especialista solo ve sus consultas
- [ ] Especialista no puede ver presupuestos

---

## 💾 Base de Datos - Diagrama Completo

Ver **`DATABASE_DIAGRAM.md`** para:
- Diagrama ER en Mermaid
- Descripción de cada tabla
- Relaciones entre entidades
- Índices recomendados
- Campos específicos para cada rol

---

## 📚 Documentación Completa

1. **`IMPLEMENTATION_GUIDE.md`** - Guía paso a paso
2. **`DATABASE_DIAGRAM.md`** - Estructuras de BD
3. **`SISTEMA_ROLES_SUMMARY.md`** - Este documento (resumen)

---

## ✨ Características del Sistema

### Autenticación
✅ Login con email/password  
✅ Sesiones persistentes (localStorage)  
✅ Logout con limpieza  
✅ Redirección automática no autenticados  

### Autorización
✅ Protección de rutas  
✅ Menú dinámico por rol  
✅ Sidebar diferenciado  
✅ Información del usuario visible  

### UX
✅ Formulario de login elegante  
✅ Usuarios de prueba mostrados  
✅ Transiciones suaves  
✅ Mensajes de error claros  

---

## 🎓 Notas Importantes

### Autenticación Actual (SIN BD)
- Usuarios hardcodeados
- Sesiones en localStorage
- Para demo/testing

### Autenticación Futura (CON BD)
- Better Auth con Neon
- Hash de contraseñas
- Sesiones en BD
- Recuperación de contraseña
- 2FA (opcional)

---

## 📞 Preguntas Frecuentes

**P: ¿Dónde se guardan las sesiones?**  
R: Actualmente en localStorage. Con BD real, en tabla `sessions` de Better Auth.

**P: ¿Cómo cambio los usuarios de prueba?**  
R: Edita `lib/auth-context.tsx` en const `TEST_USERS`.

**P: ¿Puedo ver la consulta registrada por especialista?**  
R: Aún no. Se implementará cuando se agregue la tabla `specialist_consultations`.

**P: ¿Qué pasa si el especialista intenta acceder a /presupuestos?**  
R: El ProtectedLayout redirige a /login (falta implementar redirección a home).

**P: ¿Cómo añado un nuevo rol?**  
R: 1. Edita `type UserRole` en `auth-context.tsx`  
   2. Añade array de navItems en `app-sidebar.tsx`  
   3. Añade usuario de prueba en `TEST_USERS`

---

## 🏁 Estado de Implementación

```
├─ Autenticación básica..................✅ COMPLETO
├─ Sistema de roles.......................✅ COMPLETO
├─ Menú diferenciado.......................✅ COMPLETO
├─ Protección de rutas.....................✅ COMPLETO
├─ Diagrama de BD..........................✅ COMPLETO
├─ Documentación...........................✅ COMPLETO
│
├─ Base de datos real......................⏳ POR HACER
├─ API de especialista.....................⏳ POR HACER
├─ Formulario de consulta..................⏳ POR HACER
├─ Restricciones en API....................⏳ POR HACER
└─ Tests automatizados.....................⏳ POR HACER
```

---

**Sistema listo para probar. Accede con los usuarios de prueba y explora!** 🎉
