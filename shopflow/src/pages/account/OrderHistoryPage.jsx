import { Link } from 'react-router-dom';
import useOrderStore from '../../store/orderStore';
import useAuthStore from '../../store/authStore';
import Badge from '../../components/ui/Badge';

export default function OrderHistoryPage() {
  const user = useAuthStore(s => s.user);
  const orders = useOrderStore(s => s.orders);
  const myOrders = orders.filter(o => o.customerId === user?.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      {myOrders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-medium">No orders yet</p>
          <Link to="/products" className="text-indigo-600 hover:underline text-sm mt-2 block">Start shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                  <p className="font-bold text-gray-900">{order.id}</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <Badge label={order.status} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-50" />
                    <div>
                      <p className="text-xs font-medium text-gray-800 line-clamp-1 max-w-[120px]">{item.name}</p>
                      <p className="text-xs text-gray-400">×{item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="text-sm text-gray-500">{order.shippingMethod}</div>
                <div className="font-bold text-gray-900">₹{order.total.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
