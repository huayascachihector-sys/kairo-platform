import type { LessonType } from '@/lib/courseData';

interface LessonTypeIconProps {
  type: LessonType;
  size?: number;
}

export function LessonTypeIcon({ type, size = 20 }: LessonTypeIconProps) {
  const config = {
    concept: { color: '#6366f1', bg: 'rgba(99,102,241,0.15)', glow: 'rgba(99,102,241,0.4)', label: 'Concepto nuevo' },
    practice: { color: '#22d3ee', bg: 'rgba(34,211,238,0.15)', glow: 'rgba(34,211,238,0.4)', label: 'Práctica' },
    review: { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', glow: 'rgba(251,191,36,0.4)', label: 'Repaso' },
    exam: { color: '#f87171', bg: 'rgba(248,113,113,0.15)', glow: 'rgba(248,113,113,0.4)', label: 'Examen' },
  }[type];

  const svgProps = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };

  const icons = {
    concept: (
      <svg {...svgProps}>
        <path d="M9.66347 17H14.3365M12 3V4M18.364 5.636L17.6569 6.3431M21 12H20M4 12H3M6.34315 6.3431L5.63604 5.636M17.6569 17.6569L18.364 18.364M6.34315 17.6569L5.63604 18.364M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12Z" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      </svg>
    ),
    practice: (
      <svg {...svgProps}>
        <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4645L16.7322 3.73223Z" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 6L18 11" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
      </svg>
    ),
    review: (
      <svg {...svgProps}>
        <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8V12L15 15" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 20H4V16" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 20L7.5 16.5" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    exam: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="9" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8V12L14.5 14.5" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.5 5.5L7 4" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        <path d="M15.5 5.5L17 4" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  }[type];

  return (
    <div
      className="inline-flex items-center justify-center rounded-lg p-1"
      style={{ background: config.bg }}
      title={config.label}
    >
      <div style={{ color: config.color }}>
        {icons}
      </div>
    </div>
  );
}
