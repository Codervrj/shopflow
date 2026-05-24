import customers from '../../data/customers.json';
import Badge from '../../components/ui/Badge';

export default function CustomersAdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">{customers.length} registered users</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4 hidden sm:table-cell">Email</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Joined</th>
                <th className="text-left px-6 py-4 hidden lg:table-cell">Addresses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 overflow-hidden flex-shrink-0">
                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                        {c.name[0]}
                      </div>
                      <span className="font-medium text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-gray-500">{c.email}</td>
                  <td className="px-6 py-4"><Badge label={c.role} /></td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-500">{new Date(c.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-500">{c.savedAddresses?.length || 0} saved</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
