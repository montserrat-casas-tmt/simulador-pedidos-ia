import React from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import { ProductSuggestion } from '../types';

interface ProductCardProps {
  suggestion: ProductSuggestion;
  onQuantityChange: (id: string, quantity: number) => void;
  onToggleSelect: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  suggestion, 
  onQuantityChange,
  onToggleSelect
}) => {
  const { product, suggestedQuantity, selected } = suggestion;
  
  const handleIncrement = () => {
    onQuantityChange(product.id, suggestedQuantity + 1);
  };
  
  const handleDecrement = () => {
    if (suggestedQuantity > 1) {
      onQuantityChange(product.id, suggestedQuantity - 1);
    }
  };
  
  const totalPrice = product.price * suggestedQuantity;
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
      selected ? 'ring-2 ring-[#0F52BA]' : 'hover:shadow-lg'
    }`}>
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)} <span className="text-xs font-normal">per {product.unit}</span>
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDecrement}
              disabled={suggestedQuantity <= 1}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                suggestedQuantity <= 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Minus size={16} />
            </button>
            
            <input
              type="number"
              min="1"
              value={suggestedQuantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1) {
                  onQuantityChange(product.id, value);
                }
              }}
              className="w-16 text-center border rounded p-1"
            />
            
            <button 
              onClick={handleIncrement}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button
            onClick={() => onToggleSelect(product.id)}
            className={`flex items-center justify-center rounded-md px-3 py-1 transition-colors ${
              selected
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-[#0F52BA] text-white hover:bg-[#0D47A1]'
            }`}
          >
            {selected ? (
              <>
                <Check size={16} className="mr-1" />
                <span>Selected</span>
              </>
            ) : (
              'Select'
            )}
          </button>
        </div>
        
        <div className="mt-3 text-right">
          <span className="text-sm font-semibold text-gray-700">
            Total: ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;