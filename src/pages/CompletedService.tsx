import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Loader2, Link as LinkIcon, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import api from '../api/axios';

interface CompletedServicesProps {
  onBack: () => void;
}

// API types
interface ApiSubscription {
  _id: string;
  userId: string;
  planId: string;
  pricingId: string;
  planName: string;
  profileLink: string;
  orderId: string;
  paymentId: string;
  status: string;
  createdAt: string;
  Status: number; // 1 = completed
  pricing?: {
    pricingId: string;
    name: string;
    price: string;
    description?: string;
    isPopular?: boolean;
    features?: string[];
  } | null;
}

interface ApiMeta {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

interface ServiceItem {
  id: string;
  name: string; // planName
  profileLink: string;
  orderId: string;
  paymentId: string;
  createdAt: string;
  statusText: string;
  statusCode: number;
  avatar: string;
  pricing: {
    pricingId: string;
    name: string;
    price: string;
    description?: string;
    isPopular?: boolean;
    features?: string[];
  } | null;
}

const PAGE_SIZE = 6;

// Colorized placeholder avatar based on plan name
const stringHash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
};
const hslToHex = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, '0');
  return `${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
};
const placeholderAvatar = (label: string) => {
  const hue = stringHash(label) % 360;
  const bg = hslToHex(hue, 55, 82);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${bg}&color=0F172A&format=png`;
};

const mapToService = (s: ApiSubscription): ServiceItem => ({
  id: s._id,
  name: s.planName || 'Plan',
  profileLink: s.profileLink,
  orderId: s.orderId,
  paymentId: s.paymentId,
  createdAt: s.createdAt,
  statusText: s.Status === 1 ? 'Completed' : s.status || '—',
  statusCode: s.Status,
  avatar: placeholderAvatar(s.planName || 'Plan'),
  pricing: s.pricing
    ? {
        pricingId: s.pricing.pricingId,
        name: s.pricing.name,
        price: s.pricing.price,
        description: s.pricing.description,
        isPopular: s.pricing.isPopular,
        features: s.pricing.features,
      }
    : null,
});

const getStatusColor = (statusCode: number) => {
  switch (statusCode) {
    case 1:
      return 'text-emerald-700 bg-emerald-100'; // Completed
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

const CompletedServices: React.FC<CompletedServicesProps> = ({ onBack }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [meta, setMeta] = useState<ApiMeta>({ total: 0, page: 1, perPage: PAGE_SIZE, lastPage: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const fetchCompleted = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Missing userId. Please log in again.');

      const res = await api.post('/subscription/completedService', { userId, page, limit: PAGE_SIZE });
      const { data, meta } = res.data as { data: ApiSubscription[]; meta: ApiMeta };
      const normalized = (data || []).map(mapToService);
      setServices(normalized);
      setMeta(meta || { total: normalized.length, page, perPage: PAGE_SIZE, lastPage: 1 });
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load completed services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleted(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const now = new Date();
    const thisMonthOnPage = services.filter((s) => {
      const dt = new Date(s.createdAt);
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    }).length;
    return {
      totalCompleted: meta.total,
      thisMonthOnPage,
    };
  }, [services, meta.total]);

  const canPrev = meta.page > 1;
  const canNext = meta.page < meta.lastPage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header card (tight for global header spacing) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <button
              onClick={onBack}
              className="p-2 md:p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Completed Services</h1>
              <p className="text-slate-600 mt-1 text-sm">Delivered projects tied to your subscriptions</p>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-700" size={22} />
                <div>
                  <p className="text-sm text-emerald-800">Total Completed</p>
                  <p className="text-2xl font-bold text-emerald-700">{counts.totalCompleted}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-700" size={22} />
                <div>
                  <p className="text-sm text-blue-800">Completed This Month (page)</p>
                  <p className="text-2xl font-bold text-blue-700">{counts.thisMonthOnPage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin mr-2" />
            <span className="text-slate-700">Loading completed services…</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => fetchCompleted(meta.page)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Loader2 size={16} className="animate-spin" /> Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => {
                const isOpen = !!open[service.id];
                return (
                  <div key={service.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="p-5 md:p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={service.avatar} alt={service.name} className="w-14 h-14 rounded-lg object-cover" />
                        <div className="flex-1">
                          {/* FRONT: pricing name + profile link + status */}
                          <div className="flex flex-wrap items-center gap-2 justify-between">
                            <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                              {service.name.charAt(0).toUpperCase() + service.name.slice(1)}
                            </h3>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(service.statusCode)}`}>
                              {service.statusText}
                            </span>
                          </div>
                          <div className="mt-2">
                            <a
                              href={service.profileLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-medium"
                            >
                              <LinkIcon size={16} /> Open Profile
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* TOGGLE */}
                      <button
                        onClick={() => toggle(service.id)}
                        className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isOpen ? 'Hide details' : 'Show more details'}
                      </button>

                      {isOpen && (
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Plan Name</span>
                            <span className="font-medium text-slate-900">{service.pricing?.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Order ID</span>
                            <span className="font-medium text-slate-900">{service.orderId}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Payment ID</span>
                            <span className="font-medium text-slate-900">{service.paymentId}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Pricing Amount</span>
                            <span className="font-semibold text-slate-900">{service.pricing?.price ?? '—'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Created At</span>
                            <span className="font-medium text-slate-900">{new Date(service.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {services.length === 0 && (
                <div className="col-span-full bg-white rounded-2xl shadow p-8 text-center text-slate-600">
                  No completed services found.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => canPrev && fetchCompleted(meta.page - 1)}
                disabled={!canPrev}
                className={`px-4 py-2 rounded-lg border ${
                  canPrev
                    ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                Previous
              </button>

              <div className="text-sm text-slate-600">
                Page <span className="font-semibold">{meta.page}</span> of{' '}
                <span className="font-semibold">{meta.lastPage}</span> • Showing{' '}
                <span className="font-semibold">{services.length}</span> of{' '}
                <span className="font-semibold">{meta.total}</span>
              </div>

              <button
                onClick={() => canNext && fetchCompleted(meta.page + 1)}
                disabled={!canNext}
                className={`px-4 py-2 rounded-lg border ${
                  canNext
                    ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompletedServices;
