import Link from 'next/link';
import Image from 'next/image';

export default function LandingFooter() {
  return (
    <footer className="bg-[#11120D] border-t border-[rgba(251,254,242,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/Logo_DataPal.png"
                alt="DataPal"
                width={32}
                height={32}
                className="object-contain invert"
              />
              <span className="text-lg font-bold text-[#FBFEF2] font-[var(--font-roboto-mono)] tracking-tight">
                DataPal
              </span>
            </div>
            <p className="text-sm text-[#B6B6B6] max-w-xs">
              Reportes automatizados de redes sociales para agencias boutique y freelancers en Latinoamérica.
            </p>
          </div>

          {/* Producto */}
          <div>
            <h4 className="text-sm font-semibold text-[#FBFEF2] mb-3">Producto</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/demo" className="text-sm text-[#B6B6B6] hover:text-[#019B77] transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-[#B6B6B6] hover:text-[#019B77] transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-[#B6B6B6] hover:text-[#019B77] transition-colors">
                  Crear cuenta gratis
                </Link>
              </li>
            </ul>
          </div>

          {/* Reportes */}
          <div>
            <h4 className="text-sm font-semibold text-[#FBFEF2] mb-3">Reportes</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/demo/analisis-resultados" className="text-sm text-[#B6B6B6] hover:text-[#019B77] transition-colors">
                  Análisis de Resultados
                </Link>
              </li>
              <li>
                <Link href="/demo/mejoras-realizadas" className="text-sm text-[#B6B6B6] hover:text-[#019B77] transition-colors">
                  Evidenciar Mejoras
                </Link>
              </li>
              <li>
                <Link href="/demo/reporte-mensual" className="text-sm text-[#B6B6B6] hover:text-[#019B77] transition-colors">
                  Reporte Mensual
                </Link>
              </li>
            </ul>
          </div>

          {/* Plataformas */}
          <div>
            <h4 className="text-sm font-semibold text-[#FBFEF2] mb-3">Plataformas</h4>
            <ul className="space-y-2">
              <li className="text-sm text-[#B6B6B6]">Instagram</li>
              <li className="text-sm text-[#B6B6B6]">Facebook</li>
              <li className="text-sm text-[#B6B6B6]">LinkedIn</li>
              <li className="text-sm text-[#B6B6B6]">TikTok</li>
              <li className="text-sm text-[#B6B6B6]">Google Analytics</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[rgba(251,254,242,0.05)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#B6B6B6]">
            &copy; {new Date().getFullYear()} DataPal. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs text-[#B6B6B6] hover:text-[#019B77] transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-xs text-[#B6B6B6] hover:text-[#019B77] transition-colors">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
