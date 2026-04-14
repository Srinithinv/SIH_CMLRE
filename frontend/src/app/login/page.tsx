'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AquaticBackground from '@/components/AquaticBackground';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // If already logged in, skip to dashboard
    if (document.cookie.includes('session=')) {
      router.push('/');
    }
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const endpoint = isSignup ? '/api/v1/auth/signup' : '/api/v1/auth/login';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Authentication failed');
      
      setStep('otp');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Connection timed out. Please check if the backend is running.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:8000/api/v1/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Invalid OTP');
      
      // Verification successful
      document.cookie = `session=${data.session_token}; path=/; max-age=86400`;
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-slate-900">
      <div className="absolute inset-0 opacity-40">
        <AquaticBackground />
      </div>

      <div className="w-full max-w-md p-6 sm:p-10 clean-card !bg-white/95 backdrop-blur-xl relative z-10 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-400 to-primary animate-pulse"></div>
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 animate-ping"></div>
            <span className="font-black text-3xl text-primary relative z-10">C</span>
          </div>
          <h2 className="title-lg !text-2xl !text-slate-900">CMLRE Intelligence</h2>
          <p className="subtitle !text-sm !text-slate-500 font-medium tracking-wide">
            {step === 'credentials' ? 'Scientific Access Control' : 'Two-Factor Verification'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
             Error: {error}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Institutional Email</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                placeholder="yours@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Security Key</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full !py-4.5 !rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] font-bold uppercase tracking-widest text-[11px]"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  isSignup ? 'Initialize Protocol' : 'Authenticate Access'
                )}
              </button>

              <button 
                type="button"
                onClick={() => {
                  setEmail('demo@cmlre.gov.in');
                  setPassword('demo1234');
                  setIsSignup(true);
                }}
                className="w-full py-4 rounded-2xl border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                Launch Demo Instance
              </button>
            </div>
            
            <div className="pt-2 text-center">
              <button 
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-xs font-bold text-primary/60 hover:text-primary transition-colors"
              >
                {isSignup ? 'Already registered? Login here' : 'New researcher? Request account'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-8 animate-in slide-in-from-right-4">
             <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center relative overflow-hidden group/hint">
                <p className="text-sm text-slate-600 font-medium mb-1">OTP sent to your email</p>
                <p className="text-xs text-slate-400 font-bold mb-3">{email}</p>
                
                <div className="bg-blue-50 text-[10px] text-blue-500 font-bold p-2 rounded-lg border border-blue-100 animate-pulse">
                   DEVELOPER HINT: Check your BACKEND TERMINAL for the 6-digit code.
                </div>
             </div>
             
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Verification Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  className="w-full px-5 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center text-3xl font-black tracking-[0.5em] text-primary"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
             </div>

             <button 
               type="submit" 
               disabled={loading}
               className="btn-primary w-full !py-4.5 !rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] font-bold uppercase tracking-widest text-[11px]"
             >
               {loading ? (
                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
               ) : (
                 'Finalize Authentication'
               )}
             </button>
             
             <button 
                type="button"
                onClick={() => setStep('credentials')}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
             >
               Go back to credentials
             </button>
          </form>
        )}

        <div className="mt-10 border-t border-slate-50 pt-6 flex justify-between items-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
           <div className="flex gap-2">
              <div className="h-4 w-6 bg-slate-200 rounded-sm"></div>
              <div className="h-4 w-6 bg-slate-200 rounded-sm"></div>
           </div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AES-256 Marine Security</p>
        </div>
      </div>
    </div>
  );
}
