import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface InputFormProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
    }
  };

  const examples = [
    "I need materials for a medium-sized office three-phase installation",
    "Looking for products for a small home electrical renovation",
    "Need supplies for a large commercial building with lots of lighting",
    "Materials for a single-phase residential installation with 8 rooms"
  ];
  
  return (
    <div className="bg-gray-100 py-6 px-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">What electrical materials do you need?</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-grow relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your requirements in natural language..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F52BA] focus:border-transparent transition-all"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              <Search size={20} />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-6 py-3 rounded-lg font-medium ${
              isLoading || !input.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#0F52BA] hover:bg-[#0D47A1] transition-colors'
            } text-white`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Get Suggestions'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Example searches:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setInput(example)}
              className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-gray-700"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputForm;