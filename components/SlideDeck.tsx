
import React from 'react';
import { Slide, SlideLayout } from '../types';
import { TrashIcon, PlusIcon } from './icons';

// SlidePreview Component (defined in the same file)
interface SlidePreviewProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slide, index, isActive, onClick }) => {
  const activeClasses = isActive ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-600 hover:border-indigo-600';
  
  return (
    <div
      onClick={onClick}
      className={`bg-gray-800 rounded-lg cursor-pointer transition-all duration-200 border-2 ${activeClasses} p-3 aspect-video flex flex-col items-center justify-center text-center`}
    >
      <p className="text-gray-400 text-sm mb-2">{index + 1}</p>
      <h3 className="text-white text-xs font-bold truncate w-full">{slide.title}</h3>
    </div>
  );
};


// MainView Component (defined in the same file)
interface MainViewProps {
  slide: Slide | null;
}

const renderSlideContent = (slide: Slide) => {
    switch(slide.layout) {
        case SlideLayout.Title:
            return (
                <div className="text-center">
                    <h1 className="text-6xl font-extrabold text-white tracking-tight">{slide.title}</h1>
                    {slide.content[0] && <p className="mt-6 text-2xl text-gray-300">{slide.content[0]}</p>}
                </div>
            );
        case SlideLayout.SectionHeader:
            return (
                <div className="text-left w-full px-16">
                    <h2 className="text-5xl font-bold text-indigo-400">{slide.title}</h2>
                </div>
            );
        case SlideLayout.ThankYou:
             return (
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-white">{slide.title}</h1>
                    {slide.content[0] && <p className="mt-4 text-2xl text-gray-300">{slide.content[0]}</p>}
                </div>
            );
        case SlideLayout.Content:
        default:
            return (
                <div className="text-left w-full h-full flex flex-col px-16 py-12">
                    <h2 className="text-4xl font-bold text-white mb-8 pb-4 border-b-2 border-indigo-500">{slide.title}</h2>
                    <ul className="space-y-4 text-xl text-gray-200 list-disc list-inside flex-grow">
                        {slide.content.map((point, i) => (
                            <li key={i} className="leading-relaxed">{point}</li>
                        ))}
                    </ul>
                </div>
            );
    }
}

const MainView: React.FC<MainViewProps> = ({ slide }) => {
  if (!slide) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center text-gray-400 p-8 text-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to the AI Presentation Builder</h2>
            <p>Enter a topic on the right panel to generate your slides.</p>
          </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 flex items-center justify-center p-8">
        <div className="aspect-video w-full max-w-6xl bg-gray-800 rounded-xl shadow-lg flex items-center justify-center p-8 border border-gray-700">
            {renderSlideContent(slide)}
        </div>
    </div>
  );
};


// SlideDeck Component (main export)
interface SlideDeckProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (id: string) => void;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({ slides, currentSlideIndex, onSelectSlide, onAddSlide, onDeleteSlide }) => {
  const currentSlide = slides[currentSlideIndex] || null;

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800/50 p-4 overflow-y-auto flex flex-col border-r border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Slides</h3>
        <div className="space-y-3 flex-grow">
            {slides.map((slide, index) => (
                <div key={slide.id} className="relative group">
                    <SlidePreview
                        slide={slide}
                        index={index}
                        isActive={index === currentSlideIndex}
                        onClick={() => onSelectSlide(index)}
                    />
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSlide(slide.id);
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        aria-label="Delete slide"
                        >
                        <TrashIcon className="h-3 w-3" />
                    </button>
                </div>
            ))}
        </div>
        <button 
            onClick={onAddSlide}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
        >
            <PlusIcon />
            Add Slide
        </button>
      </div>

      {/* Main View */}
      <MainView slide={currentSlide} />
    </div>
  );
};
