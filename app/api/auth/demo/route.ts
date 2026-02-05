import { NextResponse } from 'next/server';

/**
 * API Route para obtener credenciales del demo de forma segura
 * El password no se expone en el cliente
 */
export async function POST() {
  try {
    const demoPassword = process.env.DEMO_USER_PASSWORD;

    if (!demoPassword) {
      return NextResponse.json(
        { error: 'Demo no configurado' },
        { status: 500 }
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
