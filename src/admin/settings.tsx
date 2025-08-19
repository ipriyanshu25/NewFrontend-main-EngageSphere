// src/pages/AdminSettingsPage.tsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { post } from "../api/axios";

// ⬇️ Sidebar — same component used on dashboard
import AdminSidebar from "./component/AdminSidebar";

// -------------------------------------------------------------
// …types & utils unchanged
// -------------------------------------------------------------
interface JWTPayload {
  adminId: string;
  email: string;
  iat: number;
  exp: number;
}
interface UpdateEmailVerifyResp { token?: string; }

const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
function readStoredToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("engagesphere_token") ||
         localStorage.getItem("adminToken") ||
         "";
}
function writeStoredToken(token: string) {
  localStorage.setItem("engagesphere_token", token);
  localStorage.setItem("adminToken", token); // keep legacy key in-sync
}

// -------------------------------------------------------------
// Component
// -------------------------------------------------------------
export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState(readStoredToken);
  const [adminId, setAdminId] = useState("");

  const decodeToken = useCallback((tok: string) => {
    if (!tok) return "";
    try {
      const decoded = jwtDecode<JWTPayload>(tok);
      return decoded.adminId || "";
    } catch { return ""; }
  }, []);

  useEffect(() => { setAdminId(decodeToken(token)); }, [token, decodeToken]);
  // useEffect(() => {
  //   if (!adminId) navigate("/admin/login", { replace: true });
  // }, [adminId, navigate]);

  // ------------- state -------------
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState<"input" | "verify">("input");
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  // ------------- handlers -------------  (identical logic, trimmed for brevity)
  const handleEmailRequest = async () => {
    if (!validateEmail(newEmail))
      return Swal.fire("Warning", "Enter a valid email.", "warning");
    if (!adminId)
      return Swal.fire("Error", "Session expired, login again.", "error");

    setLoadingEmail(true);
    try {
      await post("/admin/update-email/request", { adminId, newEmail });
      Swal.fire("OTP Sent", "Check your current email.", "info");
      setEmailStep("verify");
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    } finally { setLoadingEmail(false); }
  };

  const handleEmailVerify = async () => {
    if (!emailOtp) return Swal.fire("Warning", "Enter the OTP.", "warning");
    if (!adminId) return Swal.fire("Error", "Session expired.", "error");

    setLoadingEmail(true);
    try {
      const data = await post<UpdateEmailVerifyResp>("/admin/update-email/verify", {
        adminId, otp: emailOtp,
      });
      if (data?.token) { writeStoredToken(data.token); setToken(data.token); }
      Swal.fire("Success", "Email updated!", "success");
      setNewEmail(""); setEmailOtp(""); setEmailStep("input"); navigate(0);
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    } finally { setLoadingEmail(false); }
  };

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword)
      return Swal.fire("Warning", "Fill all password fields.", "warning");
    if (newPassword !== confirmPassword)
      return Swal.fire("Error", "Passwords do not match.", "error");
    if (!adminId) return Swal.fire("Error", "Session expired.", "error");

    setLoadingPassword(true);
    try {
      await post("/admin/update-password", { adminId, oldPassword, newPassword });
      Swal.fire("Success", "Password changed!", "success");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    } finally { setLoadingPassword(false); }
  };

  // -----------------------------------------------------------
  // Render
  // -----------------------------------------------------------
  return (
    <div className="flex min-h-screen bg-blue-100">
      <AdminSidebar />

      {/* PAGE BODY */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Admin Settings
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your account &amp; security preferences
          </p>
        </header>

        {/* Two-column card grid */}
        <section className="grid gap-8 md:grid-cols-2">
          {/* ────── EMAIL CARD ────── */}
          <div className="group shadow-lg border border-blue-200 rounded-2xl bg-white flex flex-col hover:shadow-xl transition">
            <div className="border-b px-6 py-4 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Update Email
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Change your login email address
              </p>
            </div>

            <div className="p-6 space-y-4">
              {emailStep === "input" ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="new-email" className="block text-sm font-medium text-gray-700">
                      New Email
                    </label>
                    <input
                      id="new-email"
                      type="email"
                      placeholder="you@example.com"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      disabled={loadingEmail}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleEmailRequest}
                    disabled={loadingEmail}
                    aria-busy={loadingEmail}
                    className="w-full py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                  >
                    {loadingEmail ? "Sending OTP…" : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="email-otp" className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <input
                      id="email-otp"
                      type="text"
                      placeholder="One-time code"
                      value={emailOtp}
                      onChange={e => setEmailOtp(e.target.value)}
                      disabled={loadingEmail}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleEmailVerify}
                    disabled={loadingEmail}
                    aria-busy={loadingEmail}
                    className="w-full py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                  >
                    {loadingEmail ? "Verifying…" : "Verify & Update"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ────── PASSWORD CARD ────── */}
          <div className="group shadow-lg border border-blue-200 rounded-2xl bg-white flex flex-col hover:shadow-xl transition">
            <div className="border-b px-6 py-4 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Update Password</h2>
              <p className="text-sm text-gray-500 mt-1">
                Secure your account by changing your password
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Current */}
              <div className="space-y-2">
                <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  id="old-password"
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  disabled={loadingPassword}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                />
              </div>

              {/* New */}
              <div className="space-y-2">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={loadingPassword}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                />
              </div>

              {/* Confirm */}
              {newPassword && (
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={loadingPassword}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handlePasswordUpdate}
                disabled={loadingPassword}
                aria-busy={loadingPassword}
                className="w-full py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60"
              >
                {loadingPassword ? "Updating…" : "Update Password"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
