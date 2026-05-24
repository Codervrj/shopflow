import analytics from '../../data/analytics.json';

function StatCard({ title, value, sub, icon, trend }) {
  return (
    <div className="bg-white border border-gray-100 p-6 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-widest">{title}</p>
        <div className="text-gray-300">{icon}</div>
      </div>
      <p className="font-serif text-3xl text-gray-900 font-normal">{value}</p>
      {sub && <p className="text-xs font-sans text-emerald-600 mt-2">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const maxRevenue = Math.max(...analytics.dailyRevenue.map(d => d.revenue));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Showcase notice */}
      <div className="mb-8 border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-sans font-semibold text-amber-800">Showcase Mode</p>
          <p className="text-xs font-sans text-amber-700 mt-0.5 leading-relaxed">
            All data shown here is for demonstration purposes only. Charts, orders, customers, and analytics are simulated.
            We can connect this dashboard to your live backend and real data — fully dynamic and production-ready.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-gray-900 font-normal">Dashboard</h1>
          <p className="text-sm font-sans text-gray-400 mt-1">Overview for November 2024</p>
        </div>
        <span className="text-xs font-sans text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5">Demo Data</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${(analytics.totalRevenue / 100000).toFixed(1)}L`}
          sub={`↑ ${analytics.revenueGrowth}% from last month`}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Orders Today"
          value={analytics.ordersToday}
          sub="↑ 3 from yesterday"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <StatCard
          title="This Month"
          value={analytics.ordersThisMonth}
          sub="orders placed"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <StatCard
          title="Customers"
          value={analytics.totalCustomers.toLocaleString()}
          sub="registered users"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-lg text-gray-900 font-normal">Revenue — Last 30 Days</h2>
            <span className="text-xs font-sans text-gray-400">Simulated data</span>
          </div>
          <div className="flex items-end gap-1 h-36">
            {analytics.dailyRevenue.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gray-900 hover:bg-gray-600 transition-colors cursor-pointer"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                  title={`₹${d.revenue.toLocaleString()}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs font-sans text-gray-300">
            <span>Oct 22</span>
            <span>Nov 20</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-serif text-lg text-gray-900 font-normal mb-5">By Category</h2>
          <div className="space-y-4">
            {analytics.categoryBreakdown.map(cat => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm font-sans mb-1.5">
                  <span className="text-gray-600">{cat.category}</span>
                  <span className="font-semibold text-gray-900">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5">
                  <div className="bg-gray-900 h-1.5 transition-all" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-serif text-lg text-gray-900 font-normal mb-5">Top Selling Products</h2>
          <div className="divide-y divide-gray-50">
            {analytics.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <span className="w-6 text-center text-xs font-sans font-semibold text-gray-300">0{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-sans font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs font-sans text-gray-400">{p.sales} units sold</p>
                </div>
                <span className="text-sm font-sans font-semibold text-gray-900">₹{(p.revenue / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-serif text-lg text-gray-900 font-normal mb-5">Recent Activity</h2>
          <div className="divide-y divide-gray-50">
            {analytics.recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3 items-start py-3">
                <div className={`w-7 h-7 border flex items-center justify-center flex-shrink-0 ${a.type === 'order' ? 'border-gray-200 text-gray-400' : 'border-emerald-200 text-emerald-500'}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {a.type === 'order'
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-sans text-gray-700">{a.message}</p>
                  <p className="text-xs font-sans text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
