import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "ServiceBoard | Warm Home Services",
  description: "Connecting quality homes with reliable local tradespeople.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-orange-100 selection:text-orange-900`}>
        <AuthProvider>
          <Navbar />

          <main className="flex-grow flex flex-col relative z-10">
            {children}
          </main>

          {/* Warm Service Footer */}
          <footer className="bg-orange-50/50 border-t border-amber-200 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="text-xl font-extrabold text-stone-900">
                      Service<span className="text-orange-600">Board</span>
                    </span>
                  </div>
                  <p className="text-stone-500 text-sm font-medium">
                    Making home maintenance simple and warm.
                  </p>
                </div>

                <div className="flex gap-8 text-sm font-bold text-stone-500">
                  <span className="hover:text-orange-600 cursor-pointer transition-colors">Jobs</span>
                  <span className="hover:text-orange-600 cursor-pointer transition-colors">Privacy</span>
                  <span className="hover:text-orange-600 cursor-pointer transition-colors">Terms</span>
                </div>

                <p className="text-stone-400 text-xs font-medium">
                  &copy; {new Date().getFullYear()} ServiceBoard Team.
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
