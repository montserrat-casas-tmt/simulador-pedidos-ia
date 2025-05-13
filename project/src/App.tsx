import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ProductList from './components/ProductList';
import OrderSummary from './components/OrderSummary';
import OrderConfirmation from './components/OrderConfirmation';
import { interpretRequirement } from './utils/languageProcessor';
import { generateOrder, saveOrderToHistory } from './utils/orderGenerator';
import { ProductSuggestion, Order } from './types';

function App() {
  const [customerName, setCustomerName] = useState('');
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const handleRequirementSubmit = (requirement: string) => {
    setInput(requirement);
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const results = interpretRequirement(requirement);
      setSuggestions(results);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleQuantityChange = (id: string, quantity: number) => {
    setSuggestions(prev => 
      prev.map(item => 
        item.product.id === id 
          ? { ...item, suggestedQuantity: quantity } 
          : item
      )
    );
  };
  
  const handleToggleSelect = (id: string) => {
    setSuggestions(prev => 
      prev.map(item => 
        item.product.id === id 
          ? { ...item, selected: !item.selected } 
          : item
      )
    );
  };
  
  const selectedItems = suggestions.filter(item => item.selected);
  
  const handlePlaceOrder = () => {
    if (selectedItems.length === 0) return;
    
    const order = generateOrder(customerName || 'Guest Customer', selectedItems);
    setCurrentOrder(order);
    saveOrderToHistory(order);
    setShowOrderConfirmation(true);
  };
  
  const handleNewOrder = () => {
    setShowOrderConfirmation(false);
    setSuggestions([]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
      />
      
      <main className="container mx-auto px-4 py-6">
        <InputForm 
          onSubmit={handleRequirementSubmit}
          isLoading={isLoading} 
        />
        
        {suggestions.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductList 
                  suggestions={suggestions}
                  onQuantityChange={handleQuantityChange}
                  onToggleSelect={handleToggleSelect}
                />
              </div>
              
              <div className="lg:col-span-1">
                <OrderSummary 
                  customerName={customerName}
                  selectedItems={selectedItems}
                  onPlaceOrder={handlePlaceOrder}
                />
              </div>
            </div>
          </div>
        )}
        
        {!suggestions.length && !isLoading && (
          <div className="mt-12 text-center text-gray-500">
            <p className="text-lg">Enter your requirements above to get product suggestions</p>
          </div>
        )}
      </main>
      
      {showOrderConfirmation && currentOrder && (
        <OrderConfirmation 
          order={currentOrder}
          onNewOrder={handleNewOrder}
        />
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;