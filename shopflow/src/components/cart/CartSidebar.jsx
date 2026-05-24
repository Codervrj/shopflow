import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty } = useCartStore();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={closeCart} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.key} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(item.key, item.qty - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm">−</button>
                        <span className="px-3 py-1 text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, item.qty + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm">+</button>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.key)} className="text-gray-300 hover:text-red-400 transition-colors self-start">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex justify-between mb-4">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-base font-bold text-gray-900">₹{total.toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold py-3 rounded-xl transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeCart}
              className="block w-full text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-3 transition-colors"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
