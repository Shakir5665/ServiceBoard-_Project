"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStatusBadge } from "@/utils/ui-helpers";

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  status: string;
  createdBy: string;
  assignedTo: string | { _id: string; name: string; email: string } | null;
  createdAt: string;
  ratedByHomeowner: boolean;
  homeownerRating?: number | null;
}

/**
 * Warm Service Job Detail Page
 * Features a clean, inviting layout with orange accents and accessible information cards.
 */
export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentUser, setCurrentUser] = useState<{ id: string, role: string } | null>(null);

  const [applyMessage, setApplyMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [ratingError, setRatingError] = useState("");

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = JSON.parse(userStr);
        setCurrentUser({ id: payload.id, role: user.role });
      } catch {
        // ignore malformed token/user
      }
    }

    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
        if (data.homeownerRating) {
          setSelectedRating(data.homeownerRating);
        }

        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
          const userRole = JSON.parse(userStr).role;
          if (userRole === "tradesperson") {
            const appsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tradesperson/my-applications`, {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (appsRes.ok) {
              const apps = await appsRes.json();
              if (apps.some((app: { jobId: { _id: string } | null }) => app.jobId && app.jobId._id === id)) {
                setHasApplied(true);
              }
            }
          }
        }
      } else {
        router.push("/");
      }
    } catch {
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedJob = await res.json();
        setJob(updatedJob);
      }
    } catch {
      // status update failed silently
    } finally {
      setStatusUpdating(false);
    }
  };

  const confirmDelete = () => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Request?',
      message: 'Are you sure you want to remove this request? This action will permanently delete all associated data.',
      onConfirm: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        executeDelete();
      },
      onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        router.push("/");
      }
    } catch {
      setIsDeleting(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    setApplyError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: applyMessage }),
      });

      if (res.ok) {
        setApplySuccess(true);
        setHasApplied(true);
      } else {
        const data = await res.json();
        setApplyError(data.message || "Failed to submit application.");
      }
    } catch (error) {
      setApplyError("An error occurred. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRate = async (star: number) => {
    setSelectedRating(star);
    setIsRating(true);
    setRatingError("");
    setRatingSuccess(false);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating: star }),
      });
      if (res.ok) {
        const data = await res.json();
        setRatingSuccess(true);
        if (data.job) {
          setJob(data.job);
        } else {
          setJob(prev => prev ? { ...prev, ratedByHomeowner: true, homeownerRating: star } : prev);
        }
      } else {
        const data = await res.json();
        setRatingError(data.message || "Failed to submit rating.");
      }
    } catch {
      setRatingError("An error occurred. Please try again.");
    } finally {
      setIsRating(false);
    }
  };

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'Plumbing': return 'bg-blue-50 text-blue-700 ring-blue-100';
      case 'Electrical': return 'bg-amber-50 text-amber-700 ring-amber-100';
      case 'Painting': return 'bg-pink-50 text-pink-700 ring-pink-100';
      case 'Joinery': return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
      default: return 'bg-stone-50 text-stone-700 ring-stone-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin"></div>
        <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest">Loading Details...</p>
      </div>
    );
  }

  if (!job) return null;

  const assignedWorker = job.assignedTo && typeof job.assignedTo === 'object'
    ? (job.assignedTo as { _id: string; name: string; email: string })
    : null;

  const assignedId = assignedWorker ? assignedWorker._id : (job.assignedTo as string | null);

  const isCreator = currentUser?.role === 'homeowner' && currentUser.id === job.createdBy;
  const isAssigned = currentUser?.role === 'tradesperson' && currentUser.id === assignedId;
  const isUnassignedTradesperson = currentUser?.role === 'tradesperson' && currentUser.id !== assignedId;

  return (
    <div className="w-full bg-[#FFFBEB] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Modal Overlay */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-amber-100">
            <div className="p-10 text-center">
              <h3 className="text-2xl font-extrabold text-stone-900 mb-2">{modalConfig.title}</h3>
              <p className="text-stone-500 font-medium mb-8">{modalConfig.message}</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={modalConfig.onConfirm}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
                >
                  Yes, Delete Request
                </button>
                <button
                  onClick={modalConfig.onCancel}
                  className="w-full py-4 text-stone-500 font-bold hover:text-stone-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button onClick={() => router.back()} className="inline-flex items-center text-sm font-bold text-stone-400 hover:text-orange-600 transition-colors group">
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Jobs
          </button>

          {isCreator && (
            <Link href={`/jobs/${job._id}/applicants`} className="btn-secondary px-6 py-2.5 rounded-full text-xs flex items-center gap-2">
              View Applicants
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          )}
        </div>

        <div className="premium-card overflow-hidden">
          {/* Header Section */}
          <div className="p-8 sm:p-12 border-b border-amber-50 bg-orange-50/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset ${getCategoryStyles(job.category)}`}>
                  {job.category}
                </span>
                <span className="text-xs text-stone-400 font-bold uppercase tracking-widest flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tightest leading-tight">{job.title}</h1>
            </div>

            <div className="w-full sm:w-auto bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col gap-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Job Status</label>

              {isAssigned ? (
                <div className="relative">
                  <select
                    value={job.status}
                    onChange={handleStatusChange}
                    disabled={statusUpdating}
                    className="w-full min-w-[160px] appearance-none pr-12 pl-4 py-2.5 rounded-xl border-orange-200 bg-orange-50/50 text-sm font-bold text-orange-700 focus:ring-2 focus:ring-orange-500 cursor-pointer text-left"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-orange-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  {getStatusBadge(job.status)}
                </div>
              )}
            </div>
          </div>

          {/* Body Section */}
          <div className="p-8 sm:p-12">
            <div className="mb-12">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                Job Objectives
              </h3>
              <div className="bg-orange-50/30 p-8 rounded-3xl border border-orange-100/50">
                <p className="text-stone-700 whitespace-pre-wrap leading-relaxed text-lg font-medium">{job.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div className="bg-white p-8 rounded-3xl border border-amber-100 shadow-sm group hover:border-orange-300 transition-colors">
                {isCreator ? (
                  <>
                    <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Assigned Tradesperson
                    </h3>
                    {assignedWorker ? (
                      <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Name</p>
                            <p className="font-bold text-stone-900">{assignedWorker.name}</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Email</p>
                            <a href={`mailto:${assignedWorker.email}`} className="font-bold text-orange-600 hover:text-orange-800 transition-colors underline decoration-orange-200 underline-offset-4">{assignedWorker.email}</a>
                          </div>
                        </li>
                      </ul>
                    ) : (
                      <div className="py-4 text-center">
                        <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-stone-300 mx-auto mb-3">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <p className="text-stone-800 font-bold text-sm">No Worker Assigned Yet</p>
                        <p className="text-stone-400 text-xs mt-1">Review applications to hire a professional.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Client Information
                    </h3>
                    <ul className="space-y-6">
                      <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Name</p>
                          <p className="font-bold text-stone-900">{job.contactName || "User"}</p>
                        </div>
                      </li>
                      {isAssigned ? (
                        <li className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Email</p>
                            <a href={`mailto:${job.contactEmail}`} className="font-bold text-orange-600 hover:text-orange-800 transition-colors underline decoration-orange-200 underline-offset-4">{job.contactEmail}</a>
                          </div>
                        </li>
                      ) : (
                        <li className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-300 shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Email</p>
                            <p className="font-bold text-stone-400 italic">Protected until engagement</p>
                          </div>
                        </li>
                      )}
                    </ul>
                  </>
                )}
              </div>

              <div className="bg-white p-8 rounded-3xl border border-amber-100 shadow-sm group hover:border-orange-300 transition-colors">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Project Zone
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="font-bold text-stone-900">{job.location || "Local Service Area"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tradesperson Apply Form */}
            {isUnassignedTradesperson && job.status === 'Open' && (
              <div className="mt-12 bg-orange-100/30 rounded-[2.5rem] border border-orange-200/50 p-10 sm:p-12">
                {hasApplied ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md text-emerald-500 border border-emerald-50">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 mb-2">Message Transmitted</h3>
                    <p className="text-stone-600 font-medium">Your application is in the queue. You'll hear back if there's a match!</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100 shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-stone-900 tracking-tight">Express Interest</h3>
                        <p className="text-stone-500 font-medium">Send a warm message to the client about your service.</p>
                      </div>
                    </div>

                    {applyError && (
                      <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl text-xs text-red-700 font-bold">
                        {applyError}
                      </div>
                    )}

                    <form onSubmit={handleApply}>
                      <textarea
                        required
                        rows={5}
                        placeholder="Hi! I'd love to help you with this project. I've done similar tasks many times before..."
                        value={applyMessage}
                        onChange={(e) => setApplyMessage(e.target.value)}
                        className="w-full bg-white mb-6 p-6 font-medium text-stone-700"
                      />
                      <button
                        type="submit"
                        disabled={isApplying}
                        className={`btn-orange w-full sm:w-auto px-10 py-4 rounded-2xl text-sm ${isApplying ? 'opacity-50' : 'active:scale-95'}`}
                      >
                        {isApplying ? 'Sending Message...' : 'Submit Interest'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Unauthenticated View */}
            {!currentUser && job.status === 'Open' && (
              <div className="mt-12 bg-stone-50 rounded-[2.5rem] border border-stone-200 p-10 text-center">
                <h3 className="text-2xl font-black text-stone-900 mb-3">Professional Service?</h3>
                <p className="text-stone-600 mb-10 max-w-sm mx-auto font-medium">Join our community of friendly tradespeople to apply for local requests.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/login" className="btn-orange px-10 py-4 rounded-2xl text-sm">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-secondary px-10 py-4 rounded-2xl text-sm">
                    Create Account
                  </Link>
                </div>
              </div>
            )}

            {/* Star Rating Panel — shown to homeowner on closed, assigned jobs */}
            {isCreator && job.status === 'Closed' && job.assignedTo && (
              <div className="mt-12 bg-white rounded-3xl border border-amber-100 p-6 sm:p-10 shadow-sm transition-all duration-300">
                <div>
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 min-w-[3rem] min-h-[3rem] bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                        {job.ratedByHomeowner ? "Your Feedback & Rating" : "Rate This Tradesperson"}
                      </h3>
                      <p className="text-stone-500 font-medium text-sm sm:text-base">
                        {job.ratedByHomeowner 
                          ? "You have submitted feedback for this project. You can change it anytime below."
                          : "How satisfied were you with the work done?"}
                      </p>
                    </div>
                  </div>

                  {ratingError && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-sm text-red-700 font-bold">
                      {ratingError}
                    </div>
                  )}

                  {ratingSuccess && (
                    <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl text-sm text-emerald-700 font-bold flex items-center gap-2">
                      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Rating updated successfully!</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        disabled={isRating}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-transform hover:scale-125 focus:outline-none disabled:opacity-50"
                      >
                        <svg
                          className={`w-10 h-10 transition-colors duration-150 ${
                            star <= (hoveredStar || selectedRating)
                              ? 'text-orange-500'
                              : 'text-amber-200'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    {(hoveredStar || selectedRating) > 0 && (
                      <span className="text-sm font-black text-stone-500 uppercase tracking-widest ml-2">
                        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][hoveredStar || selectedRating]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 font-medium">
                    {job.ratedByHomeowner 
                      ? "Click any star above if you would like to change your submitted rating."
                      : "Click a star to submit your rating."}
                  </p>
                </div>
              </div>
            )}

            {/* Footer / Danger Zone */}
            {isCreator && job.status === 'Open' && (
              <div className="pt-10 mt-12 border-t border-amber-50 flex justify-end">
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2.5 text-red-400 hover:text-red-600 font-bold uppercase text-[10px] tracking-widest transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
