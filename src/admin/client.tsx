import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios"; // <- update to your actual axios instance path
import AdminSidebar from "./component/AdminSidebar"; // match AdminServicesPage path

// ------------------------------------------------------------------
// Types matching backend (/user/getAll)
// ------------------------------------------------------------------
interface User {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string; // ISO string
  isAdmin?: boolean; // returned when selected fields include it
}

interface ApiResponseMeta {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

interface ApiResponse {
  data: User[];
  meta: ApiResponseMeta;
}


// ------------------------------------------------------------------
// Fetch helper
// ------------------------------------------------------------------
async function fetchUsers({ page, limit, search }: { page: number; limit: number; search: string }): Promise<ApiResponse> {
  const payload = { page, limit, search };
  const { data } = await api.post<ApiResponse>("/user/getAll", payload);
  return data;
}


export default function AdminClientsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state (kept in query string so refresh/share preserves view)
  const initialPage = Number(searchParams.get("page") ?? 1);
  const initialSearch = searchParams.get("q") ?? "";

  const [page, setPage] = useState<number>(initialPage);
  const [limit] = useState<number>(10); // adjust / make user-selectable
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<ApiResponseMeta | null>(null);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);

  // ----------------------------------------------------------------
  // Auth gate: token + isAdmin in localStorage
  // ----------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");
    if (!token || isAdmin !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  // ----------------------------------------------------------------
  // Sync state -> URL
  // ----------------------------------------------------------------
  useEffect(() => {
    const qp: Record<string, string> = {};
    if (page > 1) qp.page = String(page);
    if (searchQuery.trim()) qp.q = searchQuery.trim();
    setSearchParams(qp, { replace: true });
  }, [page, searchQuery, setSearchParams]);

  // ----------------------------------------------------------------
  // Data fetch
  // ----------------------------------------------------------------
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetchUsers({ page, limit, search: searchQuery.trim() });
      setUsers(resp.data);
      setMeta(resp.meta);
    } catch (err) {
      console.error("Failed to load users", err);
      Swal.fire("Error", "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    void load();
  }, [load]);

  // ----------------------------------------------------------------
  // Date render helper
  // ----------------------------------------------------------------
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // ----------------------------------------------------------------
  // Pagination handlers
  // ----------------------------------------------------------------
  const canPrev = page > 1;
  const canNext = meta ? page < meta.lastPage : false;
  const goPrev = () => canPrev && setPage((p) => p - 1);
  const goNext = () => canNext && setPage((p) => p + 1);

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen bg-blue-100">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center">Loading users...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 p-8 bg-blue-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
          <button
            onClick={() => setSearchVisible((v) => !v)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none"
            aria-label={searchVisible ? "Close search" : "Open search"}
          >
            {searchVisible ? (
              // simple X icon fallback
              <span className="block w-5 h-5 leading-5 text-center">×</span>
            ) : (
              // simple magnifier fallback
              <span className="block w-5 h-5 leading-5 text-center">🔍</span>
            )}
          </button>
        </div>

        {/* Search box */}
        {searchVisible && (
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setPage(1); // reset pagination when searching
                setSearchQuery(e.target.value);
              }}
              placeholder="Search by name or email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* Table */}
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-blue-600 text-white rounded-t-lg">
                <tr>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Phone</th>
                  <th className="py-3 px-6 text-left">Joined</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userId} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">{u.name}</td>
                    <td className="py-4 px-6">{u.email}</td>
                    <td className="py-4 px-6">{u.phone || "N/A"}</td>
                    <td className="py-4 px-6">{formatDate(u.createdAt)}</td>

                    <td className="py-4 px-6">
                      <Link
                        to={`/admin/user-services/${u.userId}`}
                        className="inline-block px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={goPrev}
              disabled={!canPrev}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {meta.page} of {meta.lastPage} ({meta.total} total)
            </span>
            <button
              onClick={goNext}
              disabled={!canNext}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
