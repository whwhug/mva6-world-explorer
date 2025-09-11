import React from 'react';
import { X, MapPin, GraduationCap, Users } from 'lucide-react';

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
}

export const MarkerPopup: React.FC<MarkerPopupProps> = ({ location, onClose }) => {
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
                {location.name}
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
            <div className="mb-4 aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-0 h-0 border-l-6 border-l-primary border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                </div>
                <p className="text-sm text-muted-foreground">Video Content</p>
                <p className="text-xs text-muted-foreground mt-1">Student Introduction</p>
              </div>
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
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Continue Exploring
          </button>
        </div>
      </div>
    </div>
  );
};