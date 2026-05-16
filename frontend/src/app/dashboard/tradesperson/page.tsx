"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStatusBadge } from "@/utils/ui-helpers";

/**
 * Interface Definitions
 */
interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location?: string;
  contactName?: string;
  createdAt: string;
}

interface Application {
  _id: string;
  jobId: Job | null;
  status: string;
  message: string;
  createdAt: string;
}

/**
 * Tradesperson Dashboard - Warm Service Edition
 */
export default function TradespersonDashboard() {
  const router = useRouter();
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const headers = { "Authorization": `Bearer ${token}` };

      const [jobsRes, appsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/assigned-to-me`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tradesperson/my-applications`, { headers })
      ]);

      if (jobsRes.ok && appsRes.ok) {
        setAssignedJobs(await jobsRes.json());
        setApplications(await appsRes.json());
      } else {
        setError("Unable to load your dashboard. Please try again.");
      }
    } catch {
      setError("Connection failed. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = assignedJobs.filter(job => job.status !== 'Closed');
  const completedJobs = assignedJobs.filter(job => job.status === 'Closed');
  const pendingApps = applications.filter(app => app.status === 'pending');

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin"></div>
        <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest">Warming up...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-stone-900 tracking-tightest mb-2">My Service Board</h1>
        <p className="text-stone-600 font-medium">Keep track of your projects and application status.</p>
      </div>

      {error && (
        <div className="mb-10 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl text-sm text-red-900 font-bold">
          {error}
        </div>
      )}

      <div className="space-y-16">
        {/* Active Projects */}
        <section>
          <div className="flex items-center mb-8 gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-stone-900">Current Assignments</h2>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{activeJobs.length} active projects</span>
            </div>
          </div>
          
          {activeJobs.length === 0 ? (
            <div className="bg-orange-50/50 p-16 text-center rounded-3xl border border-orange-100">
              <p className="text-stone-500 font-bold mb-8 italic">No ongoing assignments found.</p>
              <Link href="/" className="btn-orange px-8 py-3 rounded-full text-sm inline-flex items-center gap-2">
                Browse Jobs
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {activeJobs.map(job => (
                <div key={job._id} className="premium-card p-8 flex flex-col h-full group hover:border-orange-300">
                  <div className="flex justify-between items-start mb-8">
                    {getStatusBadge(job.status)}
                    <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900 mb-3 group-hover:text-orange-600 transition-colors">{job.title}</h3>
                  <p className="text-stone-500 text-sm mb-10 flex-grow line-clamp-3 font-medium leading-relaxed">{job.description}</p>
                  <div className="pt-6 border-t border-amber-50 mt-auto">
                    <Link href={`/jobs/${job._id}`} className="text-orange-600 font-black text-xs uppercase tracking-[0.2em] hover:text-orange-800 flex items-center group/btn">
                      Project Management
                      <svg className="w-4 h-4 ml-3 transform group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Applications History */}
        <section>
          <div className="flex items-center mb-8 gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-stone-900">Application History</h2>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{pendingApps.length} pending responses</span>
            </div>
          </div>
          
          {applications.length === 0 ? (
            <div className="bg-stone-50 p-12 text-center rounded-3xl border border-stone-200">
              <p className="text-stone-500 font-bold italic">No applications submitted yet.</p>
            </div>
          ) : (
            <div className="premium-card overflow-hidden">
              <ul className="divide-y divide-amber-50">
                {applications.slice(0, 10).map(app => (
                  <li key={app._id} className="p-8 hover:bg-orange-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 shrink-0">
                         <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-stone-900 mb-1">{app.jobId ? app.jobId.title : 'Project Terminated'}</h3>
                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      {getStatusBadge(app.status)}
                      {app.jobId && (
                        <Link href={`/jobs/${app.jobId._id}`} className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Finished Jobs */}
        {completedJobs.length > 0 && (
          <section>
            <div className="flex items-center mb-8 gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-black text-stone-900">Completed Projects</h2>
            </div>
            
            <div className="premium-card overflow-hidden opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <ul className="divide-y divide-amber-50">
                {completedJobs.map(job => (
                  <li key={job._id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center text-stone-300">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-stone-500 line-through decoration-stone-300 mb-1">{job.title}</h3>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Finished {new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {getStatusBadge(job.status)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
