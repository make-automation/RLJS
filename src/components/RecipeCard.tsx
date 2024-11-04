import React, { useState } from 'react';
import { Copy, Bot, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Recipe {
  [key: string]: any;
}

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onHide: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, index, onHide }: RecipeCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [aiStatus, setAiStatus] = useState(false);
  const [copyCount, setCopyCount] = useState<{ [key: string]: number }>({});

  const colors = ['bg-lime-500', 'bg-blue-500', 'bg-yellow-500', 'bg-fuchsia-500', 'bg-gray-400', 'bg-red-900', 'bg-olive-700', 'bg-purple-600', 'bg-navy-800'];

  const getCopyButtonColor = (count: number) => {
    if (count === 1) return 'bg-yellow-500';
    if (count === 2) return 'bg-red-500';
    if (count === 3) return 'bg-pink-500';
    if (count >= 4) {
      const colorIndex = (count - 4) % colors.length;
      return colors[colorIndex];
    }
    return 'bg-blue-500';
  };

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    const newCount = (copyCount[key] || 0) + 1;
    setCopyCount(prev => ({ ...prev, [key]: newCount }));
    
    if (newCount >= 4) {
      toast('baraka men 3assab', {
        icon: '🤪',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const handleHide = () => {
    setIsVisible(false);
    onHide(recipe);
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join('\n');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  if (!isVisible) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6 text-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Recipe {index}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsVisible(true)}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Eye size={16} />
              <span>Show</span>
            </button>
          </div>
        </div>
        <p className="text-gray-500">Recipe content is hidden</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Recipe {index}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleHide}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <EyeOff size={16} />
            <span>Hide</span>
          </button>
          <button
            onClick={() => setAiStatus(!aiStatus)}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
              aiStatus 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Bot size={16} />
            <span>{aiStatus ? 'AI DETECTED' : 'NO AI'}</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(recipe).map(([key, value]) => (
          <div key={key} className="relative group">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-gray-700 mb-2">{key}</h3>
              <button
                onClick={() => copyToClipboard(key, formatValue(value))}
                className={`px-3 py-1 text-white rounded-md hover:opacity-90 transition-colors flex items-center gap-2 text-sm ${getCopyButtonColor(copyCount[key] || 0)}`}
                title="Copy to clipboard"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
            
            {Array.isArray(value) ? (
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {value.map((item, index) => (
                  <li key={index} className="break-words">{item}</li>
                ))}
              </ul>
            ) : typeof value === 'object' && value !== null ? (
              <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-600 break-words">{value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}