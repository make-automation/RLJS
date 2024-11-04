import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { JsonUploader } from '../components/JsonUploader';
import { JsonTextInput } from '../components/JsonTextInput';
import { MergedDataView } from '../components/MergedDataView';

export default function JsonMerger() {
  const [mergedData, setMergedData] = useState<any[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string>('');

  const processJsonContent = (content: string) => {
    try {
      // Try to parse as a single JSON array first
      try {
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          return data;
        }
      } catch {}

      // If that fails, try to parse multiple JSON arrays
      const jsonArrays = content
        .split(/\n+/)
        .filter(text => text.trim())
        .map(text => {
          try {
            const parsed = JSON.parse(text);
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            return null;
          }
        })
        .filter((arr): arr is any[] => arr !== null)
        .flat();

      if (jsonArrays.length === 0) {
        throw new Error('No valid JSON arrays found');
      }

      return jsonArrays;
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      const fileContents = await Promise.all(
        Array.from(files).map(file => file.text())
      );

      const parsedData = fileContents.flatMap(content => {
        try {
          return processJsonContent(content);
        } catch (error) {
          toast.error(`Error in file: ${error instanceof Error ? error.message : 'Invalid format'}`);
          return [];
        }
      });

      setMergedData(prev => [...prev, ...parsedData]);
      toast.success('Files processed successfully!');
    } catch (error) {
      setError('Error processing files');
      toast.error('Error processing files');
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) {
      toast.error('Please enter JSON content');
      return;
    }

    try {
      const parsedData = processJsonContent(jsonInput);
      setMergedData(prev => [...prev, ...parsedData]);
      setJsonInput('');
      toast.success('JSON content merged successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  };

  const handleDownload = () => {
    if (mergedData.length === 0) {
      toast.error('No data to download');
      return;
    }

    const blob = new Blob([JSON.stringify(mergedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged_recipes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded successfully!');
  };

  const clearData = () => {
    setMergedData([]);
    setJsonInput('');
    setError('');
    toast.success('All data cleared');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">JSON Merger</h2>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <JsonUploader onFileUpload={handleFileUpload} />
          <JsonTextInput
            value={jsonInput}
            onChange={setJsonInput}
            onSubmit={handleTextSubmit}
          />
        </div>
      </div>

      <MergedDataView
        data={mergedData}
        error={error}
        onClear={clearData}
        onDownload={handleDownload}
      />
    </div>
  );
}