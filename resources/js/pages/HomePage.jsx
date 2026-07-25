import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SocialGrid from '../components/SocialGrid';
import FeatureShowcase from '../components/FeatureShowcase';
import MatchSchedule from '../components/MatchSchedule';
import WhatsappBanner from '../components/WhatsappBanner';
import NewsGrid from '../components/NewsGrid';
import Footer from '../components/Footer';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-900 font-poppins text-slate-100 selection:bg-blue-600 selection:text-white">
            <Navbar />
            <main>
                <Hero />
                <SocialGrid />
                <FeatureShowcase />
                <MatchSchedule />
                <WhatsappBanner />
                <NewsGrid />
            </main>
            <Footer />
        </div>
    );
}
