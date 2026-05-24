import { useState } from 'react';
import useProductStore from '../../store/productStore';
import useToastStore from '../../store/toastStore';
import Modal from '../../components/ui/Modal';

const EMPTY = { name: '', category: 'Electronics', price: '', originalPrice: '', description: '', imageUrl: '' };
const CATEGORIES = ['Electronics', 'Clothing', 'Home & Living', 'Sports', 'Books'];

export default function ProductsAdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const showToast = useToastStore(s => s.show);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(p) {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: p.price, originalPrice: p.originalPrice || '', description: p.description, imageUrl: p.images?.[0] || '' });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name || !form.price) { showToast('Name and price are required', 'error'); return; }
    if (editing) {
      updateProduct(editing.id, { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) || Number(form.price) });
      showToast('Product updated', 'success');
    } else {
      addProduct({ ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) || Number(form.price) });
      showToast('Product added', 'success');
    }
    setModalOpen(false);
  }

  function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    deleteProduct(id);
    showToast('Product deleted', 'info');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full sm:w-72 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-6 py-4 hidden sm:table-cell">Category</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Rating</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-gray-50 flex-shrink-0" />
                      <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-gray-500">{p.category}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">₹{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-500">{p.rating}★ ({p.reviewCount})</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(p)} className="text-indigo-600 hover:text-indigo-700 font-medium text-xs transition-colors">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 font-medium text-xs transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="999" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="1299" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL</label>
            <input type="text" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Product description..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
            <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
              {editing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
