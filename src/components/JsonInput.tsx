import React, { useState } from 'react';

type JsonInputProps = {
  onSubmit: (jsonString: string) => void;
};

const JsonInput: React.FC<JsonInputProps> = ({ onSubmit }) => {
  const [jsonText, setJsonText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(jsonText);
    setJsonText('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="mb-4">
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder="Paste your JSON here..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Load JSON
      </button>
    </form>
  );
};

export default JsonInput;