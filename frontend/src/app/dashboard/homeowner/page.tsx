"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStatusBadge } from "@/utils/ui-helpers";

/**
 * Interface for job objects from the perspective of a homeowner
 */
interface MyJob {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  applicantCount: number;
}

/**
 * Homeowner Dashboard - Warm Service Edition
 */
export default function HomeownerDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<MyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/my-jobs`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setJobs(await res.json());
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to load your projects.");
      }
    } catch {
      setError("Connection error: Unable to reach ServiceBoard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin"></div>
        <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header with Call to Action */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tightest mb-2">My Requests</h1>
          <p className="text-stone-600 font-medium">Manage your active service requests and review applicants.</p>
        </div>
        <Link 
          href="/new" 
          className="btn-orange px-8 py-3.5 rounded-2xl text-sm shadow-md shadow-orange-100 flex items-center gap-2.5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Post New Request
        </Link>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl text-sm text-red-900 font-bold shadow-sm">
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-orange-50/50 p-24 text-center rounded-[2.5rem] border border-orange-100">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-orange-400 shadow-sm">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-stone-800 mb-2">No Requests Yet</h3>
          <p className="text-stone-500 font-medium max-w-sm mx-auto">
            You haven't posted any service requests yet. Let's get started with your first project!
          </p>
        </div>
      ) : (
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-orange-50/50 border-b border-amber-100 text-stone-500 uppercase tracking-widest font-black text-[10px]">
                <tr>
                  <th scope="col" className="px-8 py-5">Job Details</th>
                  <th scope="col" className="px-8 py-5">Status</th>
                  <th scope="col" className="px-8 py-5">Applicants</th>
                  <th scope="col" className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-stone-900 text-base group-hover:text-orange-600 transition-colors">{job.title}</span>
                        <span className="text-stone-500 mt-1 font-bold text-xs uppercase tracking-wide">{job.category} • {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-100">
                          {job.applicantCount}
                        </span>
                        <span className="text-stone-500 font-bold uppercase text-[10px] tracking-widest">Pending</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-6">
                        <Link 
                          href={`/jobs/${job._id}`}
                          className="text-emerald-600 hover:text-emerald-800 font-black uppercase text-[10px] tracking-widest transition-colors"
                        >
                          Details
                        </Link>
                        <Link 
                          href={`/jobs/${job._id}/applicants`}
                          className="text-orange-600 hover:text-orange-800 font-black uppercase text-[10px] tracking-widest transition-colors"
                        >
                          Review Applicants
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
