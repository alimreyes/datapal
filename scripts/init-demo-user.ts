/**
 * Script para inicializar el usuario demo en Firebase
 *
 * Este script crea un usuario demo con reportes de ejemplo pre-cargados
 * para que los nuevos usuarios puedan explorar el dashboard sin registrarse.
 *
 * Uso: npx ts-node scripts/init-demo-user.ts
 *
 * Requisitos:
 * 1. Tener firebase-admin instalado: npm install firebase-admin
 * 2. Descargar la clave de servicio de Firebase Console:
 *    - Ve a Firebase Console > Project Settings > Service Accounts
 *    - Click "Generate new private key"
 *    - Guarda el archivo como: scripts/serviceAccountKey.json
 * 3. Agregar DEMO_USER_PASSWORD al .env.local
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const DEMO_EMAIL = 'demo@datapal.cl';
const DEMO_DISPLAY_NAME = 'Usuario Demo';

// Cargar credenciales de servicio
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: No se encontró serviceAccountKey.json');
  console.log('\nPasos para obtener la clave de servicio:');
  console.log('1. Ve a Firebase Console: https://console.firebase.google.com');
  console.log('2. Selecciona tu proyecto (datapal-1fc19)');
  console.log('3. Ve a Project Settings > Service Accounts');
  console.log('4. Click en "Generate new private key"');
  console.log('5. Guarda el archivo como: scripts/serviceAccountKey.json');
  process.exit(1);
}

// Inicializar Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Inicializar solo si no está ya inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: serviceAccount.project_id,
  });
}

const auth = admin.auth();
const db = admin.firestore();

// Generar password seguro
function generateSecurePassword(): string {
  return crypto.randomBytes(16).toString('hex') + '!A1';
}

// Cargar reportes de ejemplo
function loadDemoReports(): any[] {
  const reportsPath = path.join(__dirname, 'demo-data', 'reportes-ejemplo.json');

  if (!fs.existsSync(reportsPath)) {
    console.error('❌ Error: No se encontró reportes-ejemplo.json');
    console.log('Creando archivo de ejemplo...');
    return [];
  }

  return JSON.parse(fs.readFileSync(reportsPath, 'utf8'));
}

async function initDemoUser() {
  console.log('🚀 Iniciando configuración del usuario demo...\n');

  let demoUser: admin.auth.UserRecord | null = null;
  let password: string;

  // 1. Verificar si el usuario ya existe
  try {
    demoUser = await auth.getUserByEmail(DEMO_EMAIL);
    console.log('✅ Usuario demo ya existe');
    console.log(`   UID: ${demoUser.uid}`);
    console.log(`   Email: ${demoUser.email}`);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log('📝 Usuario demo no existe, creando...');

      // Generar password o usar el de .env
      password = process.env.DEMO_USER_PASSWORD || generateSecurePassword();

      // Crear usuario
      demoUser = await auth.createUser({
        email: DEMO_EMAIL,
        password: password,
        displayName: DEMO_DISPLAY_NAME,
        emailVerified: true,
      });

      console.log('✅ Usuario demo creado exitosamente');
      console.log(`   UID: ${demoUser.uid}`);
      console.log(`   Email: ${demoUser.email}`);

      // Si generamos un nuevo password, mostrarlo
      if (!process.env.DEMO_USER_PASSWORD) {
        console.log('\n⚠️  IMPORTANTE: Agrega esta línea a tu .env.local:');
        console.log(`   DEMO_USER_PASSWORD=${password}`);
      }
    } else {
      throw error;
    }
  }

  if (!demoUser) {
    console.error('❌ No se pudo crear/obtener el usuario demo');
    process.exit(1);
  }

  // 2. Establecer custom claims
  console.log('\n📝 Estableciendo custom claims...');
  await auth.setCustomUserClaims(demoUser.uid, { isDemo: true });
  console.log('✅ Custom claims establecidos: { isDemo: true }');

  // 3. Crear/actualizar documento en Firestore
  console.log('\n📝 Creando documento de usuario en Firestore...');
  const userDocRef = db.collection('users').doc(demoUser.uid);
  const userDoc = await userDocRef.get();

  const userData = {
    email: DEMO_EMAIL,
    displayName: DEMO_DISPLAY_NAME,
    isDemo: true,
    createdAt: userDoc.exists ? userDoc.data()?.createdAt : admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    subscription: {
      status: 'demo',
      plan: 'unlimited',
    },
  };

  await userDocRef.set(userData, { merge: true });
  console.log('✅ Documento de usuario creado/actualizado');

  // 4. Cargar reportes de ejemplo
  console.log('\n📝 Cargando reportes de ejemplo...');
  const demoReports = loadDemoReports();

  if (demoReports.length === 0) {
    console.log('⚠️  No hay reportes de ejemplo para cargar');
    console.log('   Crea el archivo: scripts/demo-data/reportes-ejemplo.json');
  } else {
    for (const report of demoReports) {
      const reportId = `demo_${report.id}`;
      const reportRef = db.collection('reports').doc(reportId);

      await reportRef.set({
        ...report,
        id: reportId,
        userId: demoUser.uid,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(report.createdAt)),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log(`   ✅ Reporte cargado: ${report.title}`);
    }
    console.log(`\n✅ ${demoReports.length} reportes de ejemplo cargados`);
  }

  // 5. Resumen final
  console.log('\n' + '='.repeat(50));
  console.log('📋 RESUMEN DE CONFIGURACIÓN');
  console.log('='.repeat(50));
  console.log(`Usuario Demo UID: ${demoUser.uid}`);
  console.log(`Email: ${DEMO_EMAIL}`);
  console.log(`Custom Claims: { isDemo: true }`);
  console.log(`Reportes cargados: ${demoReports.length}`);
  console.log('='.repeat(50));

  console.log('\n🎉 Configuración completada exitosamente!\n');

  // Guardar UID para referencia
  const envLine = `\n# Usuario Demo\nDEMO_USER_UID=${demoUser.uid}`;
  console.log('Agrega estas líneas a tu .env.local:');
  console.log(envLine);
}

// Ejecutar
initDemoUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
