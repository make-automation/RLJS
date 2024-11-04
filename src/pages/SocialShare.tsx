import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Share2, Download, X, Facebook, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { ScraperService } from '../services/scraper';

interface ScrapedItem {
  url: string;
  title: string;
  description: string;
  images: string[];
  isHidden: boolean;
  imagesShared: { [key: string]: boolean };
}

export default function SocialShare() {
  const [scrapedItems, setScrapedItems] = useState<ScrapedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      toast.error('Please enter URLs');
      return;
    }

    const urls = urlInput.split('\n').filter(url => url.trim());
    setLoading(true);

    for (const url of urls) {
      try {
        const data = await ScraperService.scrape(url);
        if (data) {
          setScrapedItems(prev => [...prev, {
            ...data,
            isHidden: false,
            imagesShared: Object.fromEntries(data.images.map(img => [img, false]))
          }]);
          toast.success(`Processed: ${url}`);
        }
      } catch (error) {
        toast.error(`Failed to process: ${url}`);
      }
    }

    setLoading(false);
    setUrlInput('');
  };

  const handleShare = (platform: string, url: string) => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  const toggleHidden = (index: number) => {
    setScrapedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, isHidden: !item.isHidden } : item
    ));
  };

  const toggleImageShared = (itemIndex: number, imageUrl: string) => {
    setScrapedItems(prev => prev.map((item, i) => 
      i === itemIndex ? {
        ...item,
        imagesShared: {
          ...item.imagesShared,
          [imageUrl]: !item.imagesShared[imageUrl]
        }
      } : item
    ));
  };

  const downloadHiddenData = () => {
    const hiddenItems = scrapedItems.filter(item => item.isHidden);
    const hiddenImages = scrapedItems.flatMap(item => 
      Object.entries(item.imagesShared)
        .filter(([_, isShared]) => isShared)
        .map(([url]) => ({ url, title: item.title }))
    );

    const data = {
      hiddenItems,
      hiddenImages
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hidden_content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Social Share</h2>
        
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <textarea
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter URLs (one per line)"
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Process URLs'}
            </button>
            {scrapedItems.length > 0 && (
              <button
                onClick={downloadHiddenData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Data
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid gap-6">
        {scrapedItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 break-all"
                >
                  {item.url}
                </a>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleHidden(index)}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    item.isHidden 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {item.isHidden ? 'Hidden' : 'Show'}
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(item.title)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <button
                onClick={() => handleShare('twitter', item.url)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                <X size={20} />
                Share on X
              </button>
              <button
                onClick={() => handleShare('facebook', item.url)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Facebook size={20} />
                Share on Facebook
              </button>
              <button
                onClick={() => handleShare('pinterest', item.url)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Share2 size={20} />
                Share on Pinterest
              </button>
              <button
                onClick={() => handleShare('reddit', item.url)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Share2 size={20} />
                Share on Reddit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {item.images.map((img, imgIndex) => (
                <div key={imgIndex} className="relative group">
                  <div className="relative">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-48 object-cover rounded-lg cursor-pointer"
                      onClick={() => setSelectedImage(img)}
                    />
                    <button
                      onClick={() => window.open(img, '_blank')}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <Download size={20} />
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleShare('twitter', img)}
                        className="flex-1 px-2 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
                      >
                        X
                      </button>
                      <button
                        onClick={() => handleShare('facebook', img)}
                        className="flex-1 px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        FB
                      </button>
                      <button
                        onClick={() => handleShare('pinterest', img)}
                        className="flex-1 px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Pin
                      </button>
                      <button
                        onClick={() => handleShare('reddit', img)}
                        className="flex-1 px-2 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                      >
                        Reddit
                      </button>
                    </div>
                    <button
                      onClick={() => toggleImageShared(index, img)}
                      className={`w-full px-4 py-2 rounded text-white transition-colors ${
                        item.imagesShared[img]
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {item.imagesShared[img] ? 'SHARED' : 'No'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <img
                src={selectedImage}
                alt=""
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleShare('twitter', selectedImage)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Share on X
                </button>
                <button
                  onClick={() => handleShare('facebook', selectedImage)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Share on Facebook
                </button>
                <button
                  onClick={() => handleShare('pinterest', selectedImage)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Share on Pinterest
                </button>
                <button
                  onClick={() => handleShare('reddit', selectedImage)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Share on Reddit
                </button>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}