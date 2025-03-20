import { useState, useCallback } from 'react';

interface UseServerSelectionReturn {
  selectedServerIds: number[];
  handleServerSelection: (serverIds: number[]) => void;
}

export const useServerSelection = (initialServerIds: number[] = []): UseServerSelectionReturn => {
  const [selectedServerIds, setSelectedServerIds] = useState<number[]>(initialServerIds);

  const handleServerSelection = useCallback((serverIds: number[]) => {
    setSelectedServerIds(serverIds);
  }, []);

  return {
    selectedServerIds,
    handleServerSelection,
  };
};
