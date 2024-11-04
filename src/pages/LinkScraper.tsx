import React, { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { ScraperService } from '../services/scraper';
import { ScrapedContent } from '../components/ScrapedContent';

interface ScrapedData {
  url: string;
  title: string;
  description: string;
  images: string[];
  schema: any;
}

export default function LinkScraper() {
  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlListInput, setUrlListInput] = useState('');
  const [error, setError] = useState<string>('');

  const extractUrls = (text: string): string[] => {
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s<>"]*)?/g;
    const matches = text.match(urlRegex) || [];
    return Array.from(new Set(matches));
  };

  const processUrls = async (urls: string[]) => {
    if (urls.length === 0) {
      setError('No valid URLs found in the provided content.');
      return;
    }

    setLoading(true);
    setError('');

    for (const url of urls) {
      try {
        if (url.includes('sitemap')) {
          const results = await ScraperService.scrapeSitemap(url);
          if (results.length > 0) {
            setScrapedData(prev => [...prev, ...results]);
            toast.success(`Successfully processed sitemap: ${url}`);
          } else {
            toast.error(`No valid URLs found in sitemap: ${url}`);
          }
        } else {
          const result = await ScraperService.scrape(url);
          if (result) {
            setScrapedData(prev => [...prev, result]);
            toast.success(`Successfully processed: ${url}`);
          } else {
            toast.error(`Failed to process: ${url}`);
          }
        }
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        toast.error(`Failed to process: ${url}`);
      }
    }

    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      try {
        const data = JSON.parse(text);
        const urls = data.flatMap((item: any) => {
          const possibleUrlFields = ['url', 'link', 'Recipe Link', 'recipeLink', 'recipe_link'];
          return possibleUrlFields
            .map(field => item[field])
            .filter(Boolean);
        });
        
        if (urls.length > 0) {
          await processUrls(urls);
        } else {
          setError('No valid URLs found in the JSON file');
        }
      } catch (error) {
        const urls = extractUrls(text);
        await processUrls(urls);
      }
    };
    reader.readAsText(file);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) {
      setError('Please enter a URL');
      return;
    }
    await processUrls([urlInput]);
    setUrlInput('');
  };

  const handleUrlListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlListInput) {
      setError('Please enter URLs');
      return;
    }
    const urls = extractUrls(urlListInput);
    await processUrls(urls);
    setUrlListInput('');
  };

  const handleShare = (platform: string, url: string) => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LinkIcon size={20} />
            Single URL
          </h2>
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter URL to scrape"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Process URL'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LinkIcon size={20} />
            Multiple URLs
          </h2>
          <form onSubmit={handleUrlListSubmit} className="space-y-4">
            <textarea
              value={urlListInput}
              onChange={(e) => setUrlListInput(e.target.value)}
              placeholder="Paste URLs (one per line)"
              className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Process URLs'}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                TXT, HTML, JSON files with links
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".txt,.html,.json"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing links...</p>
        </div>
      )}

      <div className="grid gap-6">
        {scrapedData.map((data, index) => (
          <ScrapedContent
            key={index}
            data={data}
            onShare={handleShare}
          />
        ))}
      </div>
    </div>
  );
}