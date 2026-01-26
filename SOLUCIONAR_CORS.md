# 🔧 SOLUCIÓN RÁPIDA: Error CORS en Firebase Storage

## ❌ Error que estás viendo:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

## ✅ SOLUCIÓN (Elige UNA opción):

---

### **OPCIÓN 1: Google Cloud Console (MÁS FÁCIL - RECOMENDADA)**

1. Ve a: https://console.cloud.google.com
2. Selecciona tu proyecto: `datapal-1fc19`
3. En el menú lateral, busca **Cloud Storage** > **Buckets**
4. Click en tu bucket: `datapal-1fc19.firebasestorage.app`
5. Ve a la pestaña **"Permissions"** (Permisos)
6. Scroll hasta encontrar **"CORS configuration"**
7. Click en **"Edit CORS configuration"**
8. Pega esta configuración:

```json
[
  {
    "origin": ["http://localhost:3000", "https://*.vercel.app"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "User-Agent",
      "X-Requested-With"
    ]
  }
]
```

9. Click **"Save"**
10. **Espera 2-3 minutos** para que se propague
11. Refresca tu aplicación (Ctrl + F5)

---

### **OPCIÓN 2: Google Cloud CLI (Para desarrolladores)**

#### Paso 1: Instalar Google Cloud SDK

**Windows:**
- Descarga: https://cloud.google.com/sdk/docs/install
- Ejecuta el instalador
- Reinicia la terminal

**Mac:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

#### Paso 2: Autenticarte
```bash
gcloud auth login
gcloud config set project datapal-1fc19
```

#### Paso 3: Aplicar CORS
```bash
cd C:\Users\alimr\Documents\datapal
gsutil cors set cors.json gs://datapal-1fc19.firebasestorage.app
```

#### Paso 4: Verificar que se aplicó
```bash
gsutil cors get gs://datapal-1fc19.firebasestorage.app
```

Deberías ver la configuración que acabas de aplicar.

---

## 🔍 Verificar que funcionó

1. Refresca tu aplicación (Ctrl + F5)
2. Intenta subir un logo nuevamente
3. Abre la consola (F12) y verifica que **NO** haya errores CORS

---

## ⚠️ IMPORTANTE

- Los cambios pueden tardar **1-3 minutos** en propagarse
- Si sigues viendo el error después de 5 minutos, limpia la caché del navegador:
  - Chrome: Ctrl + Shift + Delete
  - Selecciona "Imágenes y archivos en caché"
  - Click "Borrar datos"
- Intenta en modo incógnito (Ctrl + Shift + N)

---

## 🆘 Si aún no funciona

Es posible que el bucket tenga restricciones adicionales. En ese caso:

1. Ve a Firebase Console: https://console.firebase.google.com
2. Selecciona tu proyecto
3. Ve a **Storage** en el menú lateral
4. Click en **Rules**
5. Asegúrate de tener estas reglas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de logos
    match /client-logos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Permitir solo al dueño leer/escribir reportes
    match /reports/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Click **"Publish"**

---

## 📞 Necesitas más ayuda?

Si después de seguir estos pasos el error persiste, puede ser por:
- Firewall corporativo
- VPN bloqueando Firebase
- Configuración de red local

En ese caso, prueba:
1. Desactiva temporalmente VPN
2. Prueba desde otra red (hotspot móvil)
3. Verifica que no haya extensiones de navegador bloqueando (AdBlock, etc.)
