import { useState } from 'react';
import useOrderStore from '../../store/orderStore';
import useToastStore from '../../store/toastStore';
import Badge from '../../components/ui/Badge';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersAdminPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const showToast = useToastStore(s => s.show);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = orders
    .filter(o => filter === 'All' || o.status === filter)
    .filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  function handleStatusChange(id, status) {
    updateOrderStatus(id, status);
    showToast(`Order ${id} updated to ${status}`, 'success');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} orders total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
          >{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full sm:w-80 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-4">Order ID</th>
                <th className="text-left px-6 py-4 hidden sm:table-cell">Customer</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Date</th>
                <th className="text-left px-6 py-4">Total</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900 text-xs">{order.id}</td>
                  <td className="px-6 py-4 hidden sm:table-cell text-gray-700">{order.customerName}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">₹{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4"><Badge label={order.status} /></td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
