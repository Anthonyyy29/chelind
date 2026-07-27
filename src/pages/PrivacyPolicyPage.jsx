import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage({ onNavigateBack }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-poppins selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Main Privacy Policy Container matching target design 100% */}
      <main className="max-w-4xl mx-auto pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onNavigateBack || (() => (window.location.hash = '#home'))}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>

        {/* Page Title & Last Updated */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Last updated: April 11, 2026
          </p>
        </div>

        {/* Privacy Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {/* 1. Introduction */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              1. Introduction
            </h2>
            <p>
              Chelindo ("we", "our", or "us") operates the Chelindo platform and website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
            </p>
            <p>
              We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
            </p>
          </section>

          {/* 2. Information Collection and Use */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              2. Information Collection and Use
            </h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our service to you.
            </p>
            
            <div className="pt-2">
              <h3 className="font-bold text-slate-900 mb-2">
                Types of Data Collected:
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  <strong className="text-slate-900">Personal Data:</strong> Name, email address, phone number, location, and profile information
                </li>
                <li>
                  <strong className="text-slate-900">Item Data:</strong> Description, photos, category, and status of lost/found items
                </li>
                <li>
                  <strong className="text-slate-900">Usage Data:</strong> Information about how you interact with our platform
                </li>
                <li>
                  <strong className="text-slate-900">Technical Data:</strong> IP address, browser type, and device information
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Use of Data */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              3. Use of Data
            </h2>
            <p>
              Chelindo uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To match lost and found items</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve the service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          {/* 4. Security of Data */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              4. Security of Data
            </h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* 5. Changes to This Privacy Policy */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              5. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* 6. Contact Us */}
          <section className="space-y-3 pt-2 border-t border-slate-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              6. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us by email at{' '}
              <a href="mailto:support@chelind.id" className="text-blue-600 font-semibold hover:underline">
                support@chelind.id
              </a>{' '}
              or via our official community support channels.
            </p>
          </section>
        </div>
      </main>

      <WhatsappBanner />
      <Footer />
    </div>
  );
}
