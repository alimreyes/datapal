'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_DATA } from '@/components/seo/JsonLd';

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {FAQ_DATA.map((faq, index) => (
        <div
          key={index}
          className="rounded-xl bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] overflow-hidden transition-colors hover:border-[#019B77]/20"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
          >
            <span className="text-sm sm:text-base font-medium text-[#FBFEF2] pr-4">
              {faq.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-[#019B77] flex-shrink-0 transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="px-5 pb-5 text-sm text-[#B6B6B6] leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
