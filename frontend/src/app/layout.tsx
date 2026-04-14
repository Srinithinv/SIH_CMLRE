'use client';
import { useState, useEffect } from 'react';
import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AquaticBackground from '@/components/AquaticBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie.includes('session=');
      setIsAuth(token);
      if (!token && pathname !== '/login') {
        router.push('/login');
      }
    };
    checkAuth();
  }, [pathname, router]);

  const handleSignOut = () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  const isLoginPage = pathname === '/login';

  const navItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'eDNA Analysis', href: '/edna', icon: '🧬' },
    { name: 'Taxonomy', href: '/taxonomy', icon: '📁' },
    { name: 'Otolith Lab', href: '/otolith', icon: '🔬' },
    { name: 'Ingest Data', href: '/ingestion', icon: '☁️' },
  ];

  return (
    <html lang="en">
      <body className="antialiased selection:bg-blue-100">
        <div className="flex min-h-screen relative overflow-hidden bg-[#fdfdfd]">
          {/* Immersive Aquatic Background */}
          <AquaticBackground />

          {!isLoginPage && (
            <>
              {/* Mobile Hamburger */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-6 right-6 z-[70] w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center text-2xl border border-gray-100"
              >
                {isSidebarOpen ? '✕' : '☰'}
              </button>

              {/* Mobile Overlay */}
              {isSidebarOpen && (
                <div 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] animate-in fade-in"
                />
              )}

              <aside className={`sidebar ${!isSidebarOpen ? 'mobile-hidden' : ''} shadow-2xl shadow-blue-900/5`}>
                <div className="flex items-center gap-3 mb-12 px-2">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-300">
                    <span className="font-bold text-lg">C</span>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-gray-900 leading-tight">CMLRE</h1>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Intelligence</p>
                  </div>
                </div>
                
                <nav className="flex-1 space-y-2">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      onClick={() => setIsSidebarOpen(false)}
                      className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                    >
                      <span className="text-xl">{item.icon}</span> {item.name}
                    </Link>
                  ))}
                </nav>
                
                <div className="pt-6 border-t border-gray-50">
                  <button 
                    onClick={handleSignOut}
                    className="nav-link w-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              </aside>
            </>
          )}

          {/* Main Area */}
          <main className={isLoginPage ? "w-full" : "main-content flex-1"}>
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
