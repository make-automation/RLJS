import React from 'react';
import { Upload } from 'lucide-react';

interface JsonUploaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function JsonUploader({ onFileUpload }: JsonUploaderProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upload JSON Files</h3>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 text-center px-4">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">JSON files only</p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept=".json"
            onChange={onFileUpload}
          />
        </label>
      </div>
    </div>
  );
}