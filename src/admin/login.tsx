// src/admin/AdminAuthPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { post } from '../api/axios';

const ADMIN_TITLE = 'EngageSphere Admin';

type JwtPayload = { adminId: string; email: string; exp: number };

enum Step {
  Login = 'login',
  Forgot = 'forgot',
  Reset = 'reset',
}

const AdminAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(Step.Login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAction = async () => {
    setSubmitting(true);
    try {
      let endpoint: string;
      const body: Record<string, string> = { email: email.trim() };

      if (step === Step.Login) {
        endpoint = 'login';
        body.password = password;
      } else if (step === Step.Forgot) {
        endpoint = 'forgot-password';
      } else {
        // Step.Reset
        endpoint = 'reset-password';
        body.otp = otp;
        body.newPassword = password;
      }

      const data = await post<{ token?: string; adminId?: string }>(
        `/admin/${endpoint}`,
        body
      );

      // success toast
      await Swal.fire({
        icon: 'success',
        title:
          step === Step.Login
            ? 'Logged In'
            : step === Step.Forgot
            ? 'OTP Sent'
            : 'Password Reset',
        text:
          step === Step.Forgot
            ? 'Check your email for the reset code.'
            : undefined,
        timer: 1500,
        showConfirmButton: false,
      });

      if (step === Step.Login && data.token && data.adminId) {
        // store token & navigate
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminId', data.adminId);
        const decoded = jwtDecode<JwtPayload>(data.token);
        console.log('Token expires at', new Date(decoded.exp * 1000));
        navigate('/admin/dashboard');
      } else if (step === Step.Forgot) {
        setStep(Step.Reset);
      } else {
        setStep(Step.Login);
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Operation failed',
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex bg-gradient-to-br from-blue-900 to-indigo-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Panel */}
      <motion.div
        className="hidden lg:flex w-1/2 items-center justify-center"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <div className="text-center px-12">
          <h1 className="text-5xl font-extrabold text-white mb-2">{ADMIN_TITLE}</h1>
        </div>
      </motion.div>

      {/* Form Panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 bg-gray-50">
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            handleAction();
          }}
          className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 text-center">
            {step === Step.Login
              ? 'Admin Login'
              : step === Step.Forgot
              ? 'Forgot Password'
              : 'Reset Password'}
          </h2>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Password or New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {step === Step.Reset ? 'New Password' : 'Password'}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* OTP for Reset */}
          {step === Step.Reset && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Action Button */}
          <motion.button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-blue-900 bg-yellow-400 rounded-full font-semibold hover:bg-yellow-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitting
              ? 'Processing…'
              : step === Step.Login
              ? 'Login'
              : step === Step.Forgot
              ? 'Send OTP'
              : 'Reset Password'}
          </motion.button>

          {/* Forgot link (login only) */}
          {step === Step.Login && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-indigo-600 hover:underline"
                onClick={() => setStep(Step.Forgot)}
              >
                Forgot Password?
              </button>
            </div>
          )}
        </motion.form>
      </div>
    </motion.div>
  );
};

export default AdminAuthPage;
