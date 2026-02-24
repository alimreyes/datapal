/**
 * Script para crear los 10 códigos de acceso de prueba en Firestore
 *
 * Uso: npx ts-node scripts/seed-access-codes.ts
 *
 * Requisitos:
 * 1. Tener firebase-admin instalado
 * 2. Tener scripts/serviceAccountKey.json
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: No se encontro serviceAccountKey.json');
  console.log('Descargalo desde Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = admin.firestore();

const CODES = Array.from({ length: 10 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return `amigos-${num}`;
});

async function seedAccessCodes() {
  console.log('Creando 10 codigos de acceso...\n');

  const batch = db.batch();
  let created = 0;
  let skipped = 0;

  for (const code of CODES) {
    const ref = db.collection('accessCodes').doc(code);
    const existing = await ref.get();

    if (existing.exists) {
      console.log(`  Skipped: ${code} (ya existe)`);
      skipped++;
      continue;
    }

    batch.set(ref, {
      code,
      isUsed: false,
      usedBy: null,
      usedAt: null,
      expiresAt: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`  Queued: ${code}`);
    created++;
  }

  if (created > 0) {
    await batch.commit();
  }

  console.log(`\nResultado: ${created} creados, ${skipped} ya existian`);
  console.log('\nCodigos disponibles:');
  CODES.forEach(c => console.log(`  - ${c}`));
}

seedAccessCodes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
