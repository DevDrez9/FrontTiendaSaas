import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl?: string;
  cantidad: number;
}

interface CartState {
  tiendaId: number | null;
  items: CartItem[];
  addToCart: (tiendaId: number, item: Omit<CartItem, 'cantidad'>, cantidadAAgregar?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tiendaId: null,
      items: [],
      addToCart: (tiendaId, newItem, cantidadAAgregar = 1) => {
        set((state) => {
          // Si el usuario intenta comprar en una tienda diferente, limpiamos el carrito
          if (state.tiendaId !== null && state.tiendaId !== tiendaId) {
            return { tiendaId, items: [{ ...newItem, cantidad: cantidadAAgregar }] };
          }

          const existingItem = state.items.find(item => item.id === newItem.id);
          if (existingItem) {
            return {
              tiendaId,
              items: state.items.map(item =>
                item.id === newItem.id
                  ? { ...item, cantidad: item.cantidad + cantidadAAgregar }
                  : item
              )
            };
          }
          return { tiendaId, items: [...state.items, { ...newItem, cantidad: cantidadAAgregar }] };
        });
      },
      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },
      updateQuantity: (itemId, cantidad) => {
        if (cantidad <= 0) return get().removeFromCart(itemId);
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, cantidad } : item
          )
        }));
      },
      clearCart: () => {
        set({ items: [], tiendaId: null });
      },
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
      }
    }),
    {
      name: 'saas-cart-storage',
    }
  )
);
