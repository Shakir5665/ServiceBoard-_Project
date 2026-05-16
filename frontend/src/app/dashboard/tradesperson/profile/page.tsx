"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Edit Profile Page - Warm Service Edition
 * Professional identity management with a clean, welcoming layout.
 */
export default function EditProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    experience: string;
    hourlyRate: number | string;
    serviceArea: string;
    bio: string;
  }>({
    name: "",
    experience: "",
    hourlyRate: 0,
    serviceArea: "",
    bio: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch fresh profile data from API to get up-to-date rating
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setFormData({
            name: user.name || "",
            experience: user.experience || "",
            hourlyRate: user.hourlyRate || 0,
            serviceArea: user.serviceArea || "",
            bio: user.bio || ""
          });
          setRating(user.rating || 0);
          setRatingCount(user.ratingCount || 0);
        } else {
          // Fallback to localStorage if API fails
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            setFormData({
              name: user.name || "",
              experience: user.experience || "",
              hourlyRate: user.hourlyRate || 0,
              serviceArea: user.serviceArea || "",
              bio: user.bio || ""
            });
            setRating(user.rating || 0);
            setRatingCount(user.ratingCount || 0);
          }
        }
      } catch {
        // Fallback to localStorage on network error
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setFormData({
              name: user.name || "",
              experience: user.experience || "",
              hourlyRate: user.hourlyRate || 0,
              serviceArea: user.serviceArea || "",
              bio: user.bio || ""
            });
          } catch { /* ignore */ }
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' ? (value === "" ? "" : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const dataToSubmit = {
        ...formData,
        hourlyRate: formData.hourlyRate === "" ? 0 : Number(formData.hourlyRate)
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSubmit)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update profile");
      }
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin"></div>
        <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest">Loading Identity...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full bg-[#FFFBEB]">
      <div className="mb-14">
        <h1 className="text-4xl font-black text-stone-900 tracking-tightest mb-4">Edit Profile</h1>
        <p className="text-lg text-stone-600 font-medium">Update your professional identity to stand out to homeowners.</p>
      </div>

      {/* Star Rating Display Card */}
      <div className="premium-card p-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">Your Rating</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(rating) ? 'text-orange-500' : 'text-amber-200'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-2xl font-black text-stone-900">{rating > 0 ? rating.toFixed(1) : '—'}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-orange-600">{ratingCount}</p>
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest mt-1">
              {ratingCount === 1 ? 'Review' : 'Reviews'} received
            </p>
          </div>
        </div>

        {ratingCount === 0 && (
          <p className="mt-6 text-sm text-stone-400 font-medium border-t border-amber-50 pt-6">
            Complete your first job and get rated by a homeowner to see your score here.
          </p>
        )}
      </div>

      {success && (
        <div className="mb-10 bg-green-50 border-l-4 border-green-600 p-6 rounded-2xl text-sm text-green-900 font-bold flex items-center gap-4 shadow-sm">
          Your profile has been successfully updated.
        </div>
      )}

      {error && (
        <div className="mb-10 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl text-sm text-red-900 font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="premium-card overflow-hidden">
        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
                placeholder="Your Name"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full"
                placeholder="eg: 5 years"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Hourly Rate (LKR)</label>
              <div className="flex items-center border border-[#FED7AA] rounded-xl overflow-hidden bg-white focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <span className="px-4 py-3 bg-orange-50 text-orange-600 text-sm font-black border-r border-[#FED7AA] shrink-0 select-none">LKR</span>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border-none outline-none bg-transparent text-stone-900 font-bold placeholder:text-stone-300"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Service Area</label>
              <input
                type="text"
                name="serviceArea"
                value={formData.serviceArea}
                onChange={handleChange}
                className="w-full"
                placeholder="Colombo"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Professional Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              className="w-full resize-none leading-relaxed"
              placeholder="Tell customers about your unique skills and the value you provide..."
            />
          </div>
        </div>

        <div className="p-10 bg-orange-50/20 border-t border-amber-50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-bold text-stone-400 hover:text-stone-700 transition-colors order-2 sm:order-1"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-orange w-full sm:w-auto px-10 py-4 rounded-2xl text-sm shadow-lg shadow-orange-100 flex items-center justify-center gap-3 order-1 sm:order-2"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
