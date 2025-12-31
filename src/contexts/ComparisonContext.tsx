import { createContext, useContext, useState, ReactNode } from 'react';
import { Property } from '@/data/properties';

interface ComparisonContextType {
  comparisonList: Property[];
  addToComparison: (property: Property) => void;
  removeFromComparison: (propertyId: string) => void;
  isInComparison: (propertyId: string) => boolean;
  clearComparison: () => void;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [comparisonList, setComparisonList] = useState<Property[]>([]);
  const maxItems = 4;

  const addToComparison = (property: Property) => {
    if (comparisonList.length < maxItems && !isInComparison(property.id)) {
      setComparisonList([...comparisonList, property]);
    }
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonList(comparisonList.filter(p => p.id !== propertyId));
  };

  const isInComparison = (propertyId: string) => {
    return comparisonList.some(p => p.id === propertyId);
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  return (
    <ComparisonContext.Provider value={{
      comparisonList,
      addToComparison,
      removeFromComparison,
      isInComparison,
      clearComparison,
      maxItems,
    }}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
