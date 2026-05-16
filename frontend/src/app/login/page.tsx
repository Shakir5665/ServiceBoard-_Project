"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Warm Service Login Page
 */
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
        setError(data.message || "Invalid email or password.");
      }
    } catch {
      setError("Connection error: Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-[#FFFBEB]">
      <div className="max-w-md w-full">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-orange-100">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tightest mb-2">Welcome Back</h1>
          <p className="text-stone-500 font-medium">Sign in to your ServiceBoard account</p>
        </div>

        <div className="premium-card p-8 sm:p-12">
          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl text-sm text-red-700 font-bold">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
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

            <button
              type="submit"
              disabled={loading}
              className={`btn-orange w-full py-4 rounded-xl text-base ${loading ? 'opacity-50' : 'active:scale-[0.98]'}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-stone-500">
            New to ServiceBoard? <Link href="/register" className="text-orange-600 font-bold hover:underline">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
