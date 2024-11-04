import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { ControlButtons } from './ControlButtons';

interface FileUploadProps {
  onFileUpload: (recipes: any[]) => void;
  isVisible: boolean;
  onVisibilityToggle: () => void;
}

export function FileUpload({ onFileUpload, isVisible, onVisibilityToggle }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processJsonContent = (content: string) => {
    try {
      const data = JSON.parse(content);
      const recipes = Array.isArray(data) ? data : [data];
      onFileUpload(recipes);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Invalid JSON format. Please check your content and try again.');
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const text = event.clipboardData.getData('text');
    processJsonContent(text);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        const text = await file.text();
        processJsonContent(text);
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
        alert(`Failed to read file ${file.name}`);
      }
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-8">
      <ControlButtons
        isVisible={isVisible}
        onVisibilityToggle={onVisibilityToggle}
      />

      <div
        className="w-full p-6 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 focus-within:border-indigo-500 transition-colors"
        onPaste={handlePaste}
        tabIndex={0}
        role="textbox"
      >
        <div className="text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept=".json"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-4"
          >
            <Upload size={20} />
            Select JSON Files
          </button>
          
          <p className="text-gray-600">
            Drop JSON files here or paste JSON content (Click and press Ctrl+V)
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Multiple files supported. Content will be processed automatically.
          </p>
        </div>
      </div>
    </div>
  );
}