import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@shopflow.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const showToast = useToastStore(s => s.show);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        const user = useAuthStore.getState().user;
        if (user?.role !== 'admin') {
          setError('This account does not have admin access.');
          useAuthStore.getState().logout();
          setLoading(false);
          return;
        }
        showToast('Welcome to Admin Panel', 'success');
        navigate('/admin', { replace: true });
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-[#0f0e0c] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <span className="font-serif text-white text-xl font-normal">ShopFlow</span>
          </Link>
          <p className="text-xs font-sans text-gray-500 tracking-widest uppercase mt-4">Admin Portal</p>
        </div>

        {/* Demo notice */}
        <div className="bg-amber-900/30 border border-amber-700/30 px-4 py-3 mb-8">
          <p className="text-xs font-sans text-amber-400 text-center leading-relaxed">
            Demo credentials are pre-filled below.<br />
            Click <span className="font-semibold">Sign In</span> to access the admin dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-sans font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-0 border-b border-gray-700 focus:border-white py-2.5 text-sm font-sans text-white placeholder:text-gray-600 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-0 border-b border-gray-700 focus:border-white py-2.5 text-sm font-sans text-white placeholder:text-gray-600 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm font-sans text-red-400 bg-red-900/20 px-4 py-2.5 border-l-2 border-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-600 text-gray-900 font-sans font-semibold text-sm tracking-widest uppercase py-3.5 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in
              </>
            ) : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs font-sans text-gray-600 hover:text-gray-400 transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
