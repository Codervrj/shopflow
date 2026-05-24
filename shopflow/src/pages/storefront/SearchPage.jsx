import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import useProductStore from '../../store/productStore';
import ProductCard from '../../components/ui/ProductCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const products = useProductStore(s => s.products);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }, [q, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {q ? `Results for "${q}"` : 'Search Products'}
        </h1>
        {q && <p className="text-sm text-gray-500 mt-1">{results.length} {results.length === 1 ? 'product' : 'products'} found</p>}
      </div>

      {!q && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg">Type something in the search bar to get started</p>
        </div>
      )}

      {q && results.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-lg font-medium">No products found for "{q}"</p>
          <p className="text-sm mt-2">Try different keywords or browse our categories</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {results.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
