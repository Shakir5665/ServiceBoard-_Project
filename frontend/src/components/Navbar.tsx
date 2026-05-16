"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";

/**
 * Navbar - Warm Service Theme
 * Solid white top bar with orange accents and clean navigation.
 */
export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token) {
      setIsAuthenticated(true);
      if (userStr) {
        try {
          setUserRole(JSON.parse(userStr).role);
        } catch { }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserRole(null);
    setShowLogoutModal(false);
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-[60] bg-white border-b border-amber-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-100 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xl font-black text-stone-900 tracking-tight">
                Service<span className="text-orange-600">Board</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-4 sm:gap-8">
              {isAuthenticated ? (
                <div className="flex items-center gap-3 sm:gap-5">
                  <NotificationBell />

                  <Link
                    href="/"
                    className="text-sm font-bold text-stone-500 hover:text-orange-600 transition-colors hidden md:block"
                  >
                    Browse Jobs
                  </Link>

                  <Link
                    href={userRole === 'tradesperson' ? "/dashboard/tradesperson" : "/dashboard/homeowner"}
                    className="bg-orange-50 text-orange-700 px-5 py-2.5 rounded-xl text-xs font-black tracking-widest hover:bg-orange-100 transition-colors"
                  >
                    My Jobs
                  </Link>

                  {userRole === 'tradesperson' && (
                    <Link
                      href="/dashboard/tradesperson/profile"
                      className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold hover:bg-orange-50 hover:text-orange-600 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Profile
                    </Link>
                  )}

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-500 text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:block">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 sm:gap-8">
                  <Link
                    href="/login"
                    className="text-sm font-bold text-stone-500 hover:text-orange-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-orange px-8 py-3 rounded-xl text-sm shadow-md shadow-orange-100"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-amber-100">
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-2">Sign Out?</h3>
              <p className="text-stone-500 font-medium mb-8">
                Are you sure you want to end your session?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
                >
                  Yes, Sign Out
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 text-stone-500 font-bold hover:text-stone-800 transition-colors"
                >
                  Stay Signed In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
