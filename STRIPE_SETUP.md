# 🔐 Configuración de Stripe para DataPal

Esta guía te ayudará a configurar Stripe para procesar pagos de tokens de IA en DataPal.

## 📋 Requisitos Previos

1. Cuenta de Stripe (https://dashboard.stripe.com/register)
2. Cuenta de Firebase (para almacenar tokens de usuarios)

## 🚀 Pasos de Configuración

### 1. Obtener las API Keys de Stripe

1. Inicia sesión en tu [Dashboard de Stripe](https://dashboard.stripe.com)
2. Ve a **Developers** > **API keys**
3. Copia las siguientes keys:
   - **Publishable key** (comienza con `pk_test_...` en modo test)
   - **Secret key** (comienza con `sk_test_...` en modo test)

### 2. Configurar Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_publishable_key
STRIPE_SECRET_KEY=sk_test_tu_secret_key
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
```

### 3. Configurar el Webhook

Los webhooks permiten que Stripe notifique a tu aplicación cuando un pago se completa.

#### Opción A: Desarrollo Local con Stripe CLI

1. **Instalar Stripe CLI:**
   ```bash
   # Windows (usando Scoop)
   scoop install stripe

   # Mac (usando Homebrew)
   brew install stripe/stripe-cli/stripe

   # O descarga desde: https://github.com/stripe/stripe-cli/releases
   ```

2. **Login con Stripe CLI:**
   ```bash
   stripe login
   ```

3. **Escuchar webhooks localmente:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copiar el webhook secret:**
   - El comando anterior te dará un webhook secret que comienza con `whsec_`
   - Cópialo y agrégalo a tu `.env.local` como `STRIPE_WEBHOOK_SECRET`

5. **En otra terminal, ejecutar tu aplicación:**
   ```bash
   npm run dev
   ```

#### Opción B: Producción (Vercel/Deploy)

1. Ve a **Developers** > **Webhooks** en tu Dashboard de Stripe
2. Click en **Add endpoint**
3. Ingresa la URL de tu aplicación + `/api/stripe/webhook`:
   ```
   https://tu-dominio.vercel.app/api/stripe/webhook
   ```

4. Selecciona los siguientes eventos:
   - `checkout.session.completed`

5. Copia el **Signing secret** (comienza con `whsec_`)

6. Agrégalo como variable de entorno en Vercel:
   - Ve a tu proyecto en Vercel
   - Settings > Environment Variables
   - Agrega `STRIPE_WEBHOOK_SECRET` con el valor del signing secret

### 4. Configurar Firestore

Asegúrate de que tu base de datos de Firestore tenga las siguientes reglas para la colección de `users`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow write: if false; // Solo el servidor puede escribir transacciones
    }
  }
}
```

### 5. Estructura de Datos en Firestore

Después de una compra exitosa, el webhook de Stripe creará/actualizará los siguientes datos:

#### Colección `users/{userId}`
```typescript
{
  aiTokens: number,              // Tokens disponibles actuales
  aiTokensPurchased: number,     // Total de tokens comprados (histórico)
  lastTokenPurchase: string,     // ISO timestamp del último purchase
  stripeCustomerId: string,      // ID del customer en Stripe
}
```

#### Colección `transactions/{transactionId}`
```typescript
{
  userId: string,                // ID del usuario
  sessionId: string,             // ID de la sesión de Stripe
  tokens: number,                // Cantidad de tokens comprados
  amount: number,                // Monto pagado (en centavos)
  currency: string,              // Moneda (ej: "clp")
  status: string,                // Estado ("completed")
  createdAt: string,             // ISO timestamp
  productType: string,           // Tipo de producto ("single", "pack5", "pack10")
}
```

## 🧪 Probar el Flujo de Pago

### Tarjetas de Prueba de Stripe

En modo test, usa estas tarjetas para probar:

- **Pago exitoso:** `4242 4242 4242 4242`
- **Pago rechazado:** `4000 0000 0000 0002`
- **Requiere autenticación 3D:** `4000 0025 0000 3155`

**Datos adicionales:**
- Fecha de vencimiento: Cualquier fecha futura
- CVC: Cualquier 3 dígitos
- ZIP: Cualquier código postal

### Flujo Completo de Testing

1. Ve a http://localhost:3000/tokens
2. Selecciona un paquete de tokens
3. Click en "Comprar Ahora"
4. Serás redirigido a Stripe Checkout
5. Usa la tarjeta de prueba `4242 4242 4242 4242`
6. Completa el pago
7. Serás redirigido a `/checkout/success`
8. Verifica en Firestore que se agregaron los tokens al usuario

## 🎯 Precios de Productos

Los precios están configurados en `lib/stripe/config.ts`:

```typescript
export const TOKEN_PRODUCTS = {
  single: {
    name: '1 Token - 5 Preguntas IA',
    price: 2990,  // $2.990 CLP
    tokens: 1,
  },
  pack5: {
    name: 'Pack 5 Tokens - 25 Preguntas IA',
    price: 11990, // $11.990 CLP (ahorra 20%)
    tokens: 5,
  },
  pack10: {
    name: 'Pack 10 Tokens - 50 Preguntas IA',
    price: 20990, // $20.990 CLP (ahorra 30%)
    tokens: 10,
  },
}
```

Para cambiar precios, edita este archivo.

## 🔒 Seguridad

### Variables de Entorno Importantes

- **NUNCA** expongas `STRIPE_SECRET_KEY` o `STRIPE_WEBHOOK_SECRET` al cliente
- Solo `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` debe ser pública
- En producción, usa las keys **live** (comienzan con `pk_live_` y `sk_live_`)

### Validación de Webhooks

El endpoint `/api/stripe/webhook` valida automáticamente que los webhooks vengan de Stripe usando el webhook secret.

## 🐛 Troubleshooting

### Error: "No signature"
- Verifica que el webhook secret esté configurado correctamente
- Asegúrate de que Stripe CLI esté corriendo (`stripe listen`)

### Error: "Invalid signature"
- El webhook secret es incorrecto
- Regenera el webhook secret en el Dashboard de Stripe

### Los tokens no se agregan al usuario
- Revisa los logs del webhook: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Verifica que el userId esté llegando correctamente en el metadata
- Revisa los logs en la consola del servidor

### Pago exitoso pero sin redirección
- Verifica que `NEXT_PUBLIC_BASE_URL` esté configurado correctamente
- Revisa la URL de success/cancel en el checkout session

## 📚 Recursos Adicionales

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Testing con Stripe](https://stripe.com/docs/testing)
- [Webhooks de Stripe](https://stripe.com/docs/webhooks)

## ✅ Checklist de Producción

Antes de lanzar a producción:

- [ ] Cambiar a API keys de producción (live keys)
- [ ] Configurar webhook en producción con HTTPS
- [ ] Agregar variables de entorno en Vercel/tu hosting
- [ ] Probar flujo completo con tarjeta de prueba
- [ ] Probar webhook en producción
- [ ] Configurar reglas de seguridad de Firestore
- [ ] Activar facturación en Stripe
- [ ] Configurar notificaciones de email en Stripe (opcional)
