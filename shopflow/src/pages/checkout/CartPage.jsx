import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart <span className="text-gray-400 font-normal text-lg">({items.reduce((s, i) => s + i.qty, 0)} items)</span></h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium">Clear cart</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-gray-50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.variant}</p>
                  </div>
                  <button onClick={() => removeItem(item.key)} className="text-gray-300 hover:text-red-400 transition-colors self-start ml-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQty(item.key, item.qty - 1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 font-medium">−</button>
                    <span className="px-4 py-1.5 text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 font-medium">+</button>
                  </div>
                  <span className="text-lg font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400">Add ₹{(499 - subtotal).toLocaleString()} more for free shipping</p>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
          </div>
          <Link to="/checkout" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold py-3 rounded-xl transition-colors mt-6">
            Proceed to Checkout
          </Link>
          <Link to="/products" className="block w-full text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-3 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
