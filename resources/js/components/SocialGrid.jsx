import React, { useState, useEffect } from 'react';
import { getSocialLinks } from '../api/client';
import { getSocialIcon } from '../lib/socialIcons';

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
                        const Icon = getSocialIcon(item.platform);
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
                            const Icon = getSocialIcon(item.platform);
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
