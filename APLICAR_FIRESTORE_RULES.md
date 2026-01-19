# 🔥 Aplicar Reglas de Firestore

## Pasos para solucionar el error de permisos en notas:

1. Ve a **Firebase Console**: https://console.firebase.google.com
2. Selecciona tu proyecto: **datapal-1fc19**
3. En el menú lateral, click en **Firestore Database**
4. Click en la pestaña **Rules** (Reglas)
5. **Copia y pega** el contenido del archivo `FIRESTORE_RULES.txt`
6. Click en **"Publish"** (Publicar)
7. Espera 10-20 segundos para que se apliquen

## ✅ Reglas que se están agregando:

```javascript
// Notas personales de reportes (NUEVA REGLA)
match /reportNotes/{noteId} {
  // Solo el dueño puede leer/escribir sus propias notas
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
  allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

Esto permitirá que:
- Los usuarios autenticados puedan **crear** notas asociadas a su cuenta
- Solo puedan **leer** sus propias notas (no las de otros usuarios)
- Solo puedan **actualizar/eliminar** sus propias notas

## 🔍 Verificar

Después de aplicar las reglas:
1. Refresca tu aplicación
2. Intenta guardar una nota en un reporte
3. Debería guardarse sin errores

Si ves el error "Missing or insufficient permissions", verifica que:
- Las reglas se publicaron correctamente
- Tu usuario está autenticado (deberías ver tu nombre arriba a la derecha)
- Esperaste al menos 20 segundos después de publicar
