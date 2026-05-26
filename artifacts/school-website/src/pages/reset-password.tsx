import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2, KeyRound } from "lucide-react";

const NAVY = "#1a237e";
const GREEN = "#16a34a";

export default function ResetPassword() {
  const [location] = useLocation();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) setError("No reset token found. Please request a new password reset link.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await fetch("/api/student/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Reset failed.");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6 text-center" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0e7490 100%)` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/logo.jpeg" alt="Logo" className="w-7 h-7 rounded-full border border-white/30 object-contain bg-white p-0.5" />
            <span className="text-white text-sm font-semibold">Triple Tee Montessori Academy</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Reset Password</h1>
          <p className="text-blue-200 text-sm mt-1">Student Portal</p>
        </div>

        <div className="p-8">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#d1fae5" }}>
                <CheckCircle className="w-8 h-8" style={{ color: GREEN }} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Password Updated!</h2>
              <p className="text-gray-500 text-sm mb-6">Your password has been reset successfully. You can now log in with your new password.</p>
              <Link href="/student-portal"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: NAVY }}>
                Go to Student Portal
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6">Choose a new password for your student portal account.</p>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      disabled={!token}
                      className="w-full px-4 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat new password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      required
                      disabled={!token}
                      className="w-full px-4 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirm && password && confirm !== password && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                  {confirm && password && confirm === password && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>
                  )}
                </div>

                <button type="submit" disabled={loading || !token}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: NAVY }}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : "Set New Password"}
                </button>
              </form>

              <div className="mt-5 text-center text-sm text-gray-400">
                Remember your password?{" "}
                <Link href="/student-portal" className="font-semibold hover:underline" style={{ color: NAVY }}>
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
