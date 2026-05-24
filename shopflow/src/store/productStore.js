import { create } from 'zustand';
import seedProducts from '../data/products.json';

const STORAGE_KEY = 'shopflow_products';

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedProducts;
  } catch {
    return seedProducts;
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

const useProductStore = create((set, get) => ({
  products: loadProducts(),

  addProduct(product) {
    const newProduct = {
      ...product,
      id: `p_${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      images: [product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
      isNew: true,
      isFeatured: false,
    };
    const updated = [...get().products, newProduct];
    saveProducts(updated);
    set({ products: updated });
  },

  updateProduct(id, data) {
    const updated = get().products.map(p =>
      p.id === id ? { ...p, ...data, images: [data.imageUrl || p.images[0]] } : p
    );
    saveProducts(updated);
    set({ products: updated });
  },

  deleteProduct(id) {
    const updated = get().products.filter(p => p.id !== id);
    saveProducts(updated);
    set({ products: updated });
  },
}));

export default useProductStore;
