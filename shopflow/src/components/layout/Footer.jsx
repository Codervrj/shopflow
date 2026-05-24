import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0f0e0c] text-gray-400 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                  <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
              <span className="font-serif text-white text-xl font-normal">ShopFlow</span>
            </div>
            <p className="text-sm font-sans text-gray-500 leading-relaxed max-w-xs">
              Curated products for the discerning shopper. Quality, trust, and elegance — delivered.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-sans font-semibold text-white uppercase tracking-widest mb-5">Shop</h4>
            <ul className="space-y-3 text-sm font-sans">
              {['Electronics', 'Clothing', 'Home & Living', 'Sports', 'Books'].map(c => (
                <li key={c}>
                  <Link to={`/products?category=${encodeURIComponent(c)}`} className="hover:text-white transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-sans font-semibold text-white uppercase tracking-widest mb-5">Account</h4>
            <ul className="space-y-3 text-sm font-sans">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/account/addresses" className="hover:text-white transition-colors">Saved Addresses</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-sans font-semibold text-white uppercase tracking-widest mb-5">Help</h4>
            <ul className="space-y-3 text-sm font-sans">
              <li><span>FAQ</span></li>
              <li><span>Shipping Policy</span></li>
              <li><span>Returns</span></li>
              <li><span>Contact Us</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-gray-600">© 2024 ShopFlow. Showcase demo — no real transactions occur.</p>
          <div className="flex items-center gap-6 text-xs font-sans text-gray-600">
            <span>Secure Demo</span>
            <span>·</span>
            <span>Mock Payments</span>
            <span>·</span>
            <Link to="/admin" className="hover:text-gray-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
