import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SocialGrid from './components/SocialGrid';
import FeatureShowcase from './components/FeatureShowcase';
import MatchSchedule from './components/MatchSchedule';
import WhatsappBanner from './components/WhatsappBanner';
import NewsGrid from './components/NewsGrid';
import Footer from './components/Footer';

// Pages
import CategoryPage from './pages/CategoryPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import MatchesPage from './pages/MatchesPage';
import NewsPage from './pages/NewsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const [route, setRoute] = useState('home');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState('palmer-double-sinks-spurs');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('chelind_admin_logged') === 'true';
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('chelind_admin_role') || 'owner';
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#article-detail')) {
        const slug = hash.split('/')[1] || 'palmer-double-sinks-spurs';
        setSelectedArticleSlug(slug);
        setRoute('article-detail');
      } else if (hash === '#news-page') {
        setRoute('news-page');
      } else if (hash === '#category-matchday') {
        setRoute('category-matchday');
      } else if (hash === '#category-transfer') {
        setRoute('category-transfer');
      } else if (hash === '#matches-page') {
        setRoute('matches-page');
      } else if (hash === '#privacy-policy') {
        setRoute('privacy-policy');
      } else if (hash === '#admin') {
        setRoute('admin');
      } else {
        setRoute('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToArticle = (slug) => {
    window.location.hash = `#article-detail/${slug}`;
  };

  const navigateHome = () => {
    window.location.hash = '#home';
  };

  const handleAdminLogin = (user) => {
    setIsLoggedIn(true);
    const role = user?.role || 'owner';
    setUserRole(role);
    localStorage.setItem('chelind_admin_logged', 'true');
    localStorage.setItem('chelind_admin_role', role);
  };

  const handleAdminLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('chelind_admin_logged');
    localStorage.removeItem('chelind_admin_role');
    window.location.hash = '#home';
  };

  if (route === 'admin') {
    if (!isLoggedIn) {
      return (
        <AdminLoginPage
          onLoginSuccess={handleAdminLogin}
          onNavigateBack={navigateHome}
        />
      );
    }
    return (
      <AdminDashboard
        initialRole={userRole}
        onNavigateBack={navigateHome}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (route === 'news-page') {
    return <NewsPage onSelectArticle={navigateToArticle} />;
  }

  if (route === 'category-matchday') {
    return <CategoryPage initialCategory="Matchday" onSelectArticle={navigateToArticle} />;
  }

  if (route === 'category-transfer') {
    return <CategoryPage initialCategory="Transfer News" onSelectArticle={navigateToArticle} />;
  }

  if (route === 'article-detail') {
    return (
      <ArticleDetailPage
        articleSlug={selectedArticleSlug}
        onNavigateBack={navigateHome}
        onSelectArticle={navigateToArticle}
      />
    );
  }

  if (route === 'matches-page') {
    return <MatchesPage onNavigateBack={navigateHome} />;
  }

  if (route === 'privacy-policy') {
    return <PrivacyPolicyPage onNavigateBack={navigateHome} />;
  }

  // Complete Landing Page matching user's full-page screenshot 100%
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-poppins selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main>
        {/* Section 1: Hero Banner */}
        <Hero />

        {/* Section 2: Our Social Media */}
        <SocialGrid />

        {/* Section 3: Feature Showcase (Matchday, News, Transfer News 3 Rows) */}
        <FeatureShowcase />

        {/* Section 4: Jadwal Pertandingan */}
        <MatchSchedule />

        {/* Section 5: WhatsApp Banner (HD chelsea.jpg) */}
        <WhatsappBanner />

        {/* Section 6: Berita Terbaru */}
        <NewsGrid onSelectArticle={navigateToArticle} />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
