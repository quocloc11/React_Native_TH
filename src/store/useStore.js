import { create } from 'zustand';

const useStore = create((set) => ({
  cart: [],
  favorites: [],
  orders: [],

  // Giỏ hàng
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return { cart: state.cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) };
    }
    return { cart: [...state.cart, { ...product, qty: 1 }] };
  }),
  updateCartQty: (productId, delta) => set((state) => ({
    cart: state.cart.map(item =>
      item.id === productId ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ).filter(i => i.qty > 0)
  })),

  // Yêu thích
  toggleFavorite: (product) => set((state) => {
    const isFav = state.favorites.some(f => f.id === product.id);
    return { favorites: isFav ? state.favorites.filter(f => f.id !== product.id) : [...state.favorites, product] };
  }),

  // Đặt hàng
  placeOrder: (order) => set((state) => ({
    orders: [order, ...state.orders],
    cart: []
  })),
}));

export default useStore;