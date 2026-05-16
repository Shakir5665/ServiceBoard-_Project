"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";

/**
 * Navbar - Warm Service Theme
 * Desktop: full inline nav links.
 * Mobile: logo + bell only; all links in a right-to-left slide-in sidebar.
 */
export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setSidebarOpen(false);
    router.push("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* ── Top Bar ─────────────────────────────────────── */}
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

            {/* Right side of top bar */}
            <div className="flex items-center gap-2">

              {/* Notification bell — always visible when authenticated */}
              {isAuthenticated && <NotificationBell />}

              {/* ── Desktop Nav (md+) ─────────────────────── */}
              <nav className="hidden md:flex items-center gap-5">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/"
                      className="text-sm font-bold text-stone-500 hover:text-orange-600 transition-colors"
                    >
                      Browse Jobs
                    </Link>

                    <Link
                      href={userRole === "tradesperson" ? "/dashboard/tradesperson" : "/dashboard/homeowner"}
                      className="bg-orange-50 text-orange-700 px-5 py-2.5 rounded-xl text-xs font-black tracking-widest hover:bg-orange-100 transition-colors"
                    >
                      My Jobs
                    </Link>

                    {userRole === "tradesperson" && (
                      <Link
                        href="/dashboard/tradesperson/profile"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold hover:bg-orange-50 hover:text-orange-600 transition-all"
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
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-bold text-stone-500 hover:text-orange-600 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/register" className="btn-orange px-8 py-3 rounded-xl text-sm shadow-md shadow-orange-100">
                      Get Started
                    </Link>
                  </>
                )}
              </nav>

              {/* ── Hamburger (mobile only) ──────────────── */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2.5 rounded-xl text-stone-500 hover:bg-orange-50 hover:text-orange-600 transition-all focus:outline-none"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar Backdrop ──────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[70] bg-stone-900/40 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ── Mobile Sidebar (slides in from right) ───────── */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 z-[80] bg-white shadow-2xl border-l border-amber-100 flex flex-col
          transform transition-transform duration-300 ease-in-out md:hidden
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-50">
          <span className="text-lg font-black text-stone-900">
            Service<span className="text-orange-600">Board</span>
          </span>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-xl text-stone-400 hover:bg-orange-50 hover:text-orange-600 transition-all focus:outline-none"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-stone-600 font-bold text-sm hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Jobs
              </Link>

              <Link
                href={userRole === "tradesperson" ? "/dashboard/tradesperson" : "/dashboard/homeowner"}
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-stone-600 font-bold text-sm hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Jobs
              </Link>

              {userRole === "tradesperson" && (
                <Link
                  href="/dashboard/tradesperson/profile"
                  onClick={closeSidebar}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-stone-600 font-bold text-sm hover:bg-orange-50 hover:text-orange-600 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Edit Profile
                </Link>
              )}

              <div className="pt-4 border-t border-amber-50 mt-4">
                <button
                  onClick={() => { setSidebarOpen(false); setShowLogoutModal(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-stone-600 font-bold text-sm hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={closeSidebar}
                className="flex items-center justify-center gap-2 mt-2 px-4 py-3.5 rounded-2xl btn-orange text-sm font-bold"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        {isAuthenticated && (
          <div className="px-6 py-5 border-t border-amber-50">
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest text-center">
              Service<span className="text-orange-400">Board</span> · Warm Services
            </p>
          </div>
        )}
      </aside>

      {/* ── Sign Out Confirmation Modal ──────────────────── */}
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
