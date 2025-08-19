// src/pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { get, post } from '../api/axios';
import { Plus, Pencil, Trash } from 'lucide-react';
import AdminSidebar from './component/AdminSidebar';

interface ServiceContentItem { key: string; }
interface Service {
  serviceId: string;
  serviceHeading: string;
  serviceDescription: string;
  serviceContent: ServiceContentItem[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services list
  useEffect(() => {
    (async () => {
      try {
        const res = await get<{ data: Service[] }>(`/services/getAll?page=1&limit=100`);
        setServices(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (serviceId: string) => {
    const result = await Swal.fire({
      title: 'Delete this service?',
      text: 'All related plans will also be removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    try {
      await post('/services/delete', { serviceId });
      setServices(prev => prev.filter(s => s.serviceId !== serviceId));
      Swal.fire('Deleted!', 'Service removed.', 'success');
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.error || err.message || 'Delete failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-blue-100">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center">Loading services…</main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-blue-100">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center text-red-600">{error}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-100">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-blue-50">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Services</h1>
          <Link to="/admin/add-editService">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </Link>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-500">No services added yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(svc => (
              <div
                key={svc.serviceId}
                className="bg-white border rounded-lg hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">{svc.serviceHeading}</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {svc.serviceContent.length}
                  </span>
                </div>

                <p className="px-4 py-2 text-gray-600 line-clamp-2">{svc.serviceDescription}</p>

                <ul className="divide-y">
                  {svc.serviceContent.map(itm => (
                    <li key={itm.key} className="px-4 py-2 text-sm text-gray-700">
                      {itm.key}
                    </li>
                  ))}
                </ul>

                <div className="flex justify-end gap-2 px-4 py-3">
                  <Link to={`/admin/add-editService?serviceId=${svc.serviceId}`}>
                    <button className="flex items-center gap-1 border border-blue-600 text-blue-600 px-3 py-1 rounded">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(svc.serviceId)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
