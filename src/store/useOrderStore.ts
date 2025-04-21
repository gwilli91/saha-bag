
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BagCategory, Order } from '@/types';

interface OrderState {
  orders: Order[];
  categories: BagCategory[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Order) => void;
  deleteOrder: (id: string) => void;
  deleteAllOrders: () => void;
  toggleDelivered: (id: string) => void;
  addCategory: (category: BagCategory) => void;
  deleteCategory: (id: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      categories: [
        { id: '1', name: 'حقيبة عادية', price: 800 },
        { id: '2', name: 'حقيبة فاخرة', price: 1200 },
        { id: '3', name: 'حقيبة صغيرة', price: 500 }
      ],
      addOrder: (order) => set((state) => ({ 
        orders: [...state.orders, order] 
      })),
      updateOrder: (id, updatedOrder) => set((state) => ({
        orders: state.orders.map((order) => 
          order.id === id ? updatedOrder : order
        )
      })),
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter((order) => order.id !== id)
      })),
      deleteAllOrders: () => set({ orders: [] }),
      toggleDelivered: (id) => set((state) => ({
        orders: state.orders.map((order) => 
          order.id === id ? { ...order, delivered: !order.delivered } : order
        )
      })),
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((category) => category.id !== id)
      })),
    }),
    {
      name: 'orders-storage'
    }
  )
);
