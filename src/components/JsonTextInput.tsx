import React from 'react';

interface JsonTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function JsonTextInput({ value, onChange, onSubmit }: JsonTextInputProps) {
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // If there's existing text, add a newline
    const newText = value 
      ? value + '\n' + pastedText 
      : pastedText;
    
    onChange(newText);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Paste JSON Content</h3>
      <form onSubmit={onSubmit} className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste your JSON arrays here... You can paste multiple times!"
          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Merge JSON
        </button>
      </form>
    </div>
  );
}