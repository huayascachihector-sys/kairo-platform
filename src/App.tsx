import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';

const MathPractice = lazy(() => import('./pages/MathPractice'));
const Recursos = lazy(() => import('./pages/Recursos'));
const Cursos = lazy(() => import('./pages/Cursos'));
const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const Registro = lazy(() => import('./pages/Registro'));
const Pago = lazy(() => import('./pages/Pago'));
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
  try { return localStorage.getItem('sm_darkmode') === '1'; } catch { return false; }
}

type Route = 'home' | 'matematicas' | 'recursos' | 'cursos' | 'blog' | 'about' | 'registro' | 'pago' | 'onboarding' | 'plataforma' | 'robot';

function getRoute(): Route {
  const hash = window.location.hash;
  if (hash.startsWith('#/matematicas')) return 'matematicas';
  if (hash.startsWith('#/recursos')) return 'recursos';
  if (hash.startsWith('#/cursos')) return 'cursos';
  if (hash.startsWith('#/blog')) return 'blog';
  if (hash.startsWith('#/about')) return 'about';
  if (hash.startsWith('#/registro')) return 'registro';
  if (hash.startsWith('#/pago')) return 'pago';
  if (hash.startsWith('#/onboarding')) return 'onboarding';
  if (hash.startsWith('#/plataforma')) return 'plataforma';
  if (hash.startsWith('#/robot')) return 'robot';
  return 'home';
}

const STANDALONE_ROUTES: Route[] = ['registro', 'pago', 'onboarding', 'plataforma'];

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const dark = initDarkMode();
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const renderPage = () => {
    switch (route) {
      case 'matematicas': return <MathPractice />;
      case 'recursos':    return <Recursos />;
      case 'cursos':      return <Cursos />;
      case 'blog':        return <Blog />;
      case 'about':       return <About />;
      case 'registro':    return <Registro />;
      case 'pago':        return <Pago />;
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