import React from 'react';
import { CheckCircle, FileJson, RotateCcw } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationProps {
  order: Order;
  onNewOrder: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onNewOrder }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
        <div className="bg-green-50 p-6 flex flex-col items-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 text-center">
            Your order has been successfully created and saved.
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{order.customer}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Items:</span>
              <span className="font-medium">{order.items.length} products</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 text-center">
            This order has been saved and is ready for processing by your ERP system.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onNewOrder}
              className="flex-1 bg-[#0F52BA] text-white py-3 px-4 rounded-md font-medium hover:bg-[#0D47A1] transition-colors flex items-center justify-center"
            >
              <RotateCcw size={18} className="mr-2" />
              Start New Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;