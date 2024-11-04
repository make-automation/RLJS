import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ChefHat, Link as LinkIcon, GitMerge, Share2 } from 'lucide-react';
import RecipeViewer from './pages/RecipeViewer';
import LinkScraper from './pages/LinkScraper';
import JsonMerger from './pages/JsonMerger';
import SocialShare from './pages/SocialShare';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Irime AI Tools</h1>
            </div>
            <nav className="flex gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <ChefHat size={20} />
                Recipe Viewer
              </Link>
              <Link 
                to="/scraper" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <LinkIcon size={20} />
                Link Scraper
              </Link>
              <Link 
                to="/merger" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <GitMerge size={20} />
                JSON Merger
              </Link>
              <Link 
                to="/social" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <Share2 size={20} />
                Social Share
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow">
        <Routes>
          <Route path="/" element={<RecipeViewer />} />
          <Route path="/scraper" element={<LinkScraper />} />
          <Route path="/merger" element={<JsonMerger />} />
          <Route path="/social" element={<SocialShare />} />
        </Routes>
      </main>

      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                © 2024 <a href="https://rollrecipe.com" className="text-indigo-600 hover:text-indigo-500">Irime</a>. All rights reserved.
              </p>
              <div className="mt-4 flex justify-center space-x-6">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Terms of Use</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Disclaimer</a>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                This tool is provided for convenience. Please review all data before use.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;