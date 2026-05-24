import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';
import Modal from '../../components/ui/Modal';

const EMPTY_FORM = { label: '', name: '', phone: '', line1: '', city: '', state: '', pincode: '' };

export default function SavedAddressesPage() {
  const { user, saveAddress, deleteAddress } = useAuthStore();
  const showToast = useToastStore(s => s.show);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const addresses = user?.savedAddresses || [];

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); }
  function openEdit(addr) { setEditing(addr); setForm({ ...addr }); setModalOpen(true); }

  function handleSave() {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      showToast('Please fill all fields', 'error'); return;
    }
    saveAddress(editing ? { ...form, id: editing.id } : form);
    showToast(editing ? 'Address updated' : 'Address saved', 'success');
    setModalOpen(false);
  }

  function handleDelete(id) {
    deleteAddress(id);
    showToast('Address removed', 'info');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
        <button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          + Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📍</div>
          <p className="text-lg font-medium">No saved addresses</p>
          <button onClick={openAdd} className="text-indigo-600 hover:underline text-sm mt-2">Add your first address →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between mb-3">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{addr.label || 'Home'}</span>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(addr)} className="text-xs text-gray-500 hover:text-indigo-600 transition-colors font-medium">Edit</button>
                  <button onClick={() => handleDelete(addr.id)} className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium">Delete</button>
                </div>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{addr.name}</p>
              <p className="text-sm text-gray-600 mt-1">{addr.line1}</p>
              <p className="text-sm text-gray-600">{addr.city}, {addr.state} — {addr.pincode}</p>
              <p className="text-sm text-gray-500 mt-1">📱 {addr.phone}</p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Address' : 'Add New Address'}>
        <div className="space-y-4">
          {[
            { key: 'label', label: 'Label (e.g. Home, Office)', placeholder: 'Home' },
            { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
            { key: 'phone', label: 'Phone', placeholder: '10-digit number' },
            { key: 'line1', label: 'Address Line', placeholder: 'Street, Area, Landmark' },
            { key: 'city', label: 'City', placeholder: 'Mumbai' },
            { key: 'state', label: 'State', placeholder: 'Maharashtra' },
            { key: 'pincode', label: 'Pincode', placeholder: '400001' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
              <input
                type="text"
                value={form[f.key]}
                onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
            <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
              {editing ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
