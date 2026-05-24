import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import useCartStore from '../../store/cartStore';
import useToastStore from '../../store/toastStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const showToast = useToastStore(s => s.show);
  const navigate = useNavigate();

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function handleCardClick() {
    navigate(`/products/${product.id}`);
  }

  function handleAddToCart(e) {
    e.stopPropagation();
    const variant = product.variants?.colors?.[0] || product.variants?.sizes?.[0] || 'Default';
    addItem(product, variant, 1);
    showToast(`${product.name} added to cart`, 'success');
  }

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-white border border-gray-100 hover:border-gray-300 transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-gray-900 text-white text-[10px] font-sans font-semibold px-2 py-0.5 uppercase tracking-widest">New</span>
          )}
          {discount && (
            <span className="bg-red-600 text-white text-[10px] font-sans font-semibold px-2 py-0.5">−{discount}%</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-white text-gray-900 text-xs font-sans font-semibold px-3 py-1.5 border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          Add to Cart
        </button>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-sans font-semibold text-gray-400 uppercase tracking-widest mb-1.5">{product.category}</p>
        <h3 className="font-serif text-gray-900 text-base font-normal leading-snug line-clamp-2 mb-2 group-hover:text-gray-600 transition-colors">{product.name}</h3>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="flex items-baseline gap-2 mt-2.5">
          <span className="font-sans text-base font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
          {discount && (
            <span className="text-xs font-sans text-gray-300 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
