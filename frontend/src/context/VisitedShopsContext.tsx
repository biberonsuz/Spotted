import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getVisitedShops, toggleVisitedShop } from "../api/visitedShops";
import { useAuth } from "./AuthContext";

type VisitedShopsContextValue = {
  visitedIds: Set<number>;
  toggleVisited: (shopId: number) => Promise<void>;
  reload: () => Promise<void>;
};

const VisitedShopsContext = createContext<VisitedShopsContextValue | undefined>(undefined);

export function VisitedShopsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [visitedIds, setVisitedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) {
      setVisitedIds(new Set());
      return;
    }

    void reloadVisited();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const reloadVisited = async () => {
    if (!user) return;
    const data = await getVisitedShops();
    setVisitedIds(new Set(data.map((entry) => entry.id)));
  };

  const toggleVisited = async (shopId: number) => {
    const result = await toggleVisitedShop(shopId);
    setVisitedIds((prev) => {
      const next = new Set(prev);
      if (result.visited) {
        next.add(shopId);
      } else {
        next.delete(shopId);
      }
      return next;
    });
  };

  return (
    <VisitedShopsContext.Provider
      value={{
        visitedIds,
        toggleVisited,
        reload: reloadVisited,
      }}
    >
      {children}
    </VisitedShopsContext.Provider>
  );
}

export function useVisitedShops() {
  const ctx = useContext(VisitedShopsContext);
  if (!ctx) {
    throw new Error("useVisitedShops must be used within a VisitedShopsProvider");
  }
  return ctx;
}

