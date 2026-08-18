import { useRef, useEffect } from 'react';

let mathJaxLoading: Promise<void> | null = null;

function ensureMathJax() {
  if ((window as any)?.MathJax?.typesetPromise) return Promise.resolve();
  if (mathJaxLoading) return mathJaxLoading;
  mathJaxLoading = new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
  return mathJaxLoading;
}

interface Props {
  html: string;
  className?: string;
  as?: 'div' | 'span';
}

export default function MathContent({ html, className = '', as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    ensureMathJax().then(() => {
      if (mounted.current && ref.current && (window as any).MathJax?.typesetPromise) {
        (window as any).MathJax.typesetPromise([ref.current]).catch(() => {});
      }
    });
  }, [html]);

  return <Tag ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
