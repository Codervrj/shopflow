import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import useCartStore from '../../store/cartStore';
import useToastStore from '../../store/toastStore';
import StarRating from '../../components/ui/StarRating';
import ProductCard from '../../components/ui/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const products = useProductStore(s => s.products);
  const product = products.find(p => p.id === id);
  const addItem = useCartStore(s => s.addItem);
  const showToast = useToastStore(s => s.show);
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState(product?.variants?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.variants?.sizes?.[0] || '');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-bold text-gray-400 mb-4">Product not found</p>
        <Link to="/products" className="text-indigo-600 hover:underline">← Back to Products</Link>
      </div>
    );
  }

  const variantKey = selectedSize ? `${selectedSize}-${selectedColor}` : selectedColor;
  const stockQty = product.stock?.[variantKey] ?? product.stock?.[selectedColor] ?? 10;
  const inStock = stockQty > 0;

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function handleAddToCart() {
    const variant = [selectedSize, selectedColor].filter(Boolean).join(' / ') || 'Default';
    addItem(product, variant, qty);
    showToast(`${product.name} added to cart`, 'success');
  }

  function handleBuyNow() {
    const variant = [selectedSize, selectedColor].filter(Boolean).join(' / ') || 'Default';
    addItem(product, variant, qty);
    navigate('/checkout');
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600 transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
            <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-indigo-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="text-sm font-medium text-indigo-600">{product.category}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={product.rating} count={product.reviewCount} size="md" />
            {product.isNew && <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">New</span>}
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-gray-900">₹{product.price.toLocaleString()}</span>
            {discount && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded-full">{discount}% off</span>
              </>
            )}
          </div>

          {/* Colors */}
          {product.variants?.colors?.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">Color: <span className="font-normal text-gray-500">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${selectedColor === c ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.variants?.sizes?.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">Size: <span className="font-normal text-gray-500">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 rounded-lg border text-sm font-medium transition-all ${selectedSize === s ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Stock */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-gray-500 hover:bg-gray-50 text-lg font-medium">−</button>
              <span className="px-5 py-2 text-base font-semibold">{qty}</span>
              <button onClick={() => setQty(q => Math.min(stockQty, q + 1))} className="px-4 py-2 text-gray-500 hover:bg-gray-50 text-lg font-medium">+</button>
            </div>
            <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              {inStock ? `${stockQty} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 border-2 border-indigo-600 text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Product Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Delivery info */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: '🚚', text: 'Free delivery' },
              { icon: '🔒', text: 'Secure payment' },
              { icon: '↩️', text: '30-day returns' },
            ].map(b => (
              <div key={b.text} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xl mb-1">{b.icon}</div>
                <p className="text-xs text-gray-600 font-medium">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
