import { NextResponse } from 'next/server';

// Credenciales del usuario demo
const DEMO_EMAIL = 'demo@datapal.cl';
const DEMO_PASSWORD = 'c84214fa2f8d94f1df495ff6b1cbefc4!A1';

/**
 * API Route para obtener credenciales del demo de forma segura
 * El password no se expone directamente en el cliente
 */
export async function POST() {
  try {
    return NextResponse.json({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
  } catch (error) {
    console.error('Error en demo auth:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
