import React, { useState, useEffect } from 'react';
import { getSocialLinks } from '../api/client';

const InstagramIcon = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
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
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const TikTokIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-2.89-2.89c.28 0 .56.04.83.12V9.41a6.34 6.34 0 00-.83-.05A6.34 6.34 0 1015.82 15.7V8.58a8.3 8.3 0 004.82 1.56V6.69z" />
    </svg>
);

const WhatsAppIcon = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

function getIcon(platform = '') {
    const p = platform.toLowerCase();
    if (p.includes('ig') || p.includes('instagram')) return InstagramIcon;
    if (p.includes('x') || p.includes('twitter')) return XIcon;
    if (p.includes('yt') || p.includes('youtube')) return YoutubeIcon;
    if (p.includes('tok') || p.includes('tiktok')) return TikTokIcon;
    return WhatsAppIcon;
}

export default function SocialGrid() {
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        getSocialLinks()
            .then((data) => setSocials(Array.isArray(data) ? data : []))
            .catch(() => setSocials([]));
    }, []);

    if (socials.length === 0) {
        return null;
    }

    const topRow = socials.slice(0, 3);
    const bottomRow = socials.slice(3, 5);

    return (
        <section
            id="social"
            className="bg-[#bebebe] px-4 py-20 font-poppins sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-5xl text-center">
                <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
                    Our Social Media
                </h2>
                <div className="mx-auto mb-4 h-[3px] w-12 bg-[#001f66]" />
                <p className="mb-14 text-xs text-slate-700 sm:text-sm">
                    Klik logo dibawah untuk mengakses sosial media kami.
                </p>

                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {topRow.map((item) => {
                        const Icon = getIcon(item.platform);
                        return (
                            <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex cursor-pointer flex-col items-center p-2 text-center transition-transform duration-200 hover:scale-105"
                            >
                                <div className="mb-4 text-[#001f66] transition-transform duration-300 group-hover:scale-110">
                                    <Icon className="h-10 w-10 sm:h-11 sm:w-11" />
                                </div>
                                <h3 className="mb-2 text-base font-extrabold text-[#0f172a] sm:text-lg">
                                    {item.platform} {item.handle}
                                </h3>
                                <p className="max-w-xs text-xs leading-relaxed text-slate-700">
                                    {item.description ||
                                        'Kunjungi akun resmi kami untuk update terbaru.'}
                                </p>
                            </a>
                        );
                    })}
                </div>

                {bottomRow.length > 0 && (
                    <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
                        {bottomRow.map((item) => {
                            const Icon = getIcon(item.platform);
                            return (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex w-full cursor-pointer flex-col items-center p-2 text-center transition-transform duration-200 hover:scale-105 md:w-80"
                                >
                                    <div className="mb-4 text-[#001f66] transition-transform duration-300 group-hover:scale-110">
                                        <Icon className="h-10 w-10 sm:h-11 sm:w-11" />
                                    </div>
                                    <h3 className="mb-2 text-base font-extrabold text-[#0f172a] sm:text-lg">
                                        {item.platform} {item.handle}
                                    </h3>
                                    <p className="max-w-xs text-xs leading-relaxed text-slate-700">
                                        {item.description ||
                                            'Kunjungi akun resmi kami untuk update terbaru.'}
                                    </p>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
