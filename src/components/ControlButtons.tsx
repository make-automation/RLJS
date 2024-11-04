import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ControlButtonsProps {
  isVisible: boolean;
  onVisibilityToggle: () => void;
}

export function ControlButtons({ 
  isVisible, 
  onVisibilityToggle 
}: ControlButtonsProps) {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onVisibilityToggle}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        {isVisible ? (
          <>
            <EyeOff size={20} />
            <span>Hide Recipes</span>
          </>
        ) : (
          <>
            <Eye size={20} />
            <span>Show Recipes</span>
          </>
        )}
      </button>
    </div>
  );
}