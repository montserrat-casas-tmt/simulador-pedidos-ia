import React, { useState } from 'react';
import { Copy, CheckCircle, ShoppingCart, Package, Download } from 'lucide-react';
import { ProductSuggestion } from '../types';
import { calculateTotalPrice, generateOrder, generateOrderJson } from '../utils/orderGenerator';

interface OrderSummaryProps {
  customerName: string;
  selectedItems: ProductSuggestion[];
  onPlaceOrder: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  customerName, 
  selectedItems,
  onPlaceOrder
}) => {
  const [isJsonCopied, setIsJsonCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);
  
  const totalPrice = calculateTotalPrice(selectedItems);
  const totalItems = selectedItems.reduce((sum, item) => sum + item.suggestedQuantity, 0);
  
  const order = generateOrder(customerName || 'Guest Customer', selectedItems);
  const orderJson = generateOrderJson(order);
  
  const handleCopyJson = () => {
    navigator.clipboard.writeText(orderJson);
    setIsJsonCopied(true);
    
    setTimeout(() => {
      setIsJsonCopied(false);
    }, 2000);
  };
  
  const handleDownloadJson = () => {
    const blob = new Blob([orderJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order-${order.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (selectedItems.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 mt-6 shadow-sm border border-gray-200">
        <div className="flex flex-col items-center justify-center text-gray-500 py-6">
          <ShoppingCart size={40} className="mb-2 opacity-40" />
          <p>No products selected yet</p>
          <p className="text-sm mt-1">Select products to build your order</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Package size={20} className="mr-2 text-[#0F52BA]" />
        Order Summary
      </h2>
      
      <div className="space-y-4">
        <div className="pb-3 border-b">
          <p className="text-gray-600">Customer: <span className="font-medium text-gray-800">{customerName || 'Guest Customer'}</span></p>
          <p className="text-gray-600">Order ID: <span className="font-medium text-gray-800">{order.id}</span></p>
          <p className="text-gray-600">Date: <span className="font-medium text-gray-800">{new Date(order.date).toLocaleDateString()}</span></p>
        </div>
        
        <div className="max-h-60 overflow-y-auto pr-2">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-1 text-sm font-medium text-gray-500">Product</th>
                <th className="py-2 px-1 text-sm font-medium text-gray-500 text-right">Qty</th>
                <th className="py-2 px-1 text-sm font-medium text-gray-500 text-right">Price</th>
                <th className="py-2 px-1 text-sm font-medium text-gray-500 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {selectedItems.map(item => (
                <tr key={item.product.id}>
                  <td className="py-2 px-1 text-sm">
                    <div className="font-medium text-gray-900">{item.product.name}</div>
                    <div className="text-xs text-gray-500">{item.product.category}</div>
                  </td>
                  <td className="py-2 px-1 text-sm text-right">
                    {item.suggestedQuantity} {item.product.unit === 'meter' ? 'm' : ''}
                  </td>
                  <td className="py-2 px-1 text-sm text-right">
                    ${item.product.price.toFixed(2)}
                  </td>
                  <td className="py-2 px-1 text-sm text-right font-medium">
                    ${(item.product.price * item.suggestedQuantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pt-3 border-t">
          <div className="flex justify-between font-medium text-gray-800">
            <span>Total ({selectedItems.length} products, {totalItems} items):</span>
            <span className="text-lg">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            className="bg-[#0F52BA] text-white py-2 px-4 rounded-md font-medium hover:bg-[#0D47A1] transition-colors flex-1 flex items-center justify-center"
            onClick={onPlaceOrder}
          >
            <ShoppingCart size={18} className="mr-2" />
            Place Order
          </button>
          
          <button
            className="border border-[#0F52BA] text-[#0F52BA] py-2 px-4 rounded-md font-medium hover:bg-[#0F52BA]/5 transition-colors flex items-center justify-center"
            onClick={() => setShowJson(!showJson)}
          >
            {showJson ? 'Hide' : 'Show'} JSON
          </button>
        </div>
        
        {showJson && (
          <div className="mt-4">
            <div className="bg-gray-800 rounded-md overflow-hidden">
              <div className="flex items-center justify-between p-2 bg-gray-700">
                <h3 className="text-sm font-mono text-white">Order JSON for ERP</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyJson}
                    className="text-gray-300 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {isJsonCopied ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="text-gray-300 hover:text-white transition-colors"
                    title="Download JSON"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
              <pre className="p-4 text-green-400 text-xs overflow-x-auto font-mono">
                {orderJson}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;