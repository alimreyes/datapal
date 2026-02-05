import { NextResponse } from 'next/server';

/**
 * API Route para obtener credenciales del demo de forma segura
 * El password no se expone en el cliente
 */
export async function POST() {
  try {
    const demoPassword = process.env.DEMO_USER_PASSWORD;

    // Log para debugging (solo muestra si existe, no el valor)
    console.log('DEMO_USER_PASSWORD exists:', !!demoPassword);

    if (!demoPassword) {
      console.error('DEMO_USER_PASSWORD not found in environment variables');
      return NextResponse.json(
        { error: 'Demo no configurado. Contacta al administrador.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      email: 'demo@datapal.cl',
      password: demoPassword,
    });
  } catch (error) {
    console.error('Error en demo auth:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
