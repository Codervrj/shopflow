import { Link } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import ProductCard from '../../components/ui/ProductCard';

const categories = [
  {
    name: 'Electronics',
    desc: 'Gadgets & Devices',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-4M9 3a2 2 0 012-2h2a2 2 0 012 2M9 3h6m-3 9v6m-3-3h6" />
      </svg>
    ),
  },
  {
    name: 'Clothing',
    desc: 'Fashion & Style',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l-4 5h4v7h10v-7h4L17 7l-3 2c0-2-1.3-4-4-4S10 9 10 9L7 7z" />
      </svg>
    ),
  },
  {
    name: 'Home & Living',
    desc: 'Décor & Essentials',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    name: 'Sports',
    desc: 'Fitness & Activity',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: 'Books',
    desc: 'Knowledge & Growth',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

const trustBadges = [
  { icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ), title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ), title: 'Secure Payments', desc: '100% safe & encrypted' },
  { icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ), title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ), title: '24/7 Support', desc: 'Always here to help' },
];

export default function HomePage() {
  const products = useProductStore(s => s.products);
  const featured = products.filter(p => p.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="relative bg-[#0f0e0c] overflow-hidden min-h-[90vh] flex items-center">
        {/* subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40 z-10" />

        {/* background image collage */}
        <div className="absolute inset-0 grid grid-cols-3 gap-0 opacity-40">
          {featured.slice(0, 6).map((p, i) => (
            <div key={i} className="overflow-hidden">
              <img src={p.images[0]} alt="" className="w-full h-full object-cover scale-110" />
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 w-full">
          <div className="max-w-2xl">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans font-medium mb-6 opacity-90">
              New Season · 2024 Collection
            </p>
            <h1 className="font-serif text-white text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] mb-6">
              Curated for<br />
              <span className="italic text-gold-300">the discerning</span><br />
              few.
            </h1>
            <p className="text-gray-300 text-base sm:text-lg font-sans font-light leading-relaxed mb-10 max-w-md">
              From precision electronics to handcrafted essentials — every piece selected for those who demand excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-sans font-semibold text-sm tracking-wide px-8 py-3.5 hover:bg-gray-100 transition-colors"
              >
                Explore Collection
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/products?category=Electronics"
                className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-sans font-medium text-sm tracking-wide px-8 py-3.5 hover:bg-white/10 transition-colors"
              >
                New Arrivals
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 mt-14 pt-10 border-t border-white/10">
              {[
                { num: '25K+', label: 'Products' },
                { num: '50K+', label: 'Customers' },
                { num: '4.8', label: 'Avg. Rating' },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-serif text-white text-2xl font-normal">{s.num}</p>
                  <p className="text-gray-400 text-xs font-sans mt-0.5 tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Announcement strip ── */}
      <div className="bg-gray-900 text-white text-center py-2.5">
        <p className="text-xs font-sans tracking-widest uppercase">
          Free shipping on orders above ₹499 &nbsp;·&nbsp; Easy 30-day returns &nbsp;·&nbsp; New arrivals weekly
        </p>
      </div>

      {/* ── Shop by Category ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-xs text-gray-400 tracking-[0.3em] uppercase font-sans mb-3">Browse</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-normal">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group border border-gray-100 bg-white hover:border-gray-900 transition-all duration-300 p-6 flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 border border-gray-200 group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white text-gray-500 flex items-center justify-center transition-all duration-300">
                {cat.icon}
              </div>
              <div>
                <p className="font-serif text-gray-900 text-base font-normal">{cat.name}</p>
                <p className="text-xs text-gray-400 font-sans mt-0.5">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-luxury-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-gray-400 tracking-[0.3em] uppercase font-sans mb-2">Handpicked</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-normal">Featured Products</h2>
            </div>
            <Link to="/products" className="text-sm font-sans font-medium text-gray-600 hover:text-gray-900 transition-colors underline-offset-4 hover:underline hidden sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="text-sm font-sans font-medium text-gray-600 hover:text-gray-900 transition-colors underline">View all products</Link>
          </div>
        </div>
      </section>

      {/* ── Editorial Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden border border-gray-100 shadow-sm">
          <div className="bg-gray-900 text-white p-12 sm:p-16 flex flex-col justify-center">
            <p className="text-xs text-gold-400 tracking-[0.3em] uppercase font-sans mb-4">Limited Time</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight mb-4">
              Weekend Sale —<br />Up to 40% Off
            </h2>
            <p className="text-gray-400 text-sm font-sans leading-relaxed mb-8 max-w-sm">
              Carefully selected products at exceptional prices. A rare opportunity for the conscious buyer.
            </p>
            <Link
              to="/products"
              className="self-start inline-flex items-center gap-2 bg-white text-gray-900 font-sans font-semibold text-sm px-7 py-3 hover:bg-gray-100 transition-colors"
            >
              Shop Sale
            </Link>
          </div>
          {newArrivals[0] && (
            <div className="aspect-auto lg:aspect-square overflow-hidden min-h-[300px]">
              <img
                src={newArrivals[0].images[0]}
                alt={newArrivals[0].name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-gray-400 tracking-[0.3em] uppercase font-sans mb-2">Just In</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-normal">New Arrivals</h2>
            </div>
            <Link to="/products" className="text-sm font-sans font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block underline-offset-4 hover:underline">See all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Trust Badges ── */}
      <section className="border-t border-gray-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {trustBadges.map(b => (
              <div key={b.title} className="flex flex-col items-center gap-3">
                <div className="text-gray-400">{b.icon}</div>
                <div>
                  <p className="font-serif text-gray-900 text-base">{b.title}</p>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
