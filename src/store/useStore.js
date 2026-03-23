import { create } from 'zustand';

const useStore = create((set) => ({
  // State User
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),

  // State Cart
  cart: [],
  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item.id === product.id);
    if (existingItem) {
      return { cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),
  clearCart: () => set({ cart: [] }),

  // State Favorites
  favorites: [],
  toggleFavorite: (product) => set((state) => {
    const isFav = state.favorites.some(item => item.id === product.id);
    if (isFav) {
      return { favorites: state.favorites.filter(item => item.id !== product.id) };
    }
    return { favorites: [...state.favorites, product] };
  }),
}));

export default useStore;