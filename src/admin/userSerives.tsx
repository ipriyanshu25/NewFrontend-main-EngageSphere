// admin/userSerives.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  amount?: number;      // may exist, but we don't display it
  currency?: string;    // may exist, but we don't display it
  status?: string;      // textual status from gateway
  createdAt: string;
  updatedAt?: string;
  Status: AdminStatus;  // 0=in process, 1=completed
  // If your backend enriches pricing, you'll have this:
  pricing?: {
    pricingId: string;
    name: string;
    price: string;
    description?: string;
    isPopular?: boolean;
    features?: string[];
  } | null;
}

interface GetUserSubsResponse {
  success: boolean;
  total: number;
  subscriptions: Subscription[];
}

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

export default function UserSerivesPage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(true);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "inprocess" | "completed">("all");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const isAdmin = localStorage.getItem("adminId");
    if (!token || isAdmin == null) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const load = async () => {
    if (!userId) {
      setError("Missing userId in URL");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post<GetUserSubsResponse>("/subscription/user", { userId });
      if (!data.success) throw new Error("Request failed");
      setSubs(data.subscriptions || []);
    } catch (e: any) {
      console.error("Failed to load subscriptions", e);
      setError(e?.response?.data?.message || e?.message || "Failed to load subscriptions");
      Swal.fire("Error", "Failed to load subscriptions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [userId]);

  const filtered = useMemo(() => {
    if (filter === "inprocess") return subs.filter(s => s.Status === 0);
    if (filter === "completed") return subs.filter(s => s.Status === 1);
    return subs;
  }, [subs, filter]);

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
      const body = { subscriptionId: s.subscriptionId, Status: next };
      const { data } = await api.post("/admin/upStatus", body);
      if (!data?.subscription) throw new Error("No subscription returned");
      setSubs(prev =>
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-blue-100">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center">Loading subscriptions…</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-100">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 bg-blue-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">User Subscriptions</h1>

          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-slate-700"
            >
              <option value="all">All</option>
              <option value="inprocess">In Process</option>
              <option value="completed">Completed</option>
            </select>
            <Link
              to="/admin/client"
              className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Back to Users
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 border border-red-200 p-4">
            {error}
          </div>
        )}

        {/* Table */}
        {filtered.length === 0 ? (
          <p className="text-center text-slate-600">No subscriptions found.</p>
        ) : (
          <div className="overflow-x-auto">
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
                {filtered.map((s) => (
                  <tr key={s._id} className="border-b hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        {/* <img
                          src={avatarFromName(s.planName || "Plan")}
                          className="w-10 h-10 rounded-lg object-cover"
                        /> */}
                        <div>
                          <div className="font-semibold text-slate-900">{s.planName.charAt(0).toUpperCase() + s.planName.slice(1) || "—"}</div>
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
        )}
      </main>
    </div>
  );
}