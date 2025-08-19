import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import AdminSidebar from './component/AdminSidebar';
import Swal from 'sweetalert2';

interface Pricing {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
  pricingId: string;
}

interface Plan {
  planId: string;
  name: string;
  pricing: Pricing[];
  status: string;
}

interface ApiResponse {
  total: number;
  page: number;
  pages: number;
  limit: number;
  plans: Plan[];
}

const PlanList: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [pages, setPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse>('/plan/all', { page, limit, search });
      setPlans(res.data.plans);
      setPages(res.data.pages);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching plans:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [page, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleEdit = (planId: string) => {
    navigate(`/admin/edit-plan/${planId}`);
  };

 const handleDelete = async (planId: string) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This will permanently delete the plan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await axios.post('/plan/deletePlan', { planId });
      setPlans((prev) => prev.filter((p) => p.planId !== planId));
      Swal.fire('Deleted!', 'The plan has been deleted.', 'success');
    } catch (err: any) {
      console.error('Error deleting plan:', err);
      Swal.fire('Error', err.response?.data?.error || err.message || 'Failed to delete plan', 'error');
    }
  }
};

  if (!plans.length && loading) {
    return (
      <div className="flex min-h-screen bg-blue-100">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center">
          <span className="text-lg font-medium">Loading plans…</span>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-blue-100">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center text-red-600">
          {error}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-100">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-blue-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Plans</h1>
          <input
            type="text"
            placeholder="Search plans..."
            value={search}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded px-3 py-1 w-64"
          />
        </div>

        {loading && plans.length > 0 && (
          <div className="text-center py-2 text-gray-600">Updating results…</div>
        )}

        {plans.map((plan) => (
          <section key={plan.planId} className="mb-12 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold capitalize">{plan.name}</h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(plan.planId)}
                  className="px-4 py-1 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.planId)}
                  className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.pricing.map((tier) => (
                <div
                  key={tier.pricingId}
                  className={`relative flex flex-col bg-white rounded-2xl shadow-lg p-6 ${
                    tier.isPopular ? 'border-4 border-indigo-500' : ''
                  }`}
                >
                  {tier.isPopular && (
                    <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-semibold uppercase px-3 py-1 rounded-bl-lg">
                      Popular
                    </span>
                  )}

                  <h3 className="text-xl font-medium mb-2">{tier.name}</h3>
                  <p className="text-gray-500 mb-4">{tier.description}</p>
                  <p className="text-4xl font-bold mb-4">{tier.price}</p>

                  <ul className="mb-6 space-y-2">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {page} of {pages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
            disabled={page === pages}
            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default PlanList;
