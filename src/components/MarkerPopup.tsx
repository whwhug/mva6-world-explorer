import React, { useState } from 'react';
import { X, MapPin, GraduationCap, Users, ChevronLeft, ChevronRight, Maximize2, Play } from 'lucide-react';
import rebeccaTimetable from '@/assets/rebecca-timetable.avif';
import flippedLearningVideo from '@/assets/flipped-learning.mp4';

interface LocationData {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'student' | 'teacher';
  content: {
    title: string;
    description: string;
    videoUrl?: string;
    logoUrl?: string;
    imageUrl?: string;
  };
}

interface MarkerPopupProps {
  location: LocationData;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex?: number;
  totalCount?: number;
  isNavigating?: boolean;
}

export const MarkerPopup: React.FC<MarkerPopupProps> = ({ 
  location, 
  onClose, 
  onNext, 
  onPrevious, 
  currentIndex, 
  totalCount, 
  isNavigating 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
    {isFullscreen && (
      <div 
        className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-4"
        onClick={() => setIsFullscreen(false)}
      >
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <img 
          src={rebeccaTimetable}
          alt="Full screen view"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    )}
    {showVideo && location.content.imageUrl && location.content.videoUrl && (
      <div 
        className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-4"
        onClick={() => setShowVideo(false)}
      >
        <button
          onClick={() => setShowVideo(false)}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <video 
          src={flippedLearningVideo}
          controls
          autoPlay
          className="max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-elegant animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${location.type === 'teacher' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
              {location.type === 'teacher' ? (
                <GraduationCap className="w-5 h-5" />
              ) : (
                <Users className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{location.content.title}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {location.type === 'student' 
                  ? location.name.split(', ').pop() || location.name 
                  : location.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Media content */}
          {location.content.imageUrl && location.content.videoUrl ? (
            <div className="mb-4 relative group">
              <img 
                src={rebeccaTimetable}
                alt={location.content.title}
                className="w-full rounded-lg border border-border"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowVideo(true)}
                  className="p-6 bg-primary hover:bg-primary/90 rounded-full transition-all hover:scale-110 shadow-lg"
                  title="Play Flipped Learning Video"
                >
                  <Play className="w-8 h-8 text-primary-foreground fill-current" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-4 bg-secondary hover:bg-secondary/90 rounded-full transition-all hover:scale-110 shadow-lg"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-6 h-6 text-secondary-foreground" />
                </button>
              </div>
            </div>
          ) : location.content.videoUrl ? (
            <div className="mb-4 aspect-video bg-muted rounded-lg overflow-hidden border border-border">
              <video 
                src={location.content.videoUrl}
                controls
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Video failed to load:', e);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : location.content.imageUrl ? (
            <div className="mb-4 relative group">
              <img 
                src={rebeccaTimetable}
                alt={location.content.title}
                className="w-full rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsFullscreen(true)}
              />
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : location.content.logoUrl ? (
            <div className="mb-4 flex justify-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center border-2 border-border">
                <GraduationCap className="w-12 h-12 text-primary" />
              </div>
            </div>
          ) : null}

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {location.content.description}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 space-y-4">
          {/* Progress indicator */}
          {currentIndex && totalCount && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>{currentIndex} of {totalCount}</span>
              <div className="flex gap-1">
                {Array.from({ length: totalCount }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex - 1 ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          {onNext && onPrevious ? (
            <div className="flex gap-3">
              <button
                onClick={onPrevious}
                disabled={isNavigating}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={onNext}
                disabled={isNavigating}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? 'Navigating...' : 'Next'}
                {!isNavigating && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Continue Exploring
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};