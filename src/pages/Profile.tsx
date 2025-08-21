import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { User, Mail, MapPin, Calendar, Edit, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

interface UserProfileProps {
  onViewServices: () => void;
}

type UserSafe = {
  userId: string;
  name: string;
  email: string;
  phone: string;
  country?: string;
  createdAt?: string;
};

type Subscriptions = {
  total: number;
  active: number;
  completed: number;
};

const UserProfile: React.FC<UserProfileProps> = ({ onViewServices }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSafe | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [subs, setSubs] = useState<Subscriptions>({ total: 0, active: 0, completed: 0 });

  const token = useMemo(() => localStorage.getItem('token') || '', []);
  const userId = useMemo(() => localStorage.getItem('userId') || '', []);

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setLoading(false);
        Swal.fire({ icon: 'error', title: 'Not logged in', text: 'Please log in first.' });
        return;
      }
      try {
        const { data } = await api.post(
          '/user/getById',
          { userId },
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );

        const u = data?.data;
        setUser({
          userId: u?.userId,
          name: u?.name || '',
          email: u?.email || '',
          phone: u?.phone || '',
          country: u?.country,
          createdAt: u?.createdAt,
        });

        // ✅ Subscriptions from API -> local state
        const apiSubs = data?.subscriptions || {};
        setSubs({
          total: Number(apiSubs.total ?? 0),
          active: Number(apiSubs.active ?? 0), // Status === 0
          completed: Number(apiSubs.completed ?? 0), // Status === 1
        });
      } catch (err: any) {
        console.error('Get profile error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load profile',
          text: err?.response?.data?.message || err?.message || 'Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, userId]);

  const openEdit = () => setIsEditing(true);
  const closeEdit = () => setIsEditing(false);

  const handleSave = async (form: {
    name: string;
    phone: string;
    oldPassword?: string;
    newPassword?: string;
  }) => {
    if (!userId) return;
    try {
      // 🚫 FIX: don't await the loading modal; otherwise the flow blocks and API never runs
      Swal.fire({
        title: 'Saving…',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await api.post(
        '/user/update',
        { userId, ...form },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      Swal.close();
      await Swal.fire({ icon: 'success', title: 'Profile updated' });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: form.name,
              phone: form.phone,
            }
          : prev
      );
      closeEdit();
    } catch (err: any) {
      Swal.close();
      console.error('Update profile error:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: err?.response?.data?.message || err?.message || 'Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-gray-700">Loading profile…</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleString() : '—';

  return (
    <div className="min-h-screen bg-sky-50 px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
      <div className="mx-auto max-w-6xl space-y-6 md:space-y-8 pt-16">
        {/* Page Header */}
        <header className="flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Your Profile</h1>
          <div className="h-[3px] w-28 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
        </header>

        {/* Summary / Primary Action */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <Mail size={16} className="text-indigo-600" />
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-600" />
                  Joined {joinDate}
                </span>
              </div>
            </div>
            <div className="flex w-full md:w-auto items-center">
              <button
                onClick={openEdit}
                className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-white shadow-sm transition hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Edit size={18} />
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Contact Information */}
          <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-indigo-600" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="rounded-lg border border-gray-200 p-4 hover:bg-indigo-50/40 transition">
                <div className="text-xs uppercase tracking-wide text-gray-500">Email</div>
                <div className="mt-1 text-gray-900">{user.email}</div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4 hover:bg-indigo-50/40 transition">
                <div className="text-xs uppercase tracking-wide text-gray-500">Phone</div>
                <div className="mt-1 text-gray-900">{user.phone || '—'}</div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4 hover:bg-indigo-50/40 transition">
                <div className="text-xs uppercase tracking-wide text-gray-500">Country</div>
                <div className="mt-1 flex items-center gap-2 text-gray-900">
                  <MapPin size={16} className="text-indigo-600" />
                  {user.country || '—'}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4 hover:bg-indigo-50/40 transition">
                <div className="text-xs uppercase tracking-wide text-gray-500">Member Since</div>
                <div className="mt-1 flex items-center gap-2 text-gray-900">
                  <Calendar size={16} className="text-indigo-600" />
                  {joinDate}
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar: Stats & Services */}
          <aside className="space-y-6">
            {/* Overview with real counts */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Overview</h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                  <div className="text-sm text-blue-700">Active Services</div>
                  <div className="mt-1 text-2xl font-semibold text-blue-900">{subs.active}</div>
                </div>
                <div className="rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100 p-4">
                  <div className="text-sm text-indigo-700">Completed Services</div>
                  <div className="mt-1 text-2xl font-semibold text-indigo-900">{subs.completed}</div>
                </div>
                <div className="rounded-lg border border-sky-200 bg-gradient-to-r from-sky-50 to-sky-100 p-4">
                  <div className="text-sm text-sky-700">Total Services</div>
                  <div className="mt-1 text-2xl font-semibold text-sky-900">{subs.total}</div>
                </div>
              </div>
            </section>

            {/* Services CTA */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
              <button
                onClick={onViewServices}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white shadow-sm transition hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Eye size={18} />
                View Services
              </button>
            </section>
          </aside>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && user && (
        <EditProfileModal
          initial={{ name: user.name, phone: user.phone }}
          onClose={closeEdit}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UserProfile;

/* ------------ Edit Profile Modal ------------- */
const EditProfileModal: React.FC<{
  initial: { name: string; phone: string };
  onClose: () => void;
  onSave: (form: { name: string; phone: string; oldPassword?: string; newPassword?: string }) => void;
}> = ({ initial, onClose, onSave }) => {
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      phone: phone.trim(),
      oldPassword: newPassword ? oldPassword : undefined,
      newPassword: newPassword || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* ✅ Always keep Old/New password on the same row */}
          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Old Password (required if changing)</label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">New Password (optional)</label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
