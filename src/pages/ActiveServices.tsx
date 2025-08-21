import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, Calendar, Loader2, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api/axios';

interface ActiveServicesProps {
  onBack: () => void;
  onViewCompleted: () => void;
}

// --- API types based on your sample response ---
interface ApiSubscription {
  _id: string;
  userId: string;
  planId: string;
  pricingId: string;
  planName: string; // "name"
  profileLink: string;
  orderId: string;
  paymentId: string;
  amount: number; // ignored in UI per request
  currency: string; // ignored in UI per request
  status: string; // e.g. "active"
  startedAt?: string;
  subscriptionId?: string;
  createdAt: string;
  updatedAt?: string;
  Status: number; // admin status: 0 = in process
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

// Normalized UI type
interface ServiceItem {
  id: string;
  name: string; // planName
  profileLink: string;
  orderId: string;
  paymentId: string;
  createdAt: string;
  statusText: string; // derived from Status numeric
  statusCode: number; // raw Status
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

// --- Utils: name -> stable light hex for avatar background ---
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
  const hue = stringHash(label) % 360; // 0-359
  const bg = hslToHex(hue, 55, 82); // pleasant light color
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${bg}&color=0F172A&format=png`;
};

const mapToService = (s: ApiSubscription): ServiceItem => ({
  id: s._id,
  name: s.planName || 'Plan',
  profileLink: s.profileLink,
  orderId: s.orderId,
  paymentId: s.paymentId,
  createdAt: s.createdAt,
  statusText: s.Status === 0 ? 'In Process' : s.status || '—',
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
    case 0:
      return 'text-sky-700 bg-sky-100'; // In Process
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

const ActiveServices: React.FC<ActiveServicesProps> = ({ onBack, onViewCompleted }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [meta, setMeta] = useState<ApiMeta>({ total: 0, page: 1, perPage: PAGE_SIZE, lastPage: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({}); // details toggle per card

  const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const fetchActive = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Missing userId. Please log in again.');

      const res = await api.post('/subscription/activeService', { userId, page, limit: PAGE_SIZE });
      const { data, meta } = res.data as { data: ApiSubscription[]; meta: ApiMeta };
      const normalized = (data || []).map(mapToService);
      setServices(normalized);
      setMeta(meta || { total: normalized.length, page, perPage: PAGE_SIZE, lastPage: 1 });
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load active services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActive(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Summary numbers (kept minimal)
  const counts = useMemo(() => {
    const now = new Date();
    const thisMonthOnPage = services.filter((s) => {
      const dt = new Date(s.createdAt);
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    }).length;
    return {
      totalActive: meta.total,
      thisMonthOnPage,
    };
  }, [services, meta.total]);

  const canPrev = meta.page > 1;
  const canNext = meta.page < meta.lastPage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header wrapper trimmed since you already have a global header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={onBack}
                className="p-2 md:p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Active Services</h1>
              </div>
            </div>

            <button
              onClick={onViewCompleted}
              className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <CheckCircle size={18} />
              Completed Services
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
              <div className="flex items-center gap-3">
                <Clock className="text-sky-700" size={22} />
                <div>
                  <p className="text-sm text-sky-800">Total Active</p>
                  <p className="text-2xl font-bold text-sky-700">{counts.totalActive}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-700" size={22} />
                <div>
                  <p className="text-sm text-blue-800">Created This Month (page)</p>
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
            <span className="text-slate-700">Loading active services…</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => fetchActive(meta.page)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Loader2 size={16} className="animate-spin" /> Retry
            </button>
          </div>
        )}

        {/* Services Grid */}
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
                          {/* FRONT: only pricing name + profile link + status pill */}
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

                      {/* TOGGLE BUTTON */}
                      <button
                        onClick={() => toggle(service.id)}
                        className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isOpen ? 'Hide details' : 'Show more details'}
                      </button>

                      {/* DETAILS (collapsible) */}
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
                  No active services found.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => canPrev && fetchActive(meta.page - 1)}
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
                onClick={() => canNext && fetchActive(meta.page + 1)}
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

export default ActiveServices;
