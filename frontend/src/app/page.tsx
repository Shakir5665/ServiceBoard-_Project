"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStatusBadge } from "@/utils/ui-helpers";

/**
 * Job Interface Definition
 */
interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  assignedTo?: { _id: string, name: string } | null;
  createdAt: string;
}

/**
 * Warm Service Landing Page
 * Features a welcoming hero section and a clean job discovery grid.
 */
export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUserRole(JSON.parse(userStr).role);
      } catch { }
    }
  }, []);

  useEffect(() => {
    fetchJobs(category, search, showOnlyOpen);
  }, [category, search, showOnlyOpen]);

  /**
   * Fetches job listings with warm service filtering
   */
  const fetchJobs = async (cat: string, q: string, openOnly: boolean) => {
    setLoading(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
      if (cat) url.searchParams.append("category", cat);
      if (q) url.searchParams.append("search", q);
      if (openOnly) url.searchParams.append("status", "Open");

      const res = await fetch(url.toString());
      if (res.ok) {
        setJobs(await res.json());
      }
    } catch (error) {
      console.error("Discovery error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Warm Category Badge Styles
   */
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'Plumbing': return 'bg-blue-50 text-blue-700 ring-blue-100';
      case 'Electrical': return 'bg-amber-50 text-amber-700 ring-amber-100';
      case 'Painting': return 'bg-pink-50 text-pink-700 ring-pink-100';
      case 'Joinery': return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
      default: return 'bg-stone-50 text-stone-700 ring-stone-100';
    }
  };

  return (
    <div className="w-full pb-20 bg-[#FFFBEB]">
      {/* Friendly Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight mb-6">
            <span className="text-orange-600">Good work</span> meets the right people.
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 mb-10 max-w-2xl mx-auto font-medium">
            ServiceBoard connects homeowners and skilled tradespeople simply and reliably.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white p-3 rounded-2xl flex flex-col sm:flex-row gap-2 border border-amber-100 shadow-xl shadow-amber-900/5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-orange-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What do you need help with?"
                className="w-full border-none bg-orange-50/30 py-4 !pl-16 pr-4 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all font-medium text-stone-900 placeholder:text-stone-400"
              />
            </div>

            <div className="relative sm:w-64">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none w-full border-none bg-orange-50/30 py-4 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer font-bold text-stone-700 text-sm"
              >
                <option value="">All Services</option>
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

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6">
            <label className="flex items-center cursor-pointer text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors">
              <input
                type="checkbox"
                checked={showOnlyOpen}
                onChange={(e) => setShowOnlyOpen(e.target.checked)}
                className="w-5 h-5 rounded border-orange-200 text-orange-600 focus:ring-orange-500 mr-2"
              />
              Show Only Open Jobs
            </label>

            {userRole === 'homeowner' && (
              <Link href="/new" className="btn-orange px-8 py-3 rounded-full text-sm shadow-md shadow-orange-100">
                Post Your Request
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Discovery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-stone-900">Recent Requests</h2>
            <p className="text-stone-500 font-medium">{jobs.length} jobs currently available</p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-orange-50/50 p-20 text-center rounded-3xl border border-orange-100">
            <h3 className="text-2xl font-black text-stone-800 mb-2">No jobs found</h3>
            <p className="text-stone-500 font-medium mb-8">Try adjusting your search or filters.</p>
            {userRole === 'homeowner' && (
              <Link href="/new" className="btn-orange px-10 py-3 rounded-full text-sm">
                Create a Request
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link href={`/jobs/${job._id}`} key={job._id} className="group h-full">
                <div className="premium-card p-8 flex flex-col h-full hover:border-orange-300">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset ${getCategoryStyles(job.category)}`}>
                      {job.category}
                    </span>
                    {getStatusBadge(job.status)}
                  </div>

                  <h3 className="text-xl font-black mb-3 text-stone-900 group-hover:text-orange-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-stone-500 mb-8 line-clamp-3 flex-grow text-[15px] font-medium leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-amber-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-wide">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <span className="text-orange-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Details <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
