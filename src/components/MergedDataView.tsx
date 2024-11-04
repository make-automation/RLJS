import React from 'react';
import { Download, AlertCircle } from 'lucide-react';

interface MergedDataViewProps {
  data: any[];
  error: string;
  onClear: () => void;
  onDownload: () => void;
}

export function MergedDataView({ data, error, onClear, onDownload }: MergedDataViewProps) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold">Merged Data</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onClear}
            className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Clear All
          </button>
          <button
            onClick={onDownload}
            disabled={data.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Download size={16} />
            Download JSON
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg mb-4 text-sm">
          <AlertCircle size={16} />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4">
        <p className="text-gray-600 mb-2 text-sm">
          Total items: <span className="font-semibold">{data.length}</span>
        </p>
        {data.length > 0 && (
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs sm:text-sm max-h-[60vh] font-mono">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}