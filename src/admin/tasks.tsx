// admin/AllSubscriptionsPage.tsx — responsive version
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
import AdminSidebar from "./component/AdminSidebar";

type AdminStatus = 0 | 1;

interface Subscription {
  _id: string;
  subscriptionId: string;
  userId: string;
  planId: string;
  pricingId: string;
  planName: string;
  profileLink: string;
  orderId: string;
  paymentId: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  Status: AdminStatus;
  pricing?: {
    pricingId: string;
    name: string;
    price: string;
    description?: string;
    isPopular?: boolean;
    features?: string[];
  } | null;
}

interface ListPaging {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ListResponse {
  message: string;
  paging: ListPaging;
  data: Subscription[];
}

// Reuse the same little UI badges you already use
const statusPill = (Status: AdminStatus) => {
  if (Status === 0) {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium text-sky-700 bg-sky-100">
        In Process
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-100">
      Completed
    </span>
  );
};

export default function AllSubscriptionsPage() {
  const navigate = useNavigate();

  // table state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Subscription[]>([]);

  // query state (matches your new controller)
  const [filter, setFilter] = useState<"all" | "inprocess" | "completed">("all");
  const [q, setQ] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sortBy, setSortBy] = useState<keyof Subscription | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [paging, setPaging] = useState<ListPaging>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const isAdmin = localStorage.getItem("adminId");
    if (!token || isAdmin == null) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const computedStatusFilter = useMemo(() => {
    if (filter === "inprocess") return 0;
    if (filter === "completed") return 1;
    return undefined;
  }, [filter]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      // NEW API → matches your controllers.listSubscriptions
      const { data } = await api.post<ListResponse>("/admin/tasks", {
        page,
        limit,
        sortBy,
        sortOrder,
        Status: computedStatusFilter,
        q: q?.trim() || undefined,
      });

      setRows(data.data || []);
      setPaging(data.paging);
    } catch (e: any) {
      console.error("Failed to load all subscriptions", e);
      setError(e?.response?.data?.message || e?.message || "Failed to load subscriptions");
      Swal.fire("Error", "Failed to load subscriptions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sortBy, sortOrder, filter]);

  const runSearch = () => {
    setPage(1);
    void load();
  };

  const clearSearch = () => {
    setQ("");
    setPage(1);
    void load();
  };

  const toggleStatus = async (s: Subscription) => {
    const next: AdminStatus = s.Status === 0 ? 1 : 0;
    const confirm = await Swal.fire({
      title: next === 1 ? "Mark as Completed?" : "Mark as In Process?",
      text:
        next === 1
          ? "This will set admin status to Completed (1)."
          : "This will set admin status to In Process (0).",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    });
    if (!confirm.isConfirmed) return;

    try {
      // NEW API → matches your controllers.updateSubscriptionAdminStatus
      const body = { subscriptionId: s.subscriptionId, Status: next };
      const { data } = await api.post("/admin/upStatus", body);

      if (!data?.subscription) throw new Error("No subscription returned");
      // Optimistically update row in the current page
      setRows(prev =>
        prev.map(item =>
          item.subscriptionId === s.subscriptionId ? { ...item, Status: next } : item
        )
      );
      Swal.fire("Updated", "Subscription status updated.", "success");
    } catch (e: any) {
      console.error("Update status failed", e);
      Swal.fire("Error", e?.response?.data?.message || "Failed to update status", "error");
    }
  };

  // Mobile-first card for each subscription (shown on <sm)
  const MobileSubscriptionCard = ({ s }: { s: Subscription }) => (
    <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900">
            {(s.planName ? s.planName.charAt(0).toUpperCase() + s.planName.slice(1) : "—")}
          </div>
          <div className="mt-0.5 text-sm text-slate-600">{formatDate(s.createdAt)}</div>
        </div>
        {statusPill(s.Status)}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Pricing</span>
          <span className="text-slate-900 font-medium text-right">
            {s.pricing?.name ?? "—"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Price</span>
          <span className="text-slate-900">{s.pricing?.price ?? "—"}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Order</span>
          <span className="text-slate-900 break-all text-right">{s.orderId || "—"}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Payment</span>
          <span className="text-slate-900 break-all text-right">{s.paymentId || "—"}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Profile</span>
          {s.profileLink ? (
            <a
              href={s.profileLink}
              className="text-blue-700 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Open Profile
            </a>
          ) : (
            <span className="text-slate-500">—</span>
          )}
        </div>
      </div>

      <button
        onClick={() => void toggleStatus(s)}
        aria-label={s.Status === 0 ? "Mark Completed" : "Mark In Process"}
        className={`mt-3 w-full px-3 py-2 rounded-lg border transition ${
            s.Status === 0
              ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
              : "bg-sky-600 text-white border-sky-700 hover:bg-sky-700"
          }`}
      >
        {s.Status === 0 ? "Mark Completed" : "Mark In Process"}
      </button>
    </div>
  );

  // identical table/UI vibe as your user page
  return (
    <div className="flex min-h-screen bg-blue-100">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-blue-50">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pt-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">All Subscriptions</h1>
            <p className="text-slate-600 text-sm">View & manage every subscription.</p>
          </div>

          {/* Controls — now mobile-first responsive */}
          <div className="w-full lg:w-auto">
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:auto-cols-max lg:grid-flow-col gap-2">
              {/* Search */}
              <div className="flex w-full items-center gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Search by ID, email, userId, plan…"
                  className="w-full sm:w-72 md:w-80 px-3 py-2 rounded-lg border border-blue-200 bg-white text-slate-700"
                />
                <button
                  onClick={runSearch}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 w-auto"
                >
                  Search
                </button>
                {q && (
                  <button
                    onClick={clearSearch}
                    className="px-3 py-2 rounded-lg bg-white border border-blue-200 text-slate-700 hover:bg-blue-50 w-auto"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status filter */}
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as any);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-slate-700 w-full"
              >
                <option value="all">All</option>
                <option value="inprocess">In Process</option>
                <option value="completed">Completed</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split(":");
                  setSortBy(sb as any);
                  setSortOrder(so as "asc" | "desc");
                  setPage(1);
                }}
                className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-slate-700 w-full"
              >
                <option value="createdAt:desc">Newest first</option>
                <option value="createdAt:asc">Oldest first</option>
                <option value="planName:asc">Plan A–Z</option>
                <option value="planName:desc">Plan Z–A</option>
              </select>

              {/* Page size */}
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-slate-700 w-full"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>

              <Link
                to="/admin/client"
                className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 w-full sm:w-auto text-center"
              >
                Back to Users
              </Link>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 border border-red-200 p-4">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center">Loading subscriptions…</div>
        ) : rows.length === 0 ? (
          <p className="text-center text-slate-600">No subscriptions found.</p>
        ) : (
          <>
            {/* Mobile cards (<sm) */}
            <div className="sm:hidden space-y-3">
              {rows.map((s) => (
                <MobileSubscriptionCard key={s._id} s={s} />
              ))}
            </div>

            {/* Table (≥sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-blue-600 text-white rounded-t-lg">
                  <tr>
                    <th className="py-3 px-6 text-left">Plan</th>
                    <th className="py-3 px-6 text-left">Pricing</th>
                    <th className="py-3 px-6 text-left">Profile</th>
                    <th className="py-3 px-6 text-left">Order / Payment</th>
                    <th className="py-3 px-6 text-left">Created</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s._id} className="border-b hover:bg-slate-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">{s.planName ? s.planName.charAt(0).toUpperCase() + s.planName.slice(1) : "—"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-slate-900 font-medium">
                          {s.pricing?.name ?? "—"}
                        </div>
                        <div className="text-slate-600 text-sm">
                          {s.pricing?.price ?? "—"}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {s.profileLink ? (
                          <a
                            href={s.profileLink}
                            className="text-blue-700 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open Profile
                          </a>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-slate-900 text-sm">
                          <span className="font-semibold">Order:</span> {s.orderId || "—"}
                        </div>
                        <div className="text-slate-900 text-sm">
                          <span className="font-semibold">Payment:</span> {s.paymentId || "—"}
                        </div>
                      </td>

                      <td className="py-4 px-6">{formatDate(s.createdAt)}</td>

                      <td className="py-4 px-6">{statusPill(s.Status)}</td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => void toggleStatus(s)}
                          className={`px-3 py-1.5 rounded-lg border transition ${
                            s.Status === 0
                              ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                              : "bg-sky-600 text-white border-sky-700 hover:bg-sky-700"
                          }`}
                        >
                          {s.Status === 0 ? "Mark Completed" : "Mark In Process"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-slate-600 text-center sm:text-left">
                Page {paging.page} of {paging.pages} • {paging.total} total
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  disabled={!paging.hasPrev}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={`px-3 py-2 rounded-lg border ${
                    paging.hasPrev
                      ? "bg-white text-slate-800 hover:bg-blue-50 border-blue-200"
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  Prev
                </button>
                <button
                  disabled={!paging.hasNext}
                  onClick={() => setPage(p => p + 1)}
                  className={`px-3 py-2 rounded-lg border ${
                    paging.hasNext
                      ? "bg-white text-slate-800 hover:bg-blue-50 border-blue-200"
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
