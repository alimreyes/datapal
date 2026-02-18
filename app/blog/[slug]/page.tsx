import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, getPostSlugs } from '@/lib/blog/posts';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { Calendar, Clock, ArrowLeft, ArrowRight, User } from 'lucide-react';
import { MDXContent } from '@/components/blog/MDXContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post no encontrado' };
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.image
        ? [{ url: `${APP_URL}${post.image}`, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [`${APP_URL}${post.image}`] : [],
    },
    alternates: {
      canonical: `${APP_URL}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

  // JSON-LD for BlogPosting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image ? `${APP_URL}${post.image}` : undefined,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DataPal',
      url: APP_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${APP_URL}/blog/${slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#11120D] text-[#FBFEF2]">
      <LandingNav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article */}
      <article className="pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#B6B6B6] hover:text-[#019B77] transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#019B77]/15 text-[#019B77] text-xs font-medium">
                {post.category}
              </span>
              <span className="text-xs text-[#B6B6B6] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime}
              </span>
              <span className="text-xs text-[#B6B6B6] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight font-[var(--font-roboto-mono)]">
              {post.title}
            </h1>
            <p className="text-lg text-[#B6B6B6]">{post.description}</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-[#B6B6B6]">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          </header>

          {/* Featured image */}
          {post.image && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 border border-[rgba(251,254,242,0.08)]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose-datapal">
            <MDXContent content={post.content} />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[rgba(251,254,242,0.08)]">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#1a1b16] text-[#B6B6B6] text-xs border border-[rgba(251,254,242,0.08)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* CTA */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#019B77]/20 to-[#019B77]/5 rounded-2xl p-8 text-center border border-[#019B77]/30">
          <h2 className="text-2xl font-bold mb-3 font-[var(--font-roboto-mono)]">
            Automatiza tus reportes hoy
          </h2>
          <p className="text-[#B6B6B6] mb-6">
            Deja de perder horas. Crea reportes profesionales en minutos.
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

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-24 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 font-[var(--font-roboto-mono)]">
              Artículos relacionados
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block bg-[#1a1b16] rounded-2xl border border-[rgba(251,254,242,0.08)] hover:border-[#019B77]/40 transition-all overflow-hidden"
                >
                  {related.image && (
                    <div className="relative aspect-video">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="px-3 py-1 rounded-full bg-[#019B77]/15 text-[#019B77] text-xs font-medium">
                      {related.category}
                    </span>
                    <h3 className="text-lg font-bold mt-3 mb-2 group-hover:text-[#019B77] transition-colors">
                      {related.title}
                    </h3>
                    <span className="text-[#019B77] text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Leer <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <LandingFooter />
    </div>
  );
}
