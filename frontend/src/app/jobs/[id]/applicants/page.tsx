"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { renderStars } from "@/utils/ui-helpers";

/**
 * Interface for applicant data with nested tradesperson profile
 */
interface Applicant {
  _id: string;
  status: string;
  message: string;
  createdAt: string;
  tradespersonId: {
    _id: string;
    name: string;
    experience: string;
    hourlyRate: number;
    rating: number;
    completedJobs: number;
    serviceArea: string;
    bio: string;
  };
}

/**
 * Applicants Review Page - Warm Service Edition
 * Features a friendly vetting interface for homeowners to review candidates.
 */
export default function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [jobTitle, setJobTitle] = useState("");
  const [jobStatus, setJobStatus] = useState("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'alert';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ isOpen: false, type: 'alert', title: '', message: '' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const headers = { "Authorization": `Bearer ${token}` };

      const [jobRes, applicantsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/applicants`, { headers })
      ]);

      if (jobRes.ok && applicantsRes.ok) {
        const jobData = await jobRes.json();
        setJobTitle(jobData.title);
        setJobStatus(jobData.status);
        setApplicants(await applicantsRes.json());
      } else {
        router.push("/dashboard/homeowner");
      }
    } catch {
      setError("Sync failed: Unable to load applicant pool.");
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = (applicationId: string, action: 'approve' | 'reject') => {
    const message = action === 'approve' 
      ? "Ready to hire this professional? This will assign them to your project and notify other candidates."
      : "Are you sure you want to decline this application?";
    
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: action === 'approve' ? 'Hire Professional' : 'Decline Application',
      message,
      onConfirm: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        executeAction(applicationId, action);
      },
      onCancel: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const executeAction = async (applicationId: string, action: 'approve' | 'reject') => {
    setProcessingId(applicationId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/${action}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        await fetchData();
      } else {
        const errorData = await res.json();
        setModalConfig({
          isOpen: true,
          type: 'alert',
          title: "Notice",
          message: errorData.message || `Something went wrong.`,
          onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
        });
      }
    } catch (error) {
      setError("Action failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin"></div>
        <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest">Finding Candidates...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFFBEB] min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
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
                  className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-100"
                >
                  Confirm
                </button>
                {modalConfig.type === 'confirm' && (
                  <button 
                    onClick={modalConfig.onCancel}
                    className="w-full py-4 text-stone-500 font-bold hover:text-stone-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/dashboard/homeowner" className="inline-flex items-center text-sm font-bold text-stone-400 hover:text-orange-600 transition-colors group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Dashboard
          </Link>
          <Link href={`/jobs/${id}`} className="text-sm font-black text-orange-600 hover:text-orange-800 transition-colors uppercase tracking-widest">
            Original Request
          </Link>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-stone-900 tracking-tightest mb-2">Applicants</h1>
          <p className="text-lg text-stone-500 font-medium">
            Reviewing proposals for <span className="text-orange-600 font-black">{jobTitle}</span>
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl text-sm text-red-900 font-bold shadow-sm">
            {error}
          </div>
        )}

        {applicants.length === 0 ? (
          <div className="bg-orange-50/50 rounded-[3rem] border border-orange-100 p-20 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-orange-200">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-stone-800 mb-3">No Applicants Yet</h3>
            <p className="text-stone-500 max-w-md mx-auto font-medium">Interested tradespeople will appear here. We'll notify you as soon as someone applies!</p>
          </div>
        ) : (
          <div className="space-y-10">
            {applicants.map((app) => (
              <div key={app._id} className={`premium-card overflow-hidden transition-all duration-300 ${app.status === 'approved' ? 'border-orange-500 ring-2 ring-orange-500/20' : app.status === 'rejected' ? 'opacity-50 grayscale' : 'hover:border-orange-300'}`}>
                {app.status === 'approved' && (
                  <div className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 px-6 text-center">
                    Hired Professional
                  </div>
                )}
                
                <div className="p-8 sm:p-12 flex flex-col lg:flex-row gap-12">
                  {/* Profile Summary */}
                  <div className="lg:w-1/3 shrink-0 flex flex-col items-center lg:items-start lg:border-r lg:border-amber-50 lg:pr-12">
                    <div className="w-24 h-24 rounded-3xl bg-orange-100 flex items-center justify-center text-orange-600 text-4xl font-black uppercase mb-6 shadow-inner">
                      {app.tradespersonId.name.charAt(0)}
                    </div>
                    
                    <h3 className="text-2xl font-black text-stone-900 mb-2">{app.tradespersonId.name}</h3>
                    <div className="flex items-center gap-2 mb-8">
                      <div className="flex text-orange-500">{renderStars(app.tradespersonId.rating)}</div>
                      <span className="font-bold text-stone-900">{app.tradespersonId.rating.toFixed(1)}</span>
                    </div>

                    <div className="w-full space-y-4 bg-orange-50/30 p-6 rounded-2xl border border-orange-100/50">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-400 font-bold uppercase tracking-widest text-[9px]">Hourly Rate</span>
                        <span className="font-black text-stone-900">LKR {app.tradespersonId.hourlyRate}.00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-400 font-bold uppercase tracking-widest text-[9px]">Completed</span>
                        <span className="font-black text-stone-900">{app.tradespersonId.completedJobs} Jobs</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="lg:w-2/3 flex flex-col">
                    <div className="flex-grow">
                      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                        Proposal Message
                      </h4>
                      <div className="bg-orange-50/10 border border-orange-100 p-8 rounded-3xl italic">
                        <p className="text-stone-700 text-lg leading-relaxed font-medium">"{app.message}"</p>
                      </div>
                    </div>

                    {/* Actions */}
                    {app.status === 'pending' && jobStatus === 'Open' && (
                      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-end">
                        <button
                          onClick={() => confirmAction(app._id, 'reject')}
                          disabled={processingId === app._id}
                          className="px-8 py-3.5 rounded-xl border border-amber-200 text-stone-400 font-black hover:text-red-500 hover:border-red-200 transition-all text-[10px] uppercase tracking-widest"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => confirmAction(app._id, 'approve')}
                          disabled={processingId === app._id}
                          className="btn-orange px-10 py-3.5 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-orange-100"
                        >
                          Hire This Pro
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
