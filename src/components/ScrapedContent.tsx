import React, { useState } from 'react';
import { ExternalLink, Share2, Facebook, Twitter, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface ScrapedData {
  url: string;
  title: string;
  description: string;
  images: string[];
  schema: any;
}

interface ScrapedContentProps {
  data: ScrapedData;
  onShare: (platform: string, url: string) => void;
}

export function ScrapedContent({ data, onShare }: ScrapedContentProps) {
  const [showSchema, setShowSchema] = useState(false);

  const toggleSchema = () => {
    setShowSchema(!showSchema);
    if (!showSchema) {
      toast('baraka men tbergig', {
        icon: '🤪',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">{data.title || 'Untitled'}</h2>
          <p className="text-gray-600 mb-4">{data.description || 'No description available'}</p>
          <a 
            href={data.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 hover:text-indigo-700 break-all text-sm sm:text-base"
          >
            {data.url}
          </a>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => window.open(data.url, '_blank')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Open in new window"
          >
            <ExternalLink size={20} />
          </button>
          <button
            onClick={() => onShare('facebook', data.url)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="Share on Facebook"
          >
            <Facebook size={20} />
          </button>
          <button
            onClick={() => onShare('twitter', data.url)}
            className="p-2 text-sky-500 hover:text-sky-700 hover:bg-sky-50 rounded"
            title="Share on Twitter"
          >
            <Twitter size={20} />
          </button>
          <button
            onClick={() => onShare('pinterest', data.url)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            title="Share on Pinterest"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {data.schema && data.schema.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Schema Data</h3>
            <button
              onClick={toggleSchema}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              {showSchema ? (
                <>
                  <EyeOff size={16} />
                  Hide Schema
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Show Schema
                </>
              )}
            </button>
          </div>
          {showSchema && (
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
              {JSON.stringify(data.schema, null, 2)}
            </pre>
          )}
        </div>
      )}

      {data.images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {data.images.map((img, imgIndex) => (
              <div key={imgIndex} className="flex flex-col items-center">
                <div className="relative w-full pb-[100%]">
                  <img
                    src={img}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer rounded hover:opacity-90 transition-opacity"
                    onClick={() => window.open(img, '_blank')}
                  />
                </div>
                <a
                  href={img}
                  download
                  className="mt-2 text-xs text-indigo-600 hover:text-indigo-700"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}