import React from 'react';
import { Filter, Clock } from 'lucide-react';
import { RecipeFilter } from '../types/Recipe';
import { categories } from '../data/recipes';

interface FilterBarProps {
  filter: RecipeFilter;
  onFilterChange: (filter: RecipeFilter) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, onFilterChange }) => {
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6 overflow-x-auto pb-2">
          <div className="flex items-center space-x-2 text-gray-700 whitespace-nowrap">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters:</span>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={filter.category}
              onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Difficulty:</label>
            <select
              value={filter.difficulty}
              onChange={(e) => onFilterChange({ ...filter, difficulty: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Max Time:</label>
            <input
              type="range"
              min="10"
              max="180"
              step="10"
              value={filter.maxTime}
              onChange={(e) => onFilterChange({ ...filter, maxTime: parseInt(e.target.value) })}
              className="w-20"
            />
            <span className="text-sm text-gray-600 min-w-[3rem]">{filter.maxTime}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;