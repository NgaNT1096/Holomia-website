import { useState } from 'react';
import { router } from '@inertiajs/react';
import { AppRoute, LeadModalType } from './types/holomia';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LeadModal } from './components/LeadModal';
import { HomePage } from './pages/HomePage';
import { PlatformPage } from './pages/PlatformPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { ShowroomPage } from './pages/ShowroomPage';
import { AboutPage } from './pages/AboutPage';

export const ROUTE_URLS: Record<AppRoute, string> = {
  home: '/',
  platform: '/nen-tang',
  'solutions-event': '/giai-phap/su-kien',
  'solutions-venue': '/giai-phap/mat-bang',
  'solutions-custom': '/giai-phap/du-an-rieng',
  'case-studies': '/du-an',
  showroom: '/showroom',
  about: '/ve-chung-toi',
};

export function App({ route: currentRoute }: { route: AppRoute }) {
  const [modalType, setModalType] = useState<LeadModalType>(null);
  const [modalContext, setModalContext] = useState<string | undefined>(undefined);

  const handleNavigate = (route: AppRoute) => {
    router.visit(ROUTE_URLS[route]);
  };

  const handleOpenModal = (type: LeadModalType, summary?: string) => {
    setModalContext(summary);
    setModalType(type);
  };

  const handleBookShowroom = () => {
    if (currentRoute === 'home') {
      const el = document.getElementById('living-lab-booking');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    handleNavigate('showroom');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-[#F8FAFC]">
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onBookShowroom={handleBookShowroom}
      />

      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenModal={handleOpenModal}
            onScrollToLivingLab={handleBookShowroom}
          />
        )}

        {currentRoute === 'platform' && (
          <PlatformPage
            onNavigate={handleNavigate}
            onOpenModal={handleOpenModal}
          />
        )}

        {(currentRoute === 'solutions-event' ||
          currentRoute === 'solutions-venue' ||
          currentRoute === 'solutions-custom') && (
          <SolutionsPage
            activeBranch={currentRoute}
            onNavigate={handleNavigate}
            onOpenModal={handleOpenModal}
          />
        )}

        {currentRoute === 'case-studies' && (
          <CaseStudiesPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'showroom' && <ShowroomPage />}

        {currentRoute === 'about' && <AboutPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} onOpenModal={handleOpenModal} />

      <LeadModal
        modalType={modalType}
        onClose={() => setModalType(null)}
        contextSummary={modalContext}
      />
    </div>
  );
}

export default App;
