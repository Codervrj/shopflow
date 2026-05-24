import { create } from 'zustand';

const STORAGE_KEY = 'shopflow_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const useCartStore = create((set, get) => ({
  items: loadCart(),
  isOpen: false,

  addItem(product, variant, qty = 1) {
    const key = `${product.id}-${variant}`;
    const items = get().items;
    const existing = items.find(i => i.key === key);
    let updated;
    if (existing) {
      updated = items.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
    } else {
      updated = [...items, {
        key,
        productId: product.id,
        name: product.name,
        variant,
        price: product.price,
        image: product.images[0],
        qty,
      }];
    }
    saveCart(updated);
    set({ items: updated, isOpen: true });
  },

  removeItem(key) {
    const updated = get().items.filter(i => i.key !== key);
    saveCart(updated);
    set({ items: updated });
  },

  updateQty(key, qty) {
    if (qty < 1) return;
    const updated = get().items.map(i => i.key === key ? { ...i, qty } : i);
    saveCart(updated);
    set({ items: updated });
  },

  clearCart() {
    saveCart([]);
    set({ items: [] });
  },

  toggleCart() {
    set(s => ({ isOpen: !s.isOpen }));
  },

  closeCart() {
    set({ isOpen: false });
  },

  get total() {
    return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  get count() {
    return get().items.reduce((sum, i) => sum + i.qty, 0);
  },
}));

export default useCartStore;
