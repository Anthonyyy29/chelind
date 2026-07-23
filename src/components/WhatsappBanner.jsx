import React from 'react';

export default function WhatsappBanner() {
  return (
    <section
      className="relative min-h-[460px] py-24 px-4 flex items-center justify-center text-center text-white bg-cover bg-no-repeat overflow-hidden border-b-4 border-blue-600"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.45) 100%), url("assets/news/chelsea.jpg")`,
        backgroundPosition: 'center 40%',
      }}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight drop-shadow-xl">
          What are you waiting for?
        </h2>
        <p className="text-lg sm:text-2xl font-bold text-white mb-8 drop-shadow-md">
          Join our WhatsApp Community now!
        </p>
        <a
          href="https://chat.whatsapp.com/LqpgBD74aQVDd3tICsvCoG"
          target="_blank"
          rel="noopener noreferrer"
          className="px-9 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#001f66] hover:bg-[#002db3] text-white shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          JOIN OUR COMMUNITY
        </a>
      </div>
    </section>
  );
}
