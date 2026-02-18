import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getAllCategories } from '@/lib/blog/posts';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — Aprende sobre analytics y reportes de redes sociales',
  description:
    'Artículos, guías y tutoriales sobre analytics de redes sociales, reportes automatizados y marketing digital para agencias y freelancers en LATAM.',
  openGraph: {
    title: 'Blog — DataPal',
    description:
      'Artículos sobre analytics, reportes de redes sociales y marketing digital para agencias en LATAM.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-[#11120D] text-[#FBFEF2]">
      {/* Hero */}
      <section className="pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#019B77]/10 border border-[#019B77]/30 text-[#019B77] text-sm mb-6">
            <BookOpen className="w-4 h-4" />
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[var(--font-roboto-mono)]">
            Analytics y reportes para{' '}
            <span className="text-[#019B77]">agencias modernas</span>
          </h1>
          <p className="text-lg text-[#B6B6B6] max-w-2xl mx-auto">
            Guías, tutoriales y mejores prácticas para optimizar tus reportes de
            redes sociales y demostrar resultados a tus clientes.
          </p>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 1 && (
        <section className="pb-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
            <span className="px-4 py-2 rounded-full bg-[#019B77] text-[#FBFEF2] text-sm font-medium">
              Todos
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 rounded-full bg-[#1a1b16] text-[#B6B6B6] text-sm border border-[rgba(251,254,242,0.1)] hover:border-[#019B77]/50 hover:text-[#FBFEF2] transition-colors cursor-pointer"
              >
                {cat}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-[#B6B6B6]">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Próximamente publicaremos artículos aquí.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Featured post (first) */}
              {posts[0] && (
                <Link
                  href={`/blog/${posts[0].slug}`}
                  className="group block bg-[#1a1b16] rounded-2xl border border-[rgba(251,254,242,0.08)] hover:border-[#019B77]/40 transition-all overflow-hidden"
                >
                  <div className="md:flex">
                    {posts[0].image && (
                      <div className="md:w-1/2 relative aspect-video md:aspect-auto">
                        <Image
                          src={posts[0].image}
                          alt={posts[0].title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className={`p-6 md:p-8 flex flex-col justify-center ${posts[0].image ? 'md:w-1/2' : 'w-full'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-[#019B77]/15 text-[#019B77] text-xs font-medium">
                          {posts[0].category}
                        </span>
                        <span className="text-xs text-[#B6B6B6] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {posts[0].readingTime}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#019B77] transition-colors font-[var(--font-roboto-mono)]">
                        {posts[0].title}
                      </h2>
                      <p className="text-[#B6B6B6] mb-4 line-clamp-3">
                        {posts[0].description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#B6B6B6] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(posts[0].date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-[#019B77] text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          Leer más <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest of posts */}
              <div className="grid md:grid-cols-2 gap-6">
                {posts.slice(1).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block bg-[#1a1b16] rounded-2xl border border-[rgba(251,254,242,0.08)] hover:border-[#019B77]/40 transition-all overflow-hidden"
                  >
                    {post.image && (
                      <div className="relative aspect-video">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-[#019B77]/15 text-[#019B77] text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="text-xs text-[#B6B6B6] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-[#019B77] transition-colors font-[var(--font-roboto-mono)]">
                        {post.title}
                      </h2>
                      <p className="text-[#B6B6B6] text-sm mb-4 line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#B6B6B6] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-[#019B77] text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          Leer <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#019B77]/20 to-[#019B77]/5 rounded-2xl p-8 md:p-12 text-center border border-[#019B77]/30">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-[var(--font-roboto-mono)]">
            ¿Listo para automatizar tus reportes?
          </h2>
          <p className="text-[#B6B6B6] mb-6 max-w-xl mx-auto">
            Deja de perder horas en reportes manuales. Crea reportes
            profesionales de redes sociales en minutos con DataPal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="px-6 py-3 bg-[#019B77] text-[#FBFEF2] rounded-lg font-medium hover:bg-[#019B77]/90 transition-colors"
            >
              Ver demo gratis
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-[#1a1b16] text-[#FBFEF2] rounded-lg font-medium border border-[rgba(251,254,242,0.15)] hover:border-[#019B77]/50 transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
