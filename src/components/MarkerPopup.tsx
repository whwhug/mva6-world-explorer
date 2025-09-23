import React from 'react';
import { X, MapPin, GraduationCap, Users, ChevronLeft, ChevronRight } from 'lucide-react';

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
  return (
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
          {location.content.videoUrl ? (
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

          {/* Role badge */}
          <div className="mt-4 flex justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              location.type === 'teacher'
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'bg-primary/20 text-primary border border-primary/30'
            }`}>
              {location.type === 'teacher' ? 'Faculty Member' : 'Student'}
            </span>
          </div>
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
  );
};