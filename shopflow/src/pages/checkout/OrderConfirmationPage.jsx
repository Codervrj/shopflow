import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useOrderStore from '../../store/orderStore';
import useToastStore from '../../store/toastStore';
import useAuthStore from '../../store/authStore';
import Badge from '../../components/ui/Badge';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const orders = useOrderStore(s => s.orders);
  const showToast = useToastStore(s => s.show);
  const user = useAuthStore(s => s.user);
  const order = orders.find(o => o.id === id);

  useEffect(() => {
    if (user?.email) {
      showToast(`Email confirmation sent to ${user.email}`, 'info');
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold text-gray-700 mb-4">Order not found.</p>
        <Link to="/" className="text-indigo-600 hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500">Thank you for your purchase. Your order has been placed successfully.</p>
      </div>

      {/* Order Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
            <p className="text-lg font-bold text-gray-900">{order.id}</p>
          </div>
          <Badge label={order.status} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Date</p>
            <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Shipping</p>
            <p className="font-medium text-gray-900">{order.shippingMethod}</p>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg bg-gray-50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.variant} × {item.qty}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 flex-shrink-0">₹{(item.price * item.qty).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span>₹{order.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
        <p className="text-sm text-gray-700 font-medium">{order.address.name}</p>
        <p className="text-sm text-gray-600">{order.address.line1}</p>
        <p className="text-sm text-gray-600">{order.address.city}, {order.address.state} — {order.address.pincode}</p>
        <p className="text-sm text-gray-600">📱 {order.address.phone}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/account/orders" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold py-3 rounded-xl transition-colors">
          Track Order
        </Link>
        <Link to="/products" className="flex-1 border-2 border-gray-200 text-gray-700 text-center font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
