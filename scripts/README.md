# Scripts de Configuración - DataPal

## init-demo-user.ts

Script para crear el usuario demo y cargar reportes de ejemplo en Firebase.

### Prerrequisitos

1. **Obtener credenciales de Firebase Admin:**
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Selecciona el proyecto `datapal-1fc19`
   - Ve a **Project Settings** > **Service Accounts**
   - Click en **"Generate new private key"**
   - Guarda el archivo descargado como: `scripts/serviceAccountKey.json`

2. **Agregar variable de entorno (opcional):**
   ```bash
   # En .env.local
   DEMO_USER_PASSWORD=tu_password_seguro
   ```
   Si no agregas esta variable, el script generará una contraseña automáticamente.

### Ejecución

```bash
npx ts-node scripts/init-demo-user.ts
```

### Qué hace el script

1. ✅ Verifica si el usuario `demo@datapal.cl` ya existe
2. ✅ Si no existe, lo crea con password seguro
3. ✅ Establece custom claims: `{ isDemo: true }`
4. ✅ Crea documento en `/users/[demo_uid]` con:
   - `email`: "demo@datapal.cl"
   - `displayName`: "Usuario Demo"
   - `isDemo`: true
   - `subscription`: { status: "demo", plan: "unlimited" }
5. ✅ Carga 5 reportes de ejemplo desde `demo-data/reportes-ejemplo.json`

### Reportes de Ejemplo Incluidos

| ID | Título | Tipo | Plataformas |
|----|--------|------|-------------|
| demo_report_enero_2025 | Reporte Mensual - Enero 2025 | monthly_report | Instagram |
| demo_report_diciembre_2024 | Reporte Mensual - Diciembre 2024 | monthly_report | Instagram |
| demo_report_analisis_q4 | Análisis Q4 2024 - Tendencias | analysis | Instagram, Facebook |
| demo_report_mejoras_engagement | Evidencia de Mejoras - Engagement | improvements | Instagram |
| demo_report_campana_lanzamiento | Campaña Lanzamiento Producto X | analysis | Instagram, Facebook |

### Output Esperado

```
🚀 Iniciando configuración del usuario demo...

✅ Usuario demo creado exitosamente
   UID: xxxxxxxxxxxxx
   Email: demo@datapal.cl

📝 Estableciendo custom claims...
✅ Custom claims establecidos: { isDemo: true }

📝 Creando documento de usuario en Firestore...
✅ Documento de usuario creado/actualizado

📝 Cargando reportes de ejemplo...
   ✅ Reporte cargado: Reporte Mensual - Enero 2025
   ✅ Reporte cargado: Reporte Mensual - Diciembre 2024
   ...

✅ 5 reportes de ejemplo cargados

==================================================
📋 RESUMEN DE CONFIGURACIÓN
==================================================
Usuario Demo UID: xxxxxxxxxxxxx
Email: demo@datapal.cl
Custom Claims: { isDemo: true }
Reportes cargados: 5
==================================================

🎉 Configuración completada exitosamente!
```

### Variables a Agregar en .env.local

Después de ejecutar el script, agrega estas variables:

```bash
# Usuario Demo
DEMO_USER_UID=el_uid_generado
DEMO_USER_PASSWORD=el_password_generado  # Si no lo especificaste antes
```

### Idempotencia

El script es idempotente:
- Si el usuario ya existe, no lo duplica
- Si los reportes ya existen, los actualiza (merge)
- Puedes ejecutarlo múltiples veces sin problemas

### Seguridad

⚠️ **IMPORTANTE**: No subas `serviceAccountKey.json` al repositorio.

El archivo `.gitignore` ya debería incluir:
```
scripts/serviceAccountKey.json
```
