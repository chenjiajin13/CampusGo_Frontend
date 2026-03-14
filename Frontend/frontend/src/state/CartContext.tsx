import React, { createContext, useContext, useMemo, useState } from 'react';
import { CartItemDTO, CartSummaryDTO } from '../types/api';

type CartCtx = {
  merchantId: number | null;
  items: CartItemDTO[];
  totalQuantity: number;
  totalCents: number;
  setSummary: (summary: CartSummaryDTO | null) => void;
  reset: () => void;
};

const emptyCart: CartSummaryDTO = {
  merchantId: null,
  items: [],
  totalQuantity: 0,
  totalCents: 0,
};

const Ctx = createContext<CartCtx>({
  merchantId: null,
  items: [],
  totalQuantity: 0,
  totalCents: 0,
  setSummary: () => {},
  reset: () => {},
});

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [summary, setSummaryState] = useState<CartSummaryDTO>(emptyCart);

  const setSummary = (next: CartSummaryDTO | null) => {
    setSummaryState(next ?? emptyCart);
  };

  const reset = () => setSummaryState(emptyCart);

  const value = useMemo(
    () => ({
      merchantId: summary.merchantId,
      items: summary.items,
      totalQuantity: summary.totalQuantity,
      totalCents: summary.totalCents,
      setSummary,
      reset,
    }),
    [summary]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useCart = () => useContext(Ctx);
