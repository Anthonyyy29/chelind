import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#000e38] py-12 font-poppins text-white selection:bg-blue-600 selection:text-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-start justify-between gap-6 pb-8 sm:flex-row sm:items-center">
                    <div className="space-y-2">
                        <Link to="/" className="inline-block">
                            <span className="flex items-center gap-0.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                chel
                                <span className="mx-0.5 inline-block h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                                indo
                            </span>
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
                        <Link
                            to="/komunitas"
                            className="transition-colors hover:text-white"
                        >
                            Community
                        </Link>
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
