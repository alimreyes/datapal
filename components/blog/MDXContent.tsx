'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';

interface MDXContentProps {
  content: string;
}

export function MDXContent({ content }: MDXContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    serialize(content).then(setMdxSource);
  }, [content]);

  if (!mdxSource) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-[#1a1b16] rounded w-3/4"></div>
        <div className="h-4 bg-[#1a1b16] rounded w-full"></div>
        <div className="h-4 bg-[#1a1b16] rounded w-5/6"></div>
      </div>
    );
  }

  return <MDXRemote {...mdxSource} components={components} />;
}

const components = {
  h2: (props: any) => (
    <h2
      className="text-2xl font-bold mt-10 mb-4 text-[#FBFEF2] font-[var(--font-roboto-mono)]"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-xl font-bold mt-8 mb-3 text-[#FBFEF2] font-[var(--font-roboto-mono)]"
      {...props}
    />
  ),
  p: (props: any) => (
    <p className="text-[#B6B6B6] leading-relaxed mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside space-y-2 mb-6 text-[#B6B6B6]" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside space-y-2 mb-6 text-[#B6B6B6]" {...props} />
  ),
  li: (props: any) => <li className="text-[#B6B6B6] leading-relaxed" {...props} />,
  strong: (props: any) => <strong className="text-[#FBFEF2] font-semibold" {...props} />,
  a: (props: any) => (
    <a
      className="text-[#019B77] hover:text-[#019B77]/80 underline underline-offset-2 transition-colors"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-[#019B77] pl-4 my-6 italic text-[#B6B6B6]"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-[#1a1b16] text-[#019B77] px-2 py-0.5 rounded text-sm font-mono"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="bg-[#1a1b16] border border-[rgba(251,254,242,0.08)] rounded-lg p-4 my-6 overflow-x-auto text-sm"
      {...props}
    />
  ),
  hr: () => <hr className="border-[rgba(251,254,242,0.08)] my-8" />,
};
