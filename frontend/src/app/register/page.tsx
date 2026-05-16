"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Warm Service Registration Page
 */
export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "homeowner",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        window.location.href = "/";
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error: Unable to connect to ServiceBoard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-[#FFFBEB]">
      <div className="max-w-lg w-full">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-orange-100">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tightest mb-2">Join ServiceBoard</h1>
          <p className="text-stone-500 font-medium">Create your account to get started</p>
        </div>

        <div className="premium-card p-8 sm:p-12">
          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl text-sm text-red-700 font-bold">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-stone-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Mohamed Shakir"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Account Type</label>
                <div className="relative">
                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full appearance-none"
                  >
                    <option value="homeowner">Homeowner</option>
                    <option value="tradesperson">Tradesperson</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-orange-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-orange w-full py-4 rounded-xl text-base ${loading ? 'opacity-50' : 'active:scale-[0.98]'}`}
            >
              {loading ? 'Creating Account...' : 'Register Now'}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-stone-500">
            Already have an account? <Link href="/login" className="text-orange-600 font-bold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
