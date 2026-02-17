'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { FAQ_DATA } from '@/components/seo/JsonLd';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#11120D] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#019B77]/10 rounded-2xl flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-[#019B77]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FBFEF2] mb-3">
            Preguntas frecuentes
          </h1>
          <p className="text-[#B6B6B6] text-lg max-w-xl mx-auto">
            Todo lo que necesitas saber sobre DataPal.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B6B6B6]/50" />
          <input
            type="text"
            placeholder="Buscar una pregunta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl text-[#FBFEF2] placeholder:text-[#B6B6B6]/50 focus:outline-none focus:border-[#019B77] focus:ring-1 focus:ring-[#019B77] transition-colors"
          />
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#B6B6B6]">No se encontraron preguntas con ese término.</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => {
              const originalIndex = FAQ_DATA.indexOf(faq);
              return (
                <div
                  key={originalIndex}
                  className="rounded-xl bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] overflow-hidden transition-colors hover:border-[#019B77]/20"
                >
                  <button
                    onClick={() => toggle(originalIndex)}
                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-medium text-[#FBFEF2] pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#019B77] flex-shrink-0 transition-transform duration-200 ${
                        openIndex === originalIndex ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      openIndex === originalIndex ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-5 pb-5 text-sm text-[#B6B6B6] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-[#1a1b16] rounded-2xl border border-[rgba(251,254,242,0.1)]">
          <p className="text-[#FBFEF2] font-medium mb-2">
            ¿No encontraste lo que buscabas?
          </p>
          <p className="text-sm text-[#B6B6B6] mb-4">
            Escríbenos y te responderemos lo antes posible.
          </p>
          <a
            href="mailto:soporte@datapal.app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] font-semibold rounded-xl transition-colors"
          >
            Contactar soporte
          </a>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-[#019B77] hover:underline inline-flex items-center gap-2 text-sm"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
