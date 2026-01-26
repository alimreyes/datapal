# 📊 DataPal - Social Media Analytics & Reports

Analiza el desempeño de tus redes sociales con reportes profesionales. Visualizaciones avanzadas, insights automáticos y exportación PDF para Instagram y Facebook.

![DataPal Banner](https://datapal.vercel.app/og-image.png)

## ✨ Características

### 📈 Análisis Completo
- **Múltiples categorías de métricas**: Alcance, Impresiones, Interacciones, Seguidores, Contenido, Visitas al Perfil
- **Instagram y Facebook**: Analiza ambas plataformas en un solo reporte
- **Visualizaciones profesionales**: Gráficos interactivos con Recharts

### 🎨 Dashboard Intuitivo
- **Lista de reportes** con búsqueda y filtros
- **Estadísticas en tiempo real**: Total de reportes, reportes del mes, plataforma principal
- **Acciones rápidas**: Ver, exportar PDF, eliminar reportes

### 📊 Reportes Detallados
- **Executive Summary**: Resumen ejecutivo con métricas clave
- **Engagement Rate**: Análisis de engagement con tendencias
- **Comparación de plataformas**: Instagram vs Facebook
- **Top Posts**: Ranking de contenido con mejor desempeño
- **Exportación PDF**: Genera reportes profesionales descargables

### 🔐 Seguridad
- **Autenticación con Firebase**: Login seguro con email/password y Google
- **Datos privados**: Cada usuario solo ve sus propios reportes
- **Almacenamiento seguro**: CSVs y datos protegidos en Firebase Storage

## 🚀 Demo

**URL:** [https://datapal.vercel.app](https://datapal.vercel.app)

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Autenticación**: Firebase Auth
- **Base de Datos**: Firestore
- **Storage**: Firebase Storage
- **Gráficos**: Recharts
- **PDF Export**: jsPDF + html2canvas
- **Deploy**: Vercel

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- Cuenta de Vercel (para deploy)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/datapal.git
cd datapal
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` con:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Anthropic API (para insights con IA)
ANTHROPIC_API_KEY=tu_anthropic_api_key

# Stripe (para pagos de tokens)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🏗️ Estructura del Proyecto

```
datapal/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Rutas protegidas
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── create/               # Flow de creación de reportes
│   │   └── report/[id]/          # Vista de reporte individual
│   └── api/                      # API routes
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui components
│   ├── ReportCard.tsx
│   ├── DashboardStats.tsx
│   ├── ExecutiveSummary.tsx
│   └── ...
├── lib/                          # Utilidades y lógica
│   ├── firebase/                 # Configuración Firebase
│   ├── parsers/                  # Parsers de CSV
│   ├── hooks/                    # Custom hooks
│   └── types/                    # TypeScript types
└── public/                       # Archivos estáticos
```

## 📝 Uso

### 1. Crear un Reporte

1. Haz clic en "Crear Reporte"
2. Elige el objetivo de tu análisis
3. Selecciona plataformas (Instagram, Facebook o ambas)
4. Personaliza el tema (Creativo/Analítico/Profesional)
5. Sube tus CSVs exportados de Meta Business Suite
6. ¡Listo! Tu reporte se procesará automáticamente

### 2. Ver Reportes

- **Dashboard**: Ve todos tus reportes en una lista
- **Búsqueda**: Encuentra reportes por título
- **Filtros**: Filtra por plataforma u objetivo
- **Stats**: Visualiza estadísticas de uso

### 3. Analizar Datos

Cada reporte incluye:
- Executive Summary con métricas clave
- Engagement Rate con tendencias
- 5 gráficos interactivos
- Comparación entre plataformas
- Top Posts ranking
- AI Insights (próximamente)

### 4. Exportar

- Haz clic en el botón de descarga
- Se genera un PDF profesional
- Incluye todos los gráficos y métricas
- Listo para compartir con clientes o equipo

## 🔧 Scripts

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Ejecutar build
npm run lint         # Linter
```

## 🌐 Deploy en Vercel

1. **Push a GitHub**
```bash
git add .
git commit -m "Ready for deploy"
git push origin main
```

2. **Conectar con Vercel**
- Ve a [vercel.com](https://vercel.com)
- Import tu repositorio
- Agrega las variables de entorno
- Deploy automático

3. **Configurar Firebase**
- Agrega tu dominio de Vercel a Firebase Auth (Authorized domains)
- Actualiza `NEXT_PUBLIC_APP_URL` en Vercel

## 📈 Roadmap

- [x] Autenticación completa
- [x] Upload y parsing de CSVs
- [x] 5 visualizaciones avanzadas
- [x] Dashboard con búsqueda y filtros
- [x] Export PDF
- [ ] AI Insights con Claude API
- [ ] Export a Google Slides
- [ ] Integración con Looker Studio
- [ ] Sistema de personalización con sliders
- [ ] Temas dinámicos
- [ ] Compartir reportes públicamente
- [ ] Colaboración en equipo

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👥 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Website: [tu-website.com](https://tu-website.com)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Vercel](https://vercel.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!