import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const showToast = useToastStore(s => s.show);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        showToast('Welcome back!', 'success');
        const user = useAuthStore.getState().user;
        if (user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from === '/login' ? '/' : from, { replace: true });
        }
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 700);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f0e0c] relative overflow-hidden flex-col justify-between p-14">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/60 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80')" }}
        />
        <div className="relative z-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 border border-white/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <span className="text-white font-serif text-xl font-normal tracking-wide">ShopFlow</span>
          </Link>
        </div>
        <div className="relative z-20">
          <blockquote className="font-serif text-white text-3xl font-normal leading-snug mb-6">
            "The finest things,<br />
            <span className="italic text-gold-300">delivered with care."</span>
          </blockquote>
          <p className="text-gray-400 text-sm font-sans">
            Join thousands of customers who trust ShopFlow for their premium shopping needs.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                  <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
              <span className="font-serif text-xl text-gray-900">ShopFlow</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl text-gray-900 font-normal mb-2">Sign in</h1>
            <p className="text-gray-400 text-sm font-sans">Welcome back. Please enter your credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-sans font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full border-0 border-b-2 border-gray-200 focus:border-gray-900 bg-transparent py-2.5 text-sm font-sans text-gray-900 placeholder:text-gray-300 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-sans font-semibold text-gray-500 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" className="text-xs font-sans text-gray-400 hover:text-gray-700 transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border-0 border-b-2 border-gray-200 focus:border-gray-900 bg-transparent py-2.5 text-sm font-sans text-gray-900 placeholder:text-gray-300 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm font-sans text-red-600 bg-red-50 px-4 py-2.5 border-l-2 border-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white font-sans font-medium text-sm tracking-widest uppercase py-3.5 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm font-sans text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-gray-900 font-semibold hover:underline underline-offset-4 transition-all">
                Create one
              </Link>
            </p>
          </div>

          {/* Admin demo access */}
          <div className="mt-6 border border-gray-200 p-4 text-center">
            <p className="text-xs font-sans text-gray-400 mb-2">Want to explore the admin panel?</p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-gray-700 hover:text-gray-900 uppercase tracking-widest transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Access Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
