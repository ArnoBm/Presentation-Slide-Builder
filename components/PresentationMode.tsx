
import React, { useEffect } from 'react';
import { Slide, SlideLayout } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from './icons';

interface PresentationModeProps {
  slides: Slide[];
  currentSlideIndex: number;
  onExit: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const renderSlideContent = (slide: Slide) => {
    switch(slide.layout) {
        case SlideLayout.Title:
            return (
                <div className="text-center">
                    <h1 className="text-7xl font-extrabold text-white tracking-tight leading-tight">{slide.title}</h1>
                    {slide.content[0] && <p className="mt-8 text-3xl text-gray-300">{slide.content[0]}</p>}
                </div>
            );
        case SlideLayout.SectionHeader:
            return (
                <div className="text-left w-full px-24">
                    <h2 className="text-6xl font-bold text-indigo-300">{slide.title}</h2>
                </div>
            );
        case SlideLayout.ThankYou:
             return (
                <div className="text-center">
                    <h1 className="text-7xl font-bold text-white">{slide.title}</h1>
                    {slide.content[0] && <p className="mt-6 text-3xl text-gray-300">{slide.content[0]}</p>}
                </div>
            );
        case SlideLayout.Content:
        default:
            return (
                <div className="text-left w-full h-full flex flex-col px-24 py-16">
                    <h2 className="text-5xl font-bold text-white mb-10 pb-5 border-b-2 border-indigo-500">{slide.title}</h2>
                    <ul className="space-y-6 text-3xl text-gray-200 list-disc list-inside flex-grow">
                        {slide.content.map((point, i) => (
                            <li key={i} className="leading-relaxed">{point}</li>
                        ))}
                    </ul>
                </div>
            );
    }
};

export const PresentationMode: React.FC<PresentationModeProps> = ({ slides, currentSlideIndex, onExit, onNext, onPrev }) => {
  const currentSlide = slides[currentSlideIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext, onPrev, onExit]);

  if (!currentSlide) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col text-white">
      {/* Main Slide Area */}
      <div className="flex-grow flex items-center justify-center p-8">
        {renderSlideContent(currentSlide)}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4">
        <button onClick={onExit} className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors">
          <XIcon className="h-8 w-8" />
        </button>
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <button onClick={onPrev} disabled={currentSlideIndex === 0} className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeftIcon className="h-10 w-10" />
        </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button onClick={onNext} disabled={currentSlideIndex === slides.length - 1} className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronRightIcon className="h-10 w-10" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-700">
        <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
        ></div>
        <div className="absolute bottom-3 right-4 text-sm text-gray-300">
          {currentSlideIndex + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
};
