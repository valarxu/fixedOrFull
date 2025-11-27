import React from 'react';
import { COINS, EMA_PERIODS, MODES, YEARS, type FilterOptions } from '../types/trading';

interface FilterTabsProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterTabs({ filters, onFilterChange }: FilterTabsProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const FilterTab = ({ 
    title, 
    options, 
    selectedValue, 
    onChange 
  }: { 
    title: string; 
    options: readonly string[]; 
    selectedValue: string; 
    onChange: (value: string) => void; 
  }) => (
    <div className="flex flex-col space-y-2">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedValue === option
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">筛选条件</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FilterTab
          title="币种"
          options={COINS}
          selectedValue={filters.coin}
          onChange={(value) => handleFilterChange('coin', value)}
        />
        <FilterTab
          title="EMA周期"
          options={EMA_PERIODS}
          selectedValue={filters.emaPeriod}
          onChange={(value) => handleFilterChange('emaPeriod', value)}
        />
        <FilterTab
          title="年份"
          options={YEARS}
          selectedValue={filters.year}
          onChange={(value) => handleFilterChange('year', value)}
        />
        <FilterTab
          title="模式"
          options={MODES}
          selectedValue={filters.mode}
          onChange={(value) => handleFilterChange('mode', value)}
        />
      </div>
    </div>
  );
}