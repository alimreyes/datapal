# 🔥 Configurar CORS en Firebase Storage

Este error ocurre cuando Firebase Storage bloquea peticiones desde tu dominio local debido a políticas CORS.

## 📋 Solución Rápida

### Opción 1: Usar Google Cloud Console (Recomendado)

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Selecciona tu proyecto de Firebase
3. Ve a **Cloud Storage** > **Buckets**
4. Selecciona tu bucket (ej: `datapal-1fc19.appspot.com`)
5. Click en los 3 puntos (⋮) > **Edit bucket permissions**
6. En la pestaña **CORS**, agrega esta configuración:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type"]
  }
]
```

### Opción 2: Usar gsutil CLI

1. **Instalar Google Cloud SDK:**
   - Windows: https://cloud.google.com/sdk/docs/install
   - Mac: `brew install google-cloud-sdk`
   - Linux: `curl https://sdk.cloud.google.com | bash`

2. **Autenticarte:**
   ```bash
   gcloud auth login
   gcloud config set project TU_PROJECT_ID
   ```

3. **Aplicar configuración CORS:**
   ```bash
   gsutil cors set cors.json gs://TU_BUCKET_NAME.appspot.com
   ```

   Ejemplo:
   ```bash
   gsutil cors set cors.json gs://datapal-1fc19.appspot.com
   ```

4. **Verificar la configuración:**
   ```bash
   gsutil cors get gs://TU_BUCKET_NAME.appspot.com
   ```

## 🔒 Configuración CORS para Producción

En producción, **NO uses `"origin": ["*"]`**. Especifica tus dominios:

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "https://tu-dominio.vercel.app",
      "https://datapal.com"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type"]
  }
]
```

## 🧪 Probar que Funciona

1. Refresca tu aplicación (Ctrl + F5)
2. Intenta subir un logo nuevamente
3. Verifica en la consola del navegador que no haya errores CORS

## ⚠️ Notas Importantes

- Los cambios de CORS pueden tardar unos minutos en propagarse
- Si usas Firebase Authentication, asegúrate de que las reglas de Storage permitan lectura/escritura
- Para desarrollo local, `"origin": ["*"]` está bien, pero **cambia esto en producción**

## 🔐 Reglas de Seguridad de Firebase Storage

También necesitas configurar las reglas de Storage. Ve a **Firebase Console** > **Storage** > **Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de logos
    match /client-logos/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Permitir solo al dueño leer/escribir CSVs
    match /reports/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🆘 ¿Aún no funciona?

1. Verifica que el bucket name sea correcto
2. Asegúrate de tener permisos de administrador en el proyecto
3. Limpia la caché del navegador (Ctrl + Shift + Delete)
4. Prueba en modo incógnito
