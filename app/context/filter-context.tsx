'use client';

import { createContext, useContext, useState } from 'react';

export interface QueryFilters {
  state: string;
  batch: string;
  branch: string;
  ageGroup: string;
  assessmentGrade: string;
  rehabilitationStatus: string;
  hiredEntity: string;
}

const defaultFilters: QueryFilters = {
  state: '',
  batch: '',
  branch: '',
  ageGroup: '',
  assessmentGrade: '',
  rehabilitationStatus: '',
  hiredEntity: '',
};

interface FilterContextType {
  filters: QueryFilters;
  setFilters: (filters: QueryFilters) => void;
}

const FilterContext = createContext<FilterContextType>({
  filters: defaultFilters,
  setFilters: () => {},
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<QueryFilters>(defaultFilters);
  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}