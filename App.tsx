
import React, { useState, useCallback } from 'react';
import { Slide, SlideLayout } from './types';
import { generatePresentation } from './services/geminiService';
import { ControlPanel } from './components/ControlPanel';
import { SlideDeck } from './components/SlideDeck';
import { PresentationMode } from './components/PresentationMode';

const App: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPresenting, setIsPresenting] = useState(false);

  const handleGenerate = useCallback(async (topic: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const presentationData = await generatePresentation(topic);
      const newSlides = presentationData.slides.map(s => ({
        ...s,
        id: crypto.randomUUID(),
      }));
      setSlides(newSlides);
      setCurrentSlideIndex(0);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: crypto.randomUUID(),
      title: "New Slide Title",
      content: ["Add your content here."],
      layout: SlideLayout.Content,
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    setCurrentSlideIndex(newSlides.length - 1);
  };
  
  const handleDeleteSlide = (id: string) => {
    const newSlides = slides.filter(slide => slide.id !== id);
    if (newSlides.length === 0) {
        setSlides([]);
        setCurrentSlideIndex(0);
        return;
    }
    
    let newIndex = currentSlideIndex;
    const deletedIndex = slides.findIndex(s => s.id === id);
    
    if (deletedIndex < newIndex) {
        newIndex--;
    } else if (deletedIndex === newIndex && newIndex >= newSlides.length) {
        newIndex = newSlides.length - 1;
    }

    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, newIndex));
  };


  if (isPresenting) {
    return (
      <PresentationMode
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onExit={() => setIsPresenting(false)}
        onNext={() => setCurrentSlideIndex(i => Math.min(i + 1, slides.length - 1))}
        onPrev={() => setCurrentSlideIndex(i => Math.max(i - 1, 0))}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white font-sans">
      <main className="flex flex-1 h-full">
        <SlideDeck
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSelectSlide={setCurrentSlideIndex}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
        />
        <ControlPanel 
          onGenerate={handleGenerate} 
          isLoading={isLoading}
          slideCount={slides.length}
          onPresent={() => setIsPresenting(true)}
        />
      </main>
      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white py-2 px-6 rounded-lg shadow-lg">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default App;
