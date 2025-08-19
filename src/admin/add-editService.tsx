// src/admin/add-editService.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { post } from '../api/axios';
import AdminSidebar from './component/AdminSidebar';

interface ContentItem { contentId?: string; key: string; }
interface Service {
  serviceId: string;
  serviceHeading: string;
  serviceDescription: string;
  serviceContent: ContentItem[];
  logo?: string;
}

export default function AddEditServicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId') || undefined;
  const isEdit = Boolean(serviceId);

  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [contents, setContents] = useState<ContentItem[]>([{ key: '' }]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load an existing service when editing
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);

    post<Service>('/services/getById', { serviceId })
      .then(svc => {
        setHeading(svc.serviceHeading);
        setDescription(svc.serviceDescription);
        setContents(
          svc.serviceContent.length
            ? svc.serviceContent
            : [{ key: '' }]
        );
        if (svc.logo) {
          setLogoPreview(svc.logo);
        }
      })
      .catch(err => {
        Swal.fire('Error', err.response?.data?.error || err.message, 'error');
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [isEdit, serviceId, navigate]);

  const handleAddRow = () => {
    setContents(prev => [...prev, { key: '' }]);
  };

  const handleRemoveRow = async (idx: number) => {
    const item = contents[idx];
    if (!isEdit || !item.contentId) {
      setContents(prev => prev.filter((_, i) => i !== idx));
      return;
    }

    const result = await Swal.fire({
      title: 'Delete this item?',
      text: 'This change is permanent.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    post('/services/deleteContent', {
      serviceId,
      contentId: item.contentId
    })
      .then(() => {
        Swal.fire('Deleted!', 'Item removed.', 'success');
        setContents(prev => prev.filter((_, i) => i !== idx));
      })
      .catch(err => {
        Swal.fire('Error', err.response?.data?.error || err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading.trim() || !description.trim()) {
      return Swal.fire('Error', 'Heading and description are required.', 'error');
    }
    const validContents = contents.filter(c => c.key.trim());
    if (!validContents.length) {
      return Swal.fire('Error', 'At least one content item is required.', 'error');
    }

    setLoading(true);
    try {
      // Edit without new logo → JSON
      if (isEdit && !logoFile) {
        await post('/services/update', {
          serviceId,
          serviceHeading: heading.trim(),
          serviceDescription: description.trim(),
          serviceContent: JSON.stringify(validContents)
        });
      } else {
        // Create or edit with logo → multipart
        const formData = new FormData();
        formData.append('serviceHeading', heading.trim());
        formData.append('serviceDescription', description.trim());
        formData.append('serviceContent', JSON.stringify(validContents));
        if (logoFile) formData.append('logo', logoFile);
        if (isEdit && serviceId) formData.append('serviceId', serviceId);

        await post(
          isEdit ? '/services/update' : '/services/create',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      Swal.fire('Success', isEdit ? 'Service updated.' : 'Service created.', 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.error || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-100">
      <AdminSidebar />

      <main className="flex-1 flex items-start justify-center p-8">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-8 py-6 bg-blue-600 text-center mb-5">
            <h1 className="text-2xl font-bold text-white">
              {isEdit ? 'Edit Service' : 'Add New Service'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {/* Heading */}
            <div>
              <label htmlFor="heading" className="block text-sm font-medium text-gray-700">
                Service Heading
              </label>
              <input
                id="heading"
                type="text"
                value={heading}
                onChange={e => setHeading(e.target.value)}
                disabled={loading}
                placeholder="Enter service heading"
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={loading}
                placeholder="Enter a brief description"
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              {logoPreview && (
                <img src={logoPreview} alt="Logo Preview" className="h-24 mt-2 rounded-md" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  setLogoFile(file);
                  if (file) setLogoPreview(URL.createObjectURL(file));
                }}
                disabled={loading}
                className="mt-2"
              />
            </div>

            {/* Content items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Content Items
              </label>
              <div className="space-y-3">
                {contents.map((item, idx) => (
                  <div key={idx} className="flex space-x-2 items-center">
                    <input
                      type="text"
                      placeholder="Content key"
                      value={item.key}
                      onChange={e => {
                        const key = e.target.value;
                        setContents(prev =>
                          prev.map((it, i) => (i === idx ? { ...it, key } : it))
                        );
                      }}
                      disabled={loading}
                      className="flex-1 border rounded-md px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                disabled={loading}
                className="mt-4 px-5 py-2 bg-gray-100 rounded-md"
              >
                + Add Item
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Link to="/admin/dashboard">
                <button
                  type="button"
                  disabled={loading}
                  className="px-6 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md"
              >
                {isEdit ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
