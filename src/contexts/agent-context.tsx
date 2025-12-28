
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAgentStore } from '@/hooks/use-agent-store';
import type { StoreApi } from 'zustand';

// Since useAgentStore returns the whole store instance, we can type the context with it.
// We use ReturnType to get the type of what the hook returns.
type AgentStoreType = ReturnType<typeof useAgentStore>;

const AgentContext = createContext<AgentStoreType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  // The useAgentStore hook itself provides the state management.
  // We can just pass down the store instance via context.
  const store = useAgentStore();

  return (
    <AgentContext.Provider value={store}>
      {children}
    </AgentContext.Provider>
  );
}

// Custom hook for consuming the agent context
export function useAgent(): AgentStoreType {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}
