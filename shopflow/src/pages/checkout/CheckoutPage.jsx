import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import useOrderStore from '../../store/orderStore';
import useToastStore from '../../store/toastStore';

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', desc: '5–7 business days', price: 0 },
  { id: 'express', label: 'Express Delivery', desc: '2–3 business days', price: 99 },
  { id: 'overnight', label: 'Overnight Delivery', desc: 'Next business day', price: 249 },
];

const steps = ['Address', 'Shipping', 'Payment'];

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-colors ${i + 1 <= step ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            {i + 1 < step ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : i + 1}
          </div>
          <span className={`ml-2 text-sm font-medium hidden sm:block ${i + 1 <= step ? 'text-indigo-600' : 'text-gray-400'}`}>{s}</span>
          {i < steps.length - 1 && <div className={`w-12 sm:w-24 h-0.5 mx-3 ${i + 1 < step ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const placeOrder = useOrderStore(s => s.placeOrder);
  const showToast = useToastStore(s => s.show);

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: '',
    line1: user?.savedAddresses?.[0]?.line1 || '',
    city: user?.savedAddresses?.[0]?.city || '',
    state: user?.savedAddresses?.[0]?.state || '',
    pincode: user?.savedAddresses?.[0]?.pincode || '',
  });
  const [shipping, setShipping] = useState('standard');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [paying, setPaying] = useState(false);
  const [errors, setErrors] = useState({});

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = SHIPPING_OPTIONS.find(o => o.id === shipping)?.price ?? 0;
  const total = subtotal + shippingCost;
  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shipping);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-indigo-600 hover:underline">Shop Now</Link>
      </div>
    );
  }

  function validateAddress() {
    const e = {};
    if (!address.name.trim()) e.name = 'Required';
    if (!address.phone.match(/^[0-9]{10}$/)) e.phone = 'Enter valid 10-digit number';
    if (!address.line1.trim()) e.line1 = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.state.trim()) e.state = 'Required';
    if (!address.pincode.match(/^[0-9]{6}$/)) e.pincode = 'Enter valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePlaceOrder() {
    setPaying(true);
    setTimeout(() => {
      const orderId = placeOrder({
        items,
        total,
        address,
        shippingMethod: selectedShipping.label,
        user,
      });
      clearCart();
      showToast(`Email confirmation sent to ${user?.email || 'your email'}`, 'info');
      navigate(`/order-confirmation/${orderId}`);
    }, 2000);
  }

  const inputClass = (field) =>
    `w-full border ${errors[field] ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <StepBar step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'John Doe', colSpan: false },
                  { key: 'phone', label: 'Phone Number', placeholder: '10-digit number', colSpan: false },
                  { key: 'line1', label: 'Address Line', placeholder: 'Street, Area, Landmark', colSpan: true },
                  { key: 'city', label: 'City', placeholder: 'Mumbai', colSpan: false },
                  { key: 'state', label: 'State', placeholder: 'Maharashtra', colSpan: false },
                  { key: 'pincode', label: 'Pincode', placeholder: '400001', colSpan: false },
                ].map(f => (
                  <div key={f.key} className={f.colSpan ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                    <input
                      type="text"
                      value={address[f.key]}
                      onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className={inputClass(f.key)}
                    />
                    {errors[f.key] && <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { if (validateAddress()) setStep(2); }}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Shipping Method</h2>
              <div className="space-y-3">
                {SHIPPING_OPTIONS.map(opt => (
                  <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${shipping === opt.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} className="accent-indigo-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{opt.label}</p>
                      <p className="text-sm text-gray-500">{opt.desc}</p>
                    </div>
                    <span className="font-semibold text-gray-900">{opt.price === 0 ? <span className="text-green-600">Free</span> : `₹${opt.price}`}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">Continue to Payment</button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-gray-900">Payment</h2>
                <div className="flex gap-2 ml-auto">
                  {['VISA', 'MC', 'UPI'].map(b => (
                    <span key={b} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold">{b}</span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-10 translate-x-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 translate-y-10 -translate-x-10" />
                <p className="text-xs text-indigo-200 mb-1">Card Number</p>
                <p className="text-xl font-mono tracking-widest">{card.number ? card.number.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}</p>
                <div className="flex justify-between mt-4">
                  <div>
                    <p className="text-xs text-indigo-200">Card Holder</p>
                    <p className="font-semibold">{card.name || 'YOUR NAME'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200">Expires</p>
                    <p className="font-semibold">{card.expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={card.number}
                    onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g, '') }))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-wider"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={card.name}
                    onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={card.expiry}
                    onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))}
                    placeholder="MM/YY"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={card.cvv}
                    onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '') }))}
                    placeholder="•••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                Demo mode — any card details are accepted, no real charge.
              </p>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={paying}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {paying ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Processing...
                    </>
                  ) : `Pay ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
          <h2 className="text-base font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.key} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 line-clamp-2">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.variant} × {item.qty}</p>
                </div>
                <p className="text-xs font-semibold text-gray-900 flex-shrink-0">₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : `₹${shippingCost}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
