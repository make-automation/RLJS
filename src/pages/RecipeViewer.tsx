import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { RecipeCard } from '../components/RecipeCard';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecipeViewer() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [hiddenRecipes, setHiddenRecipes] = useState<any[]>([]);
  const [showDownload, setShowDownload] = useState(false);

  const handleFileUpload = (newRecipes: any[]) => {
    try {
      setError('');
      const processedRecipes = newRecipes.map(recipe => {
        if (recipe.recipe || recipe.Recipe) {
          return recipe.recipe || recipe.Recipe;
        }
        const numberedRecipes = Object.entries(recipe)
          .filter(([key]) => /^recipe\d+$/i.test(key))
          .map(([, value]) => value);
        
        if (numberedRecipes.length > 0) {
          return numberedRecipes;
        }
        return recipe;
      }).flat();
      
      setRecipes(prev => [...prev, ...processedRecipes]);
    } catch (err) {
      setError('Failed to process the JSON file. Please check the format and try again.');
    }
  };

  const handleHideRecipe = (recipe: any) => {
    setHiddenRecipes(prev => [...prev, recipe]);
  };

  const handleFinish = () => {
    if (hiddenRecipes.length === 0) {
      toast.error('No recipes have been hidden yet!');
      return;
    }
    setShowDownload(true);
  };

  const handleDownload = () => {
    const visibleRecipes = recipes.filter(recipe => 
      !hiddenRecipes.some(hidden => JSON.stringify(hidden) === JSON.stringify(recipe))
    );

    const blob = new Blob([JSON.stringify(visibleRecipes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_recipes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Clear temporary data
    setHiddenRecipes([]);
    setShowDownload(false);
    toast.success('Recipes downloaded successfully!');
  };

  return (
    <div>
      <FileUpload 
        onFileUpload={handleFileUpload}
        isVisible={isVisible}
        onVisibilityToggle={() => setIsVisible(!isVisible)}
      />
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4 mb-6">
        {recipes.length > 0 && (
          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Finish Selection
          </button>
        )}
        {showDownload && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            Download Filtered Recipes
          </button>
        )}
      </div>
      
      {recipes.length > 0 && isVisible ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <RecipeCard 
              key={index} 
              recipe={recipe} 
              index={index + 1}
              onHide={handleHideRecipe}
            />
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>Recipes are currently hidden. Click the eye icon to show them.</p>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          <p>Upload JSON files or paste JSON content to view recipes</p>
        </div>
      )}
    </div>
  );
}