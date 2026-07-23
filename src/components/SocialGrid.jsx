import React, { useState, useEffect } from 'react';
import { getSocialLinks } from '../api/client';

// Official SVG Logos matching Image 2 exactly 100%
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-2.89-2.89c.28 0 .56.04.83.12V9.41a6.34 6.34 0 00-.83-.05A6.34 6.34 0 1015.82 15.7V8.58a8.3 8.3 0 004.82 1.56V6.69z" />
  </svg>
);

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const FALLBACK_SOCIALS = [
  {
    id: 1,
    title: 'Instagram @chel.indo',
    url: 'https://instagram.com/chel.indo',
    icon: InstagramIcon,
    description: 'Cras tincidunt ut tortor ut vestibulum. Sed molestie laoreet purus, nec tempus lectus tincidunt eu. Lorem ipsum dolor sit amet, at mei dolore.',
  },
  {
    id: 2,
    title: 'X Chelind Footbal',
    url: 'https://x.com',
    icon: XIcon,
    description: 'Cras tincidunt ut tortor ut vestibulum. Sed molestie laoreet purus, nec tempus lectus tincidunt eu. Lorem ipsum dolor sit amet, at mei dolore.',
  },
  {
    id: 3,
    title: 'Youtube Chelind Football Media',
    url: 'https://youtube.com',
    icon: YoutubeIcon,
    description: 'Cras tincidunt ut tortor ut vestibulum. Sed molestie laoreet purus, nec tempus lectus tincidunt eu. Lorem ipsum dolor sit amet, at mei dolore.',
  },
  {
    id: 4,
    title: 'Tiktok @chelindfootball',
    url: 'https://tiktok.com',
    icon: TikTokIcon,
    description: 'Cras tincidunt ut tortor ut vestibulum. Sed molestie laoreet purus, nec tempus lectus tincidunt eu. Lorem ipsum dolor sit amet, at mei dolore.',
  },
  {
    id: 5,
    title: 'Whatsapp Community',
    url: 'https://chat.whatsapp.com/LqpgBD74aQVDd3tICsvCoG',
    icon: WhatsAppIcon,
    description: 'Cras tincidunt ut tortor ut vestibulum. Sed molestie laoreet purus, nec tempus lectus tincidunt eu. Lorem ipsum dolor sit amet, at mei dolore.',
  },
];

export default function SocialGrid() {
  const [socials, setSocials] = useState(FALLBACK_SOCIALS);

  useEffect(() => {
    async function load() {
      const data = await getSocialLinks();
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((item) => ({
          id: item.id,
          title: `${item.platform ? item.platform.toUpperCase() : ''} ${item.handle || ''}`,
          url: item.url,
          icon: getIcon(item.platform),
          description: item.description || 'Kunjungi akun resmi kami untuk update terbaru.',
        }));
        setSocials(mapped);
      }
    }
    load();
  }, []);

  function getIcon(platform = '') {
    const p = platform.toLowerCase();
    if (p.includes('ig') || p.includes('instagram')) return InstagramIcon;
    if (p.includes('x') || p.includes('twitter')) return XIcon;
    if (p.includes('yt') || p.includes('youtube')) return YoutubeIcon;
    if (p.includes('tok') || p.includes('tiktok')) return TikTokIcon;
    return WhatsAppIcon;
  }

  const topRow = socials.slice(0, 3);
  const bottomRow = socials.slice(3, 5);

  return (
    <section id="social" className="bg-[#bebebe] py-20 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Header with Blue Accent Bar matching Image 2 100% */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-2 tracking-tight">
          Our Social Media
        </h2>
        <div className="w-12 h-[3px] bg-[#001f66] mx-auto mb-4" />
        <p className="text-slate-700 text-xs sm:text-sm mb-14">
          Klik logo dibawah untuk mengakses sosial media kami.
        </p>

        {/* Row 1 (3 items: Instagram, X, YouTube) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {topRow.map((item) => {
            const IconComp = item.icon || WhatsAppIcon;
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group cursor-pointer p-2 transition-transform duration-200 hover:scale-105"
              >
                <div className="mb-4 text-[#001f66] group-hover:scale-110 transition-transform duration-300">
                  <IconComp className="w-10 h-10 sm:w-11 sm:h-11" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#0f172a] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </a>
            );
          })}
        </div>

        {/* Row 2 (2 items centered: TikTok, WhatsApp) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {bottomRow.map((item) => {
            const IconComp = item.icon || WhatsAppIcon;
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group cursor-pointer p-2 transition-transform duration-200 hover:scale-105 w-full md:w-80"
              >
                <div className="mb-4 text-[#001f66] group-hover:scale-110 transition-transform duration-300">
                  <IconComp className="w-10 h-10 sm:w-11 sm:h-11" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#0f172a] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
