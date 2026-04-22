'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, dispatchAuthChange } from '@/lib/auth';
import Link from 'next/link';
import { Shield, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { generateCodeVerifier, generateCodeChallenge } from '@/lib/sso';

function loginAgniveer(mobile: string) {
  const session = {
    user: {
      username: mobile,
      email: mobile,
      name: 'Mohan Singh',
      role: 'agniveer',
      mobile,
    },
    loginTime: Date.now(),
  };
  localStorage.setItem('agniveer_session', JSON.stringify(session));
  dispatchAuthChange();
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");

  const isMobileNumber = (value: string) => /^\d{10}$/.test(value.trim());

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isMobileNumber(username)) {
        if (password === '123456') {
          loginAgniveer(username);
          router.push('/agniveerdashboard');
          return;
        } else {
          setError('Invalid OTP. Please enter the correct OTP.');
          setLoading(false);
          return;
        }
      }

      const user = await login(username, password);
      if (user) {
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Please check your Email ID and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('[v0] Login error:', err);
    } finally {
      setLoading(false);
    }
  };

// ✅ AFTER (fixed)
// ✅ Exact copy of sir's code — no PKCE, simple version
const handleJanParichayLogin = () => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL;
  const scope = process.env.NEXT_PUBLIC_SCOPE;

  const authorizationUrl =
    `${ssoUrl}?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri ?? "")}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope ?? "")}`;

  console.log('authorizationUrl constructed:', authorizationUrl);
  window.location.href = authorizationUrl;
};
  const isMobile = isMobileNumber(username);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-[#1a2a6c] text-white text-xs py-1.5 px-6 flex items-center justify-between">
        <span>भारत सरकार | Government of India</span>
        <div className="flex gap-3">
          <span>हिन्दी</span> | <span>English</span>
        </div>
      </div>
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <img src="/images/agniveer-logo.jpg" alt="Emblem" className="h-14 w-14 rounded" />
            <div>
              <p className="text-xs text-slate-500">Ministry of Home Affairs</p>
              <h1 className="text-lg font-bold text-[#1a2a6c]">Agniveer Rehabilitation Program Portal</h1>
            </div>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-2xl overflow-hidden border border-slate-200">

          {/* Left info panel */}
          <div className="bg-gradient-to-br from-[#1a2a6c] via-[#1e3a8a] to-[#0f172a] text-white p-10 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-extrabold leading-tight mb-3">Secure Access<br />Portal</h2>
              <p className="text-blue-200 text-sm leading-relaxed mb-8">
                This portal is exclusively for authorised personnel of the Ministry of Home Affairs and registered entity administrators.
              </p>
              <div className="space-y-3">
                {[
                  'MHA Administrative Access',
                  'Entity-wise Dashboards (BSF, CISF, CRPF, ITBP)',
                  'Agniveer Data & Analytics',
                  'Job Notification Management',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-blue-100">
                    <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#1a2a6c]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/20 text-xs text-slate-400">
              © 2026 Ministry of Home Affairs, GoI
            </div>
          </div>

          {/* Right Login Form */}
          <div className="bg-white p-10 flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800">Sign In</h3>
              <p className="text-slate-500 text-sm mt-1">Enter your authorized credentials to access the portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email ID / Mobile Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your Email ID or Mobile Number"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2a6c]/30 focus:border-[#1a2a6c] transition-colors"
                    required
                  />
                </div>
                {isMobile && (
                  <p className="mt-1.5 text-xs text-blue-600 font-medium">📱 Mobile number detected — enter OTP to continue</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {isMobile ? 'OTP' : 'Password / OTP'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isMobile ? 'Enter 6-digit OTP' : 'Enter your Password or OTP'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a2a6c]/30 focus:border-[#1a2a6c] transition-colors"
                    required
                    maxLength={isMobile ? 6 : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1a2a6c] hover:bg-[#162059] disabled:opacity-60 text-white py-3 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Login Securely
                  </>
                )}
              </button>

              {/* ✅ Styled JanParichay button */}
             <button
  type="button"
  onClick={handleJanParichayLogin}
  className="w-full flex items-center justify-center gap-2 border-2 border-[#1a2a6c] text-[#1a2a6c] hover:bg-[#1a2a6c] hover:text-white py-3 rounded-lg font-bold text-sm transition-all"
>
  <img
    src="/images/janparichay-logo.png"
    alt="JanParichay"
    className="h-5 w-5"
    onError={(e) => (e.currentTarget.style.display = 'none')}
  />
  Login with JanParichay
</button>

{/* ✅ SHOW GENERATED URL */}
{generatedUrl !== "" && (
  <div className="mt-4 p-3 bg-gray-100 rounded text-xs break-all">
    {generatedUrl}
  </div>
)}

{/* ✅ CONTINUE LOGIN BUTTON */}
{generatedUrl !== "" && (
  <button
    onClick={() => window.location.href = generatedUrl}
    className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
  >
    Continue Login
  </button>
)}
              
            </form>

            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">Demo Credentials</p>
              <div className="space-y-1 text-xs text-amber-700">
                <p><span className="font-semibold">MHA Admin (Email):</span> admin / admin123</p>
                <p><span className="font-semibold">CISF Entity Admin (Email):</span> cisf / cisf123</p>
                <p><span className="font-semibold">Agniveer (Mobile + OTP):</span> 10-digit mobile / 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#1a2a6c] text-center text-xs text-slate-400 py-3">
        © 2026 Ministry of Home Affairs, Government of India. For issues contact: avrp@mha.gov.in
      </footer>
    </div>
  );
}