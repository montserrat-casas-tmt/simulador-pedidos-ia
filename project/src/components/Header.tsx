import React from 'react';
import { Zap } from 'lucide-react';

interface HeaderProps {
  customerName: string;
  onCustomerNameChange: (name: string) => void;
}

const Header: React.FC<HeaderProps> = ({ customerName, onCustomerNameChange }) => {
  return (
    <header className="bg-[#0F52BA] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Zap size={32} className="mr-2 text-[#FF6B35]" />
          <h1 className="text-2xl font-bold">ElectriOrder</h1>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <label htmlFor="customerName" className="mr-2 mb-1 md:mb-0">Customer:</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Enter customer name"
              className="px-3 py-1 rounded text-gray-800 w-full md:w-64"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;