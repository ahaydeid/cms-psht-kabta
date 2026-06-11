import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import all pages
import HomeIndex from './Index';
import ProfilTentang from './ProfilTentang';
import ProfilStrukturOrganisasi from './ProfilStrukturOrganisasi';
import ProfilRanting from './ProfilRanting';
import ProfilKeanggotaan from './ProfilKeanggotaan';
import ProfilKeanggotaanDetail from './ProfilKeanggotaanDetail';
import Berita from './Berita';
import BeritaDetail from './BeritaDetail';
import Galeri from './Galeri';
import Jadwal from './Jadwal';
import Agenda from './Agenda';
import Kontak from './Kontak';

function App() {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const handleLocationChange = () => {
            setPath(window.location.pathname);
            window.scrollTo(0, 0);
        };
        window.addEventListener('popstate', handleLocationChange);
        window.addEventListener('app-navigation', handleLocationChange);
        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            window.removeEventListener('app-navigation', handleLocationChange);
        };
    }, []);

    // Simple path routing matching the navigation items
    if (path === '/') return <HomeIndex />;
    if (path === '/profil/tentang') return <ProfilTentang />;
    if (path === '/profil/struktur-organisasi') return <ProfilStrukturOrganisasi />;
    if (path === '/profil/ranting') return <ProfilRanting />;
    if (path === '/profil/keanggotaan') return <ProfilKeanggotaan />;
    if (path.startsWith('/profil/keanggotaan/')) {
        const id = path.replace('/profil/keanggotaan/', '');
        return <ProfilKeanggotaanDetail memberId={id} />;
    }
    if (path === '/berita') return <Berita />;
    if (path.startsWith('/berita/')) {
        const slug = path.replace('/berita/', '');
        return <BeritaDetail slug={slug} />;
    }
    if (path === '/galeri') return <Galeri />;
    if (path === '/jadwal') return <Jadwal />;
    if (path === '/agenda') return <Agenda />;
    if (path === '/kontak') return <Kontak />;

    // Fallback: 404 page
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-zinc-50 font-sans p-4 text-center">
            <h1 className="text-3xl font-bold text-zinc-950">404</h1>
            <p className="text-zinc-600 mt-2">Halaman tidak ditemukan.</p>
            <a href="/" className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-semibold rounded-md transition shadow-sm">
                Kembali ke Beranda
            </a>
        </div>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
