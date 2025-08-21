'use client';

import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Play,
    Instagram,
    Search,
    X,
    CheckCircle,
    Globe
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */
interface ServiceContentItem {
    contentId: string;
    key: string;
    value: string;
}

interface Service {
    serviceId: string;
    serviceHeading: string;
    serviceDescription: string;
    serviceContent: ServiceContentItem[];
    logo?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Helper functions                              */
/* -------------------------------------------------------------------------- */
const slugify = (text: string): string =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-') // collapse non-alphanumerics
        .replace(/^-+|-+$/g, '');    // strip leading/trailing “-”

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */
export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    /* ----------------------------- Auth check -------------------------------- */
    useEffect(() => {
        const token = localStorage.getItem('token');
        const clientId = localStorage.getItem('clientId');
        setIsLoggedIn(Boolean(token && clientId));
    }, []);

    /* --------------------------- Fetch services ------------------------------ */
    useEffect(() => {
        async function fetchServices() {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/services/getAll', {
                    params: { page: 1, limit: 100, search },
                });
                setServices(res.data.data);
            } catch (err: any) {
                setError(err?.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, [search]);

    /* ----------------------------- Icon / logo ------------------------------- */
    const renderIconOrLogo = (svc: Service) => {
        if (svc.logo) {
            const src = svc.logo.startsWith('data:')
                ? svc.logo
                : `data:image/png;base64,${svc.logo}`;
            return (
                <img
                    src={src}
                    alt={svc.serviceHeading}
                    className="h-16 w-16 rounded-full object-cover transition group-hover:blur-0"
                />
            );
        }
        const h = svc.serviceHeading.toLowerCase();
        if (h.includes('instagram'))
            return <Instagram className="h-8 w-8 text-pink-600" />;
        if (h.includes('youtube'))
            return <Play className="h-8 w-8 text-red-600" />;
        return <Play className="h-8 w-8 text-blue-600" />;
    };

    /* -------------------------------------------------------------------------- */
    /*                                   View                                     */
    /* -------------------------------------------------------------------------- */
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 text-gray-900">
            {/* ───────────────────────────── Header ───────────────────────────── */}
            <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-lg">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">
                    <a href="/" className="flex items-center space-x-3">
                        <Globe className="h-10 w-10 text-blue-600 drop-shadow-xl" />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                            LikLet
                        </span>
                    </a>

                    <div className="flex items-center space-x-4">
                        {showSearch ? (
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search services…"
                                    autoFocus
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-48 rounded-full border border-gray-300 bg-white px-4 pr-10 text-sm shadow-md transition focus:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-72"
                                />
                                <button
                                    onClick={() => setShowSearch(false)}
                                    className="absolute right-2 rounded-full p-1 hover:bg-gray-200"
                                >
                                    <X className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowSearch(true)}
                                className="rounded-full p-2 hover:bg-gray-200"
                            >
                                <Search className="h-6 w-6 text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* ──────────────────────────── Hero copy ─────────────────────────── */}
            <section className="relative py-20 text-center">
                <h1 className="mb-4 text-5xl font-extrabold md:text-6xl">
                    Discover Our{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Services
                    </span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
                    Boost your social media presence with our tailored engagement solutions.
                </p>
            </section>

            {/* ───────────────────────────── Main ─────────────────────────────── */}
            <main className="flex-grow pb-20">
                <div className="container mx-auto px-4">
                    {error && <p className="mb-6 text-center text-red-500">{error}</p>}
                    {loading ? (
                        <p className="text-center text-gray-600">Loading services…</p>
                    ) : (
                        <div className="grid justify-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((svc) => (
                                <div
                                    key={svc.serviceId}
                                    className="group rounded-2xl bg-blue p-6 shadow border-2 border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300"
                                >
                                    {/* Card Header */}
                                    <div className="mb-4 text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
                                            {renderIconOrLogo(svc)}
                                        </div>
                                        <h3 className="text-2xl font-semibold text-gray-900">
                                            {svc.serviceHeading}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {svc.serviceDescription}
                                        </p>
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-col items-center space-y-3">
                                        {svc.serviceContent.map((item) => (
                                            <div
                                                key={item.contentId}
                                                className="flex items-center space-x-3 text-sm"
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <span>
                                                    {item.key}
                                                </span>
                                            </div>
                                        ))}

                                        <div className="pt-4">
                                            {/* ⬇️  use /services/ + slug so it matches the router path */}
                                            <a
                                                href={`/services/${slugify(svc.serviceHeading)}`}
                                                className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white shadow hover:from-blue-700 hover:to-indigo-700"
                                            >
                                                View Package
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ───────────────────────────── Footer ───────────────────────────── */}
            <footer className="bg-gray-900 pb-8 text-center text-white">
                <div className="border-t border-gray-800 pt-8 text-gray-400">
                    &copy; {new Date().getFullYear()} LikLet. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
