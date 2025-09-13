
import React, { useState } from 'react';
import { PlayIcon } from './icons';

interface ControlPanelProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
  slideCount: number;
  onPresent: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isLoading, slideCount, onPresent }) => {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim().length < 5) {
        setError('Please enter a topic with at least 5 characters.');
        return;
    }
    setError('');
    onGenerate(topic);
  };

  return (
    <div className="w-80 bg-gray-800 p-6 flex flex-col h-full shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Slide Builder</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
            Presentation Topic
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The Future of Renewable Energy"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none h-28"
            rows={3}
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Slides'
          )}
        </button>
      </form>
      
      {slideCount > 0 && (
         <div className="mt-auto pt-6 border-t border-gray-700">
             <button
                onClick={onPresent}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition duration-200 flex items-center justify-center gap-2"
            >
                <PlayIcon className="h-5 w-5" />
                Present
            </button>
         </div>
      )}
    </div>
  );
};
