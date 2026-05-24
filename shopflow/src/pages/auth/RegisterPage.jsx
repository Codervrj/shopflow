import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore(s => s.register);
  const showToast = useToastStore(s => s.show);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = register(form.name.trim(), form.email.trim(), form.password);
      if (result.success) {
        showToast('Account created. Welcome to ShopFlow.', 'success');
        const user = useAuthStore.getState().user;
        navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true });
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 700);
  }

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters' },
    { name: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
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
            "Exceptional quality,<br />
            <span className="italic text-gold-300">every time."</span>
          </blockquote>
          <p className="text-gray-400 text-sm font-sans">
            Create your account and enjoy a premium shopping experience tailored to you.
          </p>
        </div>
        <div className="relative z-20">
          <p className="text-gray-500 text-xs font-sans">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-300 hover:text-white underline underline-offset-4 transition-colors">Sign in</Link>
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
            <h1 className="font-serif text-3xl text-gray-900 font-normal mb-2">Create account</h1>
            <p className="text-gray-400 text-sm font-sans">Join us. It only takes a moment.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(f => (
              <div key={f.name}>
                <label className="block text-xs font-sans font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  placeholder={f.placeholder}
                  className="w-full border-0 border-b-2 border-gray-200 focus:border-gray-900 bg-transparent py-2.5 text-sm font-sans text-gray-900 placeholder:text-gray-300 focus:outline-none transition-colors"
                />
              </div>
            ))}

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
                  Creating Account
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm font-sans text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 font-semibold hover:underline underline-offset-4 transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
