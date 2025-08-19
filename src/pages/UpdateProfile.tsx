import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';                    // ⬅️ shared axios instance
import { User, Mail, Phone, MapPin, Calendar, Edit, Eye } from 'lucide-react';
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
  avatar?: string;
  bio?: string;
};

const UserProfile: React.FC<UserProfileProps> = ({ onViewServices }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserSafe | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const token = useMemo(() => localStorage.getItem('token') || '', []);
  const userId = useMemo(() => localStorage.getItem('userId') || '', []);

  // Fetch profile
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
          avatar:
            u?.avatar ||
            'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio:
            u?.bio ||
            'Welcome to your profile. You can update your name, phone, and password from here.',
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
      await Swal.fire({
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

      // Refresh user
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
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-gray-700">Loading profile…</div>
      </div>
    );
  }

  if (!user) return null;

  // derived fields
  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleString() : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="relative px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">{user.bio}</p>
              </div>
              <button
                onClick={openEdit}
                className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <Edit size={18} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <User className="text-blue-600" size={24} />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Mail className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Phone className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <MapPin className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-medium text-gray-900">{user.country || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Calendar className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Joined</p>
                  <p className="font-medium text-gray-900">{joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Actions (static placeholders) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Active Services</span>
                  <span className="text-2xl font-bold text-green-600">—</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Completed Services</span>
                  <span className="text-2xl font-bold text-blue-600">—</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Total Projects</span>
                  <span className="text-2xl font-bold text-purple-600">—</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Services</h2>
              <button
                onClick={onViewServices}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <Eye size={20} />
                View Services
              </button>
            </div>
          </div>
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

/* ------------ Edit Profile Modal (inline) ------------- */
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
      oldPassword: newPassword ? oldPassword : undefined, // backend requires oldPassword if newPassword present
      newPassword: newPassword || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Old Password (required if changing)</label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">New Password (optional)</label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
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
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
