import { create } from 'zustand';
import seedOrders from '../data/orders.json';

const STORAGE_KEY = 'shopflow_orders';

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedOrders;
  } catch {
    return seedOrders;
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

const useOrderStore = create((set, get) => ({
  orders: loadOrders(),

  placeOrder({ items, total, address, shippingMethod, user }) {
    const id = `ORD-${String(Date.now()).slice(-6)}`;
    const newOrder = {
      id,
      customerId: user?.id || 'guest',
      customerName: user?.name || 'Guest',
      items: items.map(i => ({
        productId: i.productId,
        name: i.name,
        variant: i.variant,
        price: i.price,
        qty: i.qty,
        image: i.image,
      })),
      total,
      address,
      shippingMethod,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...get().orders];
    saveOrders(updated);
    set({ orders: updated });
    return id;
  },

  updateOrderStatus(id, status) {
    const updated = get().orders.map(o =>
      o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );
    saveOrders(updated);
    set({ orders: updated });
  },

  getOrdersByCustomer(customerId) {
    return get().orders.filter(o => o.customerId === customerId);
  },
}));

export default useOrderStore;
