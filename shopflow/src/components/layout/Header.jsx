import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

function UserAvatar({ user }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = user.name ? user.name.trim()[0].toUpperCase() : '?';

  return (
    <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
      {!imgFailed && user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-white text-xs font-sans font-bold leading-none">{initial}</span>
      )}
    </div>
  );
}

export default function Header() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { items, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const menuRef = useRef(null);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { to: '/products', label: 'Shop All' },
    { to: '/products?category=Electronics', label: 'Electronics' },
    { to: '/products?category=Clothing', label: 'Clothing' },
    { to: '/products?category=Sports', label: 'Sports' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      {/* Announcement strip */}
      <div className="bg-gray-900 text-center py-2 hidden sm:block">
        <p className="text-[11px] font-sans text-gray-400 tracking-widest uppercase">
          Free shipping on orders above ₹499
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <span className="font-serif text-xl text-gray-900 font-normal tracking-wide">ShopFlow</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 ml-8">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="text-xs font-sans font-semibold text-gray-500 hover:text-gray-900 tracking-widest uppercase transition-colors whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Search — visible on sm+ with a solid background so it's always visible */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs hidden sm:flex ml-auto mr-2">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 focus:border-gray-900 focus:bg-white text-sm font-sans text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors rounded-none"
              />
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <button onClick={toggleCart} className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gray-900 text-white text-[10px] font-sans font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  className="flex items-center gap-2 text-sm font-sans text-gray-700 hover:text-gray-900 transition-colors px-1 py-1"
                >
                  <UserAvatar user={user} />
                  <span className="hidden sm:block text-xs font-semibold font-sans">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-11 bg-white border border-gray-200 shadow-xl w-52 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-semibold font-sans text-gray-900">{user.name}</p>
                      <p className="text-xs font-sans text-gray-400 truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-sans font-semibold text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/account/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-sans text-gray-700 hover:bg-gray-50 transition-colors">My Orders</Link>
                    <Link to="/account/addresses" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-sans text-gray-700 hover:bg-gray-50 transition-colors">Saved Addresses</Link>
                    <div className="border-t border-gray-100 mt-1" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-sans text-red-500 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block text-xs font-sans font-semibold text-gray-600 hover:text-gray-900 tracking-widest uppercase transition-colors ml-2 px-3 py-2 border border-gray-200 hover:border-gray-900"
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(o => !o)} className="md:hidden p-2 text-gray-500 ml-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 focus:border-gray-900 focus:bg-white text-sm font-sans focus:outline-none transition-colors placeholder:text-gray-400"
                />
                <button type="submit" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-1 text-xs font-sans font-semibold text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            {!user ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-1 text-xs font-sans font-semibold text-gray-900 uppercase tracking-widest mt-2 border-t border-gray-100 pt-4"
              >
                Sign In →
              </Link>
            ) : (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block py-2 px-1 text-xs font-sans text-red-500 uppercase tracking-widest mt-2 border-t border-gray-100 pt-4"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
