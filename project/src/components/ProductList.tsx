import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import { ProductCategory, ProductSuggestion } from '../types';

interface ProductListProps {
  suggestions: ProductSuggestion[];
  onQuantityChange: (id: string, quantity: number) => void;
  onToggleSelect: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  suggestions, 
  onQuantityChange,
  onToggleSelect
}) => {
  const [activeFilter, setActiveFilter] = useState<ProductCategory | 'All'>('All');
  
  const filteredSuggestions = activeFilter === 'All' 
    ? suggestions 
    : suggestions.filter(s => s.product.category === activeFilter);
  
  // Get unique categories from suggestions
  const categories = ['All', ...Array.from(
    new Set(suggestions.map(s => s.product.category))
  )] as (ProductCategory | 'All')[];
  
  return (
    <div className="my-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Suggested Products ({suggestions.length})
        </h2>
        
        <div className="flex items-center space-x-1">
          <Filter size={16} className="text-gray-500 mr-1" />
          <div className="flex flex-wrap gap-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeFilter === category
                    ? 'bg-[#0F52BA] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredSuggestions.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">No products found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuggestions.map(suggestion => (
            <ProductCard
              key={suggestion.product.id}
              suggestion={suggestion}
              onQuantityChange={onQuantityChange}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;