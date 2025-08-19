// src/admin/edit-plan.tsx
import { useEffect, useState, ChangeEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import axios from '../api/axios';
import AdminSidebar from './component/AdminSidebar';

interface Pricing {
  pricingId: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
}

interface Plan {
  planId: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Pending';
  pricing: Pricing[];
}

export default function EditPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plan details
  useEffect(() => {
    (async () => {
      if (!planId) {
        setError('Missing plan ID');
        setLoading(false);
        return;
      }
      try {
        // ⚠️ remove .data.data → just .data
        const res = await axios.post<Plan>('/plan/getByPlanId', { planId });
        setPlan(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || err.message || 'Failed to load plan');
      } finally {
        setLoading(false);
      }
    })();
  }, [planId]);

  // Top‐level plan field handlers
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (plan) setPlan({ ...plan, name: e.target.value });
  };
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (plan) setPlan({ ...plan, status: e.target.value as Plan['status'] });
  };

  // Pricing‐tier field handlers
  const handlePricingChange = (
    idx: number,
    field: keyof Omit<Pricing, 'pricingId'>,
    value: string | boolean
  ) => {
    if (!plan) return;
    const newPricing = [...plan.pricing];
    if (field === 'features' && typeof value === 'string') {
      newPricing[idx].features = value
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
    } else {
      // @ts-ignore
      newPricing[idx][field] = value;
    }
    setPlan({ ...plan, pricing: newPricing });
  };

  // Delete one pricing tier
  const handleDeletePricing = async (pricingId: string) => {
    const confirmed = await Swal.fire({
      title: 'Delete this pricing tier?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
    if (!confirmed.isConfirmed) return;

    try {
      // ⚠️ remove .data.data → just .data
      const res = await axios.post<Plan>('/plan/deletePricing', { pricingId });
      setPlan(res.data);
      Swal.fire('Deleted!', 'Pricing tier removed.', 'success');
    } catch (err: any) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || err.message || 'Delete failed', 'error');
    }
  };

  // Add a blank new tier
  const handleAddTier = () => {
    if (!plan) return;
    const newTier: Pricing = {
      pricingId: uuidv4(),
      name: '',
      price: '',
      description: '',
      features: [],
      isPopular: false,
    };
    setPlan({ ...plan, pricing: [...plan.pricing, newTier] });
  };

  // Save all changes
  const handleSave = async () => {
    if (!plan) return;
    try {
      await axios.post('/plan/update', plan);
      await Swal.fire('Saved!', 'Plan updated successfully.', 'success');
      navigate('/admin/plan');
    } catch (err: any) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || err.message || 'Save failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-blue-100">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center">Loading plan…</main>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex min-h-screen bg-blue-100">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center text-red-600">
          {error || 'Plan not found'}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-100">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-blue-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Plan: {plan.name}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="h-10 flex items-center gap-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <Pencil className="w-4 h-4" />
              Save Changes
            </button>
            <Link to="/admin/plan">
              <button
                type="button"
                disabled={loading}
                className="h-10 px-6 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </Link>
          </div>
        </div>

        {/* Plan Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={plan.name}
                onChange={handleNameChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={plan.status}
                onChange={handleStatusChange}
                className="w-full border rounded px-3 py-2"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="space-y-6 mb-6">
          {plan.pricing.map((tier, idx) => (
            <div key={tier.pricingId} className="relative bg-white rounded-lg shadow p-6">
              <button
                onClick={() => handleDeletePricing(tier.pricingId)}
                className="absolute top-4 right-4 flex items-center gap-1 text-red-600 hover:text-red-800"
              >
                <Trash className="w-4 h-4" /> Delete Tier
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tier Name</label>
                  <input
                    type="text"
                    value={tier.name}
                    onChange={e => handlePricingChange(idx, 'name', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="text"
                    value={tier.price}
                    onChange={e => handlePricingChange(idx, 'price', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tier.isPopular}
                    onChange={e => handlePricingChange(idx, 'isPopular', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Popular</span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={tier.description}
                  onChange={e => handlePricingChange(idx, 'description', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Features (one per line)
                </label>
                <textarea
                  rows={4}
                  value={tier.features.join('\n')}
                  onChange={e => handlePricingChange(idx, 'features', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Pricing Tier */}
        <button
          onClick={handleAddTier}
          className="flex items-center gap-2 mb-8 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Tier
        </button>
      </main>
    </div>
  );
}
