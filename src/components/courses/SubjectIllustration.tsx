import { motion } from 'framer-motion';

const illustrations = {
  matematicas: ({ animating }: { animating: boolean }) => (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={animating ? { rotate: [0, -8, 8, -4, 0], y: [0, -4, 0] } : {}}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <rect x="85" y="10" width="30" height="12" rx="3" fill="#818cf8" />
        <line x1="75" y1="22" x2="75" y2="95" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
        <line x1="125" y1="22" x2="125" y2="95" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
        <path d="M75 95 L100 105 L125 95" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <motion.g
        animate={animating ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.1 }}
      >
        <circle cx="75" cy="30" r="8" fill="#c7d2fe" />
        <circle cx="75" cy="30" r="4" fill="#818cf8" />
        <circle cx="125" cy="30" r="8" fill="#c7d2fe" />
        <circle cx="125" cy="30" r="4" fill="#818cf8" />
      </motion.g>
      <motion.g
        animate={animating ? { y: [0, 3, 0] } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
      >
        <circle cx="75" cy="85" r="10" fill="#fde68a" />
        <circle cx="75" cy="85" r="5" fill="#f59e0b" />
        <circle cx="125" cy="85" r="10" fill="#fde68a" />
        <circle cx="125" cy="85" r="5" fill="#f59e0b" />
      </motion.g>
      <text x="100" y="118" textAnchor="middle" fontSize="11" fill="#a5b4fc" fontWeight="600">+ − × ÷</text>
      <motion.g
        animate={animating ? { opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <circle cx="35" cy="38" r="3" fill="#c084fc" opacity="0.6" />
        <circle cx="165" cy="68" r="2.5" fill="#f472b6" opacity="0.6" />
        <circle cx="150" cy="35" r="2" fill="#818cf8" opacity="0.5" />
      </motion.g>
    </svg>
  ),

  fisica: ({ animating }: { animating: boolean }) => (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={animating ? { rotateZ: [0, 5, -5, 0] } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <ellipse cx="100" cy="60" rx="35" ry="28" stroke="#22d3ee" strokeWidth="2.5" fill="none" opacity="0.5" />
        <ellipse cx="100" cy="60" rx="20" ry="16" stroke="#22d3ee" strokeWidth="2" fill="none" opacity="0.35" />
        <circle cx="100" cy="60" r="6" fill="#22d3ee" />
      </motion.g>
      <motion.g
        animate={animating ? { rotate: [0, 3, -3, 0] } : {}}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <path d="M70 95 Q100 75 130 95" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M75 100 Q100 82 125 100" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.25" />
      </motion.g>
      <motion.g
        animate={animating ? { pathLength: [0.2, 1, 0.2], opacity: [0.4, 1, 0.4] } : { pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 2.5, repeat: animating ? Infinity : 0 }}
      >
        <path d="M45 85 L55 60 L62 72 L72 45 L80 60 L88 35 L96 55" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M108 30 L115 55 L122 40 L130 65 L138 50" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.g>
      <text x="100" y="118" textAnchor="middle" fontSize="14" fill="#22d3ee" fontWeight="600">E = mc²</text>
    </svg>
  ),

  quimica: ({ animating }: { animating: boolean }) => (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={animating ? { rotate: [0, -3, 3, 0] } : {}}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      >
        <path d="M90 95 L90 45 L110 45 L110 95 Z" fill="#10b981" fillOpacity="0.15" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />
        <path d="M90 55 L110 55" stroke="#34d399" strokeWidth="1.5" />
        <text x="100" y="78" textAnchor="middle" fontSize="11" fill="#34d399" fontWeight="600">H₂O</text>
      </motion.g>
      <motion.g
        animate={animating ? { opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] } : { opacity: 0.5 }}
        transition={{ duration: 1.2, repeat: animating ? Infinity : 0 }}
      >
        <circle cx="70" cy="45" r="4" fill="#6ee7b7" />
        <circle cx="85" cy="35" r="3" fill="#34d399" />
        <circle cx="60" cy="55" r="2.5" fill="#a7f3d0" />
      </motion.g>
      <motion.g
        animate={animating ? { rotate: [0, 6, -6, 0] } : {}}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <path d="M130 40 Q145 35 145 50 Q145 65 130 60" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M125 45 Q135 42 135 50 Q135 58 125 55" stroke="#34d399" strokeWidth="1.5" fill="none" opacity="0.35" />
      </motion.g>
      <text x="100" y="118" textAnchor="middle" fontSize="13" fill="#34d399" fontWeight="600">⚗️ ∼</text>
    </svg>
  ),

  historia: ({ animating }: { animating: boolean }) => (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={animating ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <path d="M95 35 L95 95" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="82" y="25" width="26" height="14" rx="3" fill="#fcd34d" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="95" cy="18" r="6" fill="#fbbf24" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="2" />
      </motion.g>
      <motion.path
        d="M60 55 L80 50 L100 60 L120 48 L140 55"
        stroke="#f59e0b"
        strokeWidth="2"
        fill="none"
        opacity="0.35"
        animate={animating ? { pathLength: [0.3, 1, 0.3] } : { pathLength: 0.6 }}
        transition={{ duration: 2.5, repeat: animating ? Infinity : 0 }}
      />
      <motion.g
        animate={animating ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
      >
        <path d="M45 75 Q45 55 65 55" stroke="#d97706" strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M155 75 Q155 55 135 55" stroke="#d97706" strokeWidth="2" fill="none" opacity="0.4" />
      </motion.g>
      <text x="100" y="118" textAnchor="middle" fontSize="13" fill="#f59e0b" fontWeight="600">Historia</text>
    </svg>
  ),

  comunicacion: ({ animating }: { animating: boolean }) => (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={animating ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 1.3, ease: 'easeInOut' }}
      >
        <rect x="65" y="30" width="70" height="50" rx="6" fill="#a78bfa" fillOpacity="0.15" stroke="#a78bfa" strokeWidth="2" />
        <line x1="80" y1="55" x2="120" y2="55" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
        <line x1="80" y1="65" x2="110" y2="65" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
        <motion.g animate={animating ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.7 }}>
          <path d="M120 70 L135 82 L120 82 Z" fill="#8b5cf6" fillOpacity="0.3" stroke="#8b5cf6" strokeWidth="1.5" />
        </motion.g>
      </motion.g>
      <motion.g
        animate={animating ? { rotate: [0, -5, 5, 0] } : {}}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <circle cx="50" cy="40" r="8" fill="#c084fc" fillOpacity="0.25" stroke="#c084fc" strokeWidth="1.5" />
        <circle cx="50" cy="40" r="3" fill="#c084fc" />
        <circle cx="150" cy="50" r="8" fill="#f472b6" fillOpacity="0.25" stroke="#f472b6" strokeWidth="1.5" />
        <circle cx="150" cy="50" r="3" fill="#f472b6" />
      </motion.g>
      <text x="100" y="118" textAnchor="middle" fontSize="12" fill="#a78bfa" fontWeight="600">Leer · Escribir</text>
    </svg>
  ),

  ingles: ({ animating }: { animating: boolean }) => (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={animating ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <rect x="55" y="35" width="60" height="40" rx="10" fill="#fb7185" fillOpacity="0.15" stroke="#fb7185" strokeWidth="2" />
        <path d="M75 45 C75 45 55 45 55 55 C55 65 75 55 75 55 L75 65" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M95 45 C95 45 105 50 105 55 C105 60 95 65 95 65" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" fill="none" />
      </motion.g>
      <motion.g
        animate={animating ? { opacity: [0, 1, 0], y: [0, -8, 0] } : { opacity: 0.4 }}
        transition={{ duration: 1.5, repeat: animating ? Infinity : 0 }}
      >
        <circle cx="130" cy="40" r="3" fill="#f43f5e" />
        <circle cx="145" cy="48" r="2" fill="#fb7185" />
        <circle cx="135" cy="58" r="2.5" fill="#f43f5e" />
      </motion.g>
      <motion.g
        animate={animating ? { y: [0, 2, 0] } : {}}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
      >
        <rect x="130" y="70" width="30" height="22" rx="6" fill="#ffe4e6" fillOpacity="0.3" stroke="#f43f5e" strokeWidth="1.5" />
        <text x="145" y="85" textAnchor="middle" fontSize="10" fill="#fb7185" fontWeight="600">Hello!</text>
      </motion.g>
      <text x="100" y="118" textAnchor="middle" fontSize="12" fill="#fb7185" fontWeight="600">English</text>
    </svg>
  ),

  biologia: ({ animating }: { animating: boolean }) => (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={animating ? { rotate: [0, 3, -3, 0] } : {}}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      >
        <motion.path
          d="M60 85 C60 85 60 30 80 30 C100 30 100 80 120 80 C140 80 140 30 140 30"
          stroke="#22c55e"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={animating ? { pathLength: [0.5, 1, 0.5] } : { pathLength: 0.8 }}
          transition={{ duration: 3, repeat: animating ? Infinity : 0 }}
        />
        <motion.path
          d="M60 85 C60 85 60 30 80 30 C100 30 100 80 120 80 C140 80 140 30 140 30"
          stroke="#4ade80"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          transform="translate(0,-55)"
          opacity="0.4"
          animate={animating ? { pathLength: [0.5, 1, 0.5] } : { pathLength: 0.8 }}
          transition={{ duration: 3, repeat: animating ? Infinity : 0, delay: 0.2 }}
        />
      </motion.g>
      <motion.g
        animate={animating ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <circle cx="50" cy="35" r="5" fill="#4ade80" fillOpacity="0.4" />
        <circle cx="155" cy="45" r="4" fill="#22c55e" fillOpacity="0.3" />
        <circle cx="45" cy="70" r="3.5" fill="#86efac" fillOpacity="0.4" />
      </motion.g>
      <text x="100" y="118" textAnchor="middle" fontSize="13" fill="#22c55e" fontWeight="600">ADN</text>
    </svg>
  ),

  computacion: ({ animating }: { animating: boolean }) => (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={animating ? { rotate: [0, 4, -4, 0] } : {}}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      >
        <rect x="55" y="35" width="65" height="45" rx="5" fill="#818cf8" fillOpacity="0.1" stroke="#818cf8" strokeWidth="2" />
        <rect x="60" y="40" width="18" height="12" rx="2" fill="#6366f1" fillOpacity="0.2" stroke="#6366f1" strokeWidth="1.5" />
        <text x="90" y="52" textAnchor="middle" fontSize="9" fill="#818cf8" fontFamily="monospace">{'< / >'}</text>
      </motion.g>
      <motion.g
        animate={animating ? { opacity: [0.3, 1, 0.3], y: [0, -2, 0] } : { opacity: 0.5 }}
        transition={{ duration: 1, repeat: animating ? Infinity : 0 }}
      >
        <rect x="55" y="80" width="65" height="3" rx="1.5" fill="#818cf8" />
        <circle cx="60" cy="81.5" r="1.5" fill="#a5b4fc" />
        <circle cx="66" cy="81.5" r="1.5" fill="#a5b4fc" />
        <circle cx="72" cy="81.5" r="1.5" fill="#a5b4fc" />
      </motion.g>
      <motion.g
        animate={animating ? { translateY: [0, -2, 0] } : {}}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
      >
        <path d="M135 50 L145 60 L135 70" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M148 50 L158 60 L148 70" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
      </motion.g>
      <text x="100" y="118" textAnchor="middle" fontSize="12" fill="#818cf8" fontWeight="600">{'<code />'}</text>
    </svg>
  ),
};

interface SubjectIllustrationProps {
  subject: string;
  animating?: boolean;
}

export default function SubjectIllustration({ subject, animating = false }: SubjectIllustrationProps) {
  const Illustration = illustrations[subject as keyof typeof illustrations] || null;
  if (!Illustration) return null;
  return (
    <div className="w-full h-28 overflow-hidden">
      <Illustration animating={animating} />
    </div>
  );
}
