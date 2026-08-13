import React from 'react';
import { WHATSAPP_COMMUNITY_URL } from '../lib/whatsapp';

export default function WhatsappBanner() {
    return (
        <section
            className="relative flex min-h-[460px] items-center justify-center overflow-hidden border-b-4 border-blue-600 bg-cover bg-no-repeat px-4 py-24 text-center text-white"
            style={{
                backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.45) 100%), url("/assets/HomePage_replacement_img/Join Community.jpg")`,
                backgroundPosition: 'center 40%',
            }}
        >
            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
                <h2 className="mb-3 text-3xl leading-tight font-extrabold tracking-tight text-white drop-shadow-xl sm:text-5xl">
                    What are you waiting for?
                </h2>
                <p className="mb-8 text-lg font-bold text-white drop-shadow-md sm:text-2xl">
                    Join our WhatsApp Community now!
                </p>
                <a
                    href={WHATSAPP_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transform rounded-full bg-[#001f66] px-9 py-3.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#002db3] hover:shadow-blue-500/40 active:scale-95 sm:text-sm"
                >
                    Join Our Community
                </a>
            </div>
        </section>
    );
}
