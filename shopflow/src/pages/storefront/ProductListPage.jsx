import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import ProductCard from '../../components/ui/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home & Living', 'Sports', 'Books'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useProductStore(s => s.products);

  // Derive category directly from URL so header nav links always work
  const rawCategory = searchParams.get('category') || 'All';
  const category = CATEGORIES.includes(rawCategory) ? rawCategory : 'All';

  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = category === 'All' ? products : products.filter(p => p.category === category);
    list = list.filter(p => p.price <= maxPrice);
    switch (sort) {
      case 'newest':    return [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'price_asc': return [...list].sort((a, b) => a.price - b.price);
      case 'price_desc':return [...list].sort((a, b) => b.price - a.price);
      case 'rating':    return [...list].sort((a, b) => b.rating - a.rating);
      default:          return [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [products, category, sort, maxPrice]);

  function selectCategory(cat) {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-sans font-semibold text-gray-400 uppercase tracking-widest mb-1">
            {category === 'All' ? 'All Products' : 'Category'}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-normal">
            {category === 'All' ? 'Shop All' : category}
          </h1>
          <p className="text-xs font-sans text-gray-400 mt-1">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(o => !o)}
            className="lg:hidden flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-gray-600 border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
          </button>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-xs font-sans border border-gray-200 px-3 py-2 focus:outline-none focus:border-gray-900 bg-white text-gray-700 transition-colors"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-52 flex-shrink-0`}>
          <div className="bg-white border border-gray-100 p-5 sticky top-24">
            <p className="text-[10px] font-sans font-semibold text-gray-400 uppercase tracking-widest mb-4">Category</p>
            <ul className="space-y-0.5">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => selectCategory(cat)}
                    className={`w-full text-left px-3 py-2 text-sm font-sans transition-colors ${
                      category === cat
                        ? 'bg-gray-900 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

            <p className="text-[10px] font-sans font-semibold text-gray-400 uppercase tracking-widest mt-7 mb-4">Max Price</p>
            <input
              type="range"
              min={200}
              max={20000}
              step={200}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gray-900"
            />
            <div className="flex justify-between text-xs font-sans text-gray-400 mt-1.5">
              <span>₹200</span>
              <span className="font-semibold text-gray-900">₹{maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-300">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-serif text-xl text-gray-400">No products found</p>
              <p className="text-sm font-sans mt-2 text-gray-300">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
