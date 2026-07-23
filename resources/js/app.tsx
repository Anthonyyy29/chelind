import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../css/app.css';

// Placeholder — Ali lanjutkan dari sini. Daftar halaman & endpoint yang
// tersedia ada di KONTEKS-ALI.md dan API.md di root repo ini.
function Home() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-semibold">Chelind Football</h1>
        </main>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

const container = document.getElementById('app');

if (container) {
    createRoot(container).render(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
    );
}
