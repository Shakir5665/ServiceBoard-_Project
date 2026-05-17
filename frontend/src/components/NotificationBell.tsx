"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Notification Interface
 */
interface Notification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

/**
 * NotificationBell Component - Warm Service Edition
 * Features a soft orange alert system with a welcoming dropdown.
 */
export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch {
      // Silent fail
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Notification update failed", error);
    }
  };

  const clearAll = async () => {
    if (!notifications.length) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Notification clear failed", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    setShowDropdown(false);
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === "tradesperson") {
          router.push("/dashboard/tradesperson");
        } else {
          router.push("/dashboard/homeowner");
        }
      } else {
        router.push("/");
      }
    } catch {
      router.push("/");
    }
  };

  const getIcon = (type: string) => {
    const iconBaseClass = "w-8 h-8 rounded-full flex items-center justify-center";
    switch (type) {
      case 'approval':
        return (
          <div className={`${iconBaseClass} bg-green-50 text-green-600`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'rejection':
        return (
          <div className={`${iconBaseClass} bg-red-50 text-red-600`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${iconBaseClass} bg-orange-50 text-orange-600`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2.5 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300 focus:outline-none group"
      >
        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-600 text-[9px] font-black text-white items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="fixed md:absolute right-4 md:right-0 left-4 md:left-auto top-[5.25rem] md:top-auto mt-0 md:mt-4 w-auto md:w-96 bg-white rounded-3xl shadow-2xl border border-amber-100 z-50 overflow-hidden transform origin-top md:origin-top-right animate-in fade-in zoom-in duration-200 max-w-md md:max-w-none mx-auto md:mx-0">
          <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-amber-50 bg-orange-50/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-black text-stone-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black text-white bg-orange-600 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  {unreadCount} New
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button 
                onClick={clearAll}
                className="text-[10px] font-black text-stone-400 hover:text-red-600 uppercase tracking-widest transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="max-h-[28rem] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 sm:px-8 py-12 sm:py-16 text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-stone-300">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 8-8-8" />
                  </svg>
                </div>
                <p className="text-stone-800 font-bold">All caught up!</p>
                <p className="text-stone-400 text-xs mt-1">No new notifications at the moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-amber-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`px-5 sm:px-8 py-4 sm:py-5 flex gap-3 sm:gap-4 hover:bg-orange-50/50 transition-all cursor-pointer group ${!notification.read ? 'bg-orange-50/20' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="shrink-0 pt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${!notification.read ? 'text-stone-900 font-bold' : 'text-stone-600 font-medium'}`}>
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-2 font-bold uppercase tracking-widest">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
