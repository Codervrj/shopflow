import { create } from 'zustand';
import customers from '../data/customers.json';

const STORAGE_KEY = 'shopflow_auth';

function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
}

function saveAuth(user, token) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
}

const { user: savedUser, token: savedToken } = loadAuth();

const useAuthStore = create((set, get) => ({
  user: savedUser,
  token: savedToken,
  registeredUsers: customers,

  login(email, password) {
    const allUsers = get().registeredUsers;
    const found = allUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: 'Invalid email or password.' };
    const { password: _pw, ...safeUser } = found;
    const token = `mock_jwt_${Math.random().toString(36).slice(2)}`;
    saveAuth(safeUser, token);
    set({ user: safeUser, token });
    return { success: true };
  },

  register(name, email, password) {
    const allUsers = get().registeredUsers;
    if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: `c_${Date.now()}`,
      name,
      email,
      password,
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      joinedAt: new Date().toISOString().split('T')[0],
      savedAddresses: [],
    };
    const updated = [...allUsers, newUser];
    const { password: _pw, ...safeUser } = newUser;
    const token = `mock_jwt_${Math.random().toString(36).slice(2)}`;
    saveAuth(safeUser, token);
    set({ user: safeUser, token, registeredUsers: updated });
    return { success: true };
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, token: null });
  },

  saveAddress(address) {
    const user = get().user;
    if (!user) return;
    const existing = user.savedAddresses || [];
    const updated = address.id
      ? existing.map(a => a.id === address.id ? address : a)
      : [...existing, { ...address, id: `addr_${Date.now()}` }];
    const updatedUser = { ...user, savedAddresses: updated };
    saveAuth(updatedUser, get().token);
    set({ user: updatedUser });
  },

  deleteAddress(id) {
    const user = get().user;
    if (!user) return;
    const updated = (user.savedAddresses || []).filter(a => a.id !== id);
    const updatedUser = { ...user, savedAddresses: updated };
    saveAuth(updatedUser, get().token);
    set({ user: updatedUser });
  },
}));

export default useAuthStore;
