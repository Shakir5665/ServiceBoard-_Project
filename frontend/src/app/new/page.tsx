"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Warm Service Job Creation Page
 * Features a friendly phased layout for posting service requests.
 */
export default function NewJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Plumbing",
    location: "",
    contactName: "",
    contactEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to post your request.");
      }
    } catch {
      setError("Connection error: Unable to broadcast request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#FFFBEB]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-stone-400 hover:text-orange-600 transition-colors mb-8 group">
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Jobs
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tightest mb-4">Post a Request</h1>
          <p className="text-lg text-stone-600 font-medium">Tell us what you need, and we'll find the right professional for you.</p>
        </div>

        <div className="premium-card overflow-hidden">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 m-8 rounded-r-2xl text-sm text-red-700 font-bold">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-12">
            {/* Section 1: Job Details */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                Step 1: Job Details
              </h3>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="block text-sm font-bold text-stone-700 mb-2">Job Title <span className="text-orange-600">*</span></label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="eg: Fix a leaking kitchen tap"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-stone-700 mb-2">Service Category <span className="text-orange-600">*</span></label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full appearance-none pr-10 font-bold text-stone-700 text-sm"
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Painting">Painting</option>
                      <option value="Joinery">Joinery</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-bold text-stone-700 mb-2">Description <span className="text-orange-600">*</span></label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full resize-none leading-relaxed"
                    placeholder="Describe the issue in detail so professionals can understand the task..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                Part 2: Contact Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-bold text-stone-700 mb-2">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="eg: Colombo 7"
                  />
                </div>
                <div>
                  <label htmlFor="contactName" className="block text-sm font-bold text-stone-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Amrish"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contactEmail" className="block text-sm font-bold text-stone-700 mb-2">Contact Email <span className="text-orange-600">*</span></label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="you@example.com"
                  />
                  <p className="mt-3 text-xs text-stone-400 font-medium">We'll use this to notify you about applicants.</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className={`btn-orange w-full py-4 rounded-xl text-base shadow-lg shadow-orange-100 ${loading ? 'opacity-50' : 'active:scale-[0.98]'}`}
              >
                {loading ? 'Posting Request...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
