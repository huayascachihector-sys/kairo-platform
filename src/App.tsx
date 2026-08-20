import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import { loadState } from './lib/store';

const MathPractice = lazy(() => import('./pages/MathPractice'));
const Recursos = lazy(() => import('./pages/Recursos'));
const Cursos = lazy(() => import('./pages/Cursos'));
const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const Registro = lazy(() => import('./pages/Registro'));
const Plataforma = lazy(() => import('./pages/Plataforma'));
const OnboardingIA = lazy(() => import('./pages/OnboardingIA'));
const Robot = lazy(() => import('./pages/Robot'));

if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !import.meta.env.DEV) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => console.log('SW registered:', registration.scope),
      () => console.log('SW registration failed')
    );
  });
}

function initDarkMode(): boolean {
  try { return localStorage.getItem('sm_darkmode') !== '0'; } catch { return true; }
}

type Route = 'home' | 'matematicas' | 'recursos' | 'cursos' | 'blog' | 'about' | 'registro' | 'onboarding' | 'plataforma' | 'robot';

function getRoute(): Route {
  const hash = window.location.hash;
  const cleanHash = hash.replace('#/', '');

  const routeMap: Record<Route, string> = {
    matematicas: '#/matematicas',
    recursos: '#/recursos',
    cursos: '#/cursos',
    blog: '#/blog',
    about: '#/about',
    registro: '#/registro',
    onboarding: '#/onboarding',
    plataforma: '#/plataforma',
    robot: '#/robot',
  };

  for (const [route, pattern] of Object.entries(routeMap)) {
    if (cleanHash === pattern || cleanHash.startsWith(pattern + '/')) {
      return route;
    }
  }
  return 'home';
}

const STANDALONE_ROUTES: Route[] = ['registro', 'onboarding', 'plataforma'];

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handleHash = () => {
      const newRoute = getRoute();
      setRoute(newRoute);
      if (window.location.hash.startsWith('#/')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const dark = initDarkMode();
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    const currentUser = loadState().user;
    const currentRoute = getRoute();
    const isInstalledApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      /wv|electron/i.test(navigator.userAgent);

    if (currentUser) {
      if (currentRoute === 'onboarding' && currentUser.onboarding?.completedAt) {
        window.location.hash = '#/plataforma';
      } else if (currentRoute === 'home' && isInstalledApp) {
        window.location.hash = '#/plataforma';
      }
    } else if (currentRoute === 'plataforma' || currentRoute === 'onboarding') {
      window.location.hash = '#/registro';
    }
  }, []);

  const renderPage = () => {
    switch (route) {
      case 'matematicas': return <MathPractice />;
      case 'recursos':    return <Recursos />;
      case 'cursos':      return <Cursos />;
      case 'blog':        return <Blog />;
      case 'about':       return <About />;
      case 'registro':    return <Registro />;
      case 'onboarding':  return <OnboardingIA />;
      case 'plataforma':  return <Plataforma />;
      case 'robot':       return <Robot />;
      default:            return <Landing />;
    }
  };

  const isStandalone = STANDALONE_ROUTES.includes(route);

  const wrapperCls = 'min-h-screen bg-white dark:bg-gradient-hero text-surface-900 dark:text-surface-100';

  return (
    <Suspense fallback={<LoadingFallback />}>
      {isStandalone ? (
        <div className={wrapperCls}>{renderPage()}</div>
      ) : (
        <div className={wrapperCls}>
          <Navbar />
          <main>{renderPage()}</main>
          <Footer />
        </div>
      )}
    </Suspense>
  );
}