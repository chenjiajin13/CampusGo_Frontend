import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = { id: string; name: string; price: number; qty: number };
type CartCtx = {
  merchantId: number | null;
  items: CartItem[];
  total: number;
  setMerchant: (id: number | null) => void;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx>({
  merchantId: null, items: [], total: 0,
  setMerchant: () => {}, add: () => {}, remove: () => {}, clear: () => {}
});

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [merchantId, setMerchantId] = useState<number | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  const setMerchant = (id: number | null) => {
    setMerchantId(id);
    // 如果切换商家，清空购物车避免跨店下单
    if (id === null) setItems([]);
  };

  const add: CartCtx['add'] = (item, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
  };

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);

  const value = useMemo(() => ({
    merchantId, items, total,
    setMerchant, add, remove, clear
  }), [merchantId, items, total]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useCart = () => useContext(Ctx);
