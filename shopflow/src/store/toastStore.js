import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toasts: [],

  show(message, type = 'success', duration = 3500) {
    const id = Date.now();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, duration);
  },

  remove(id) {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
  },
}));

export default useToastStore;
