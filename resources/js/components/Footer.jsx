import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_COMMUNITY_URL } from '../lib/whatsapp';

export default function Footer() {
    return (
        <footer className="bg-[#000e38] py-12 font-poppins text-white selection:bg-blue-600 selection:text-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-start justify-between gap-6 pb-8 sm:flex-row sm:items-center">
                    <div className="space-y-2">
                        <Link to="/" className="inline-block">
                            <img
                                src="/assets/logo-chelindo-white.png"
                                alt="Chelindo"
                                className="h-8 w-auto sm:h-10"
                            />
                        </Link>
                        <p className="text-xs font-normal text-slate-300 sm:text-sm">
                            Indonesia's largest Chelsea supporters community.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 text-xs font-semibold text-slate-300 sm:text-sm">
                        <Link
                            to="/berita"
                            className="transition-colors hover:text-white"
                        >
                            News
                        </Link>
                        <Link
                            to="/matchday"
                            className="transition-colors hover:text-white"
                        >
                            Matchday
                        </Link>
                        <a
                            href={WHATSAPP_COMMUNITY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-white"
                        >
                            Community
                        </a>
                    </div>
                </div>

                <div className="mb-6 w-full border-b border-white/20" />

                <p className="text-xs font-normal text-slate-300">
                    © {new Date().getFullYear()} Chelindo. Independent fan site
                    — not affiliated with Chelsea Football Club.
                </p>
            </div>
        </footer>
    );
}
