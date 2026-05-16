import React from 'react';

/**
 * Renders a consistent star rating display (Warm Service Theme)
 * @param rating - Numerical rating from 0 to 5
 */
export const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (i === fullStars && rating % 1 >= 0.5) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-orange-400 opacity-60" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  }
  return stars;
};

/**
 * Renders a consistent warm service status badge
 * @param status - The status string to display
 */
export const getStatusBadge = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset";
  
  switch (normalizedStatus) {
    case "open":
      return (
        <span className={`${baseClass} bg-green-50 text-green-700 ring-green-600/20`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>Open
        </span>
      );
    case "in progress":
    case "approved":
      return (
        <span className={`${baseClass} bg-orange-50 text-orange-700 ring-orange-600/20`}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>
          {normalizedStatus === 'approved' ? 'Approved' : 'In Progress'}
        </span>
      );
    case "pending":
      return (
        <span className={`${baseClass} bg-blue-50 text-blue-700 ring-blue-600/20`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>Pending
        </span>
      );
    case "rejected":
      return (
        <span className={`${baseClass} bg-red-50 text-red-700 ring-red-600/20`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>Rejected
        </span>
      );
    case "closed":
      return (
        <span className={`${baseClass} bg-stone-100 text-stone-600 ring-stone-200`}>
          Closed
        </span>
      );
    default:
      return (
        <span className={`${baseClass} bg-stone-50 text-stone-600 ring-stone-100`}>
          {status}
        </span>
      );
  }
};
