import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerPopup } from './MarkerPopup';
import { useMapboxToken } from '../hooks/useMapboxToken';

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

const LOCATIONS: LocationData[] = [
  {
    id: 'london',
    name: 'London, UK',
    coordinates: [-0.1276, 51.5074],
    type: 'teacher',
    content: {
      title: 'Prof. Sarah Johnson',
      description: 'Mathematics & Sciences Department Head, leading innovative STEM education across our global network.',
      logoUrl: '/api/placeholder/120/120'
    }
  },
  {
    id: 'newyork',
    name: 'New York, USA',
    coordinates: [-74.0060, 40.7128],
    type: 'student',
    content: {
      title: 'Alex Chen',
      description: 'A-Level student pursuing Computer Science and Mathematics, passionate about AI and machine learning.',
      videoUrl: '/api/placeholder/400/300'
    }
  },
  {
    id: 'sydney',
    name: 'Sydney, Australia',
    coordinates: [151.2093, -33.8688],
    type: 'teacher',
    content: {
      title: 'Dr. Emma Wilson',
      description: 'English Literature specialist, bringing world-class humanities education to students globally.',
      logoUrl: '/api/placeholder/120/120'
    }
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    coordinates: [139.6503, 35.6762],
    type: 'student',
    content: {
      title: 'Yuki Tanaka',
      description: 'International Baccalaureate student focusing on Physics and Chemistry, future engineer.',
      videoUrl: '/api/placeholder/400/300'
    }
  },
  {
    id: 'singapore',
    name: 'Singapore',
    coordinates: [103.8198, 1.3521],
    type: 'teacher',
    content: {
      title: 'Mr. Raj Patel',
      description: 'Economics and Business Studies teacher, preparing students for global careers.',
      logoUrl: '/api/placeholder/120/120'
    }
  },
  {
    id: 'capetown',
    name: 'Cape Town, South Africa',
    coordinates: [18.4241, -33.9249],
    type: 'student',
    content: {
      title: 'Amara Okafor',
      description: 'A-Level Biology and Chemistry student, aspiring medical researcher and doctor.',
      videoUrl: '/api/placeholder/400/300'
    }
  },
  {
    id: 'saopaulo',
    name: 'São Paulo, Brazil',
    coordinates: [-46.6333, -23.5505],
    type: 'teacher',
    content: {
      title: 'Dr. Carlos Martinez',
      description: 'Modern Languages Department, fluent in 5 languages, promoting global communication.',
      logoUrl: '/api/placeholder/120/120'
    }
  }
];

const Globe = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: tokenLoading } = useMapboxToken();

  useEffect(() => {
    if (!mapContainer.current || tokenLoading || !token) return;

    // Initialize map with API key from hook
    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'globe',
      zoom: 1.8,
      center: [20, 20],
      pitch: 15,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Disable scroll zoom initially for smoother experience
    map.current.scrollZoom.disable();

    // Add atmosphere and fog effects for daytime
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(135, 206, 235)',
        'high-color': 'rgb(220, 220, 255)',
        'horizon-blend': 0.1,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.2
      });

      // Add enhanced markers after style loads
      LOCATIONS.forEach((location, index) => {
        const markerElement = document.createElement('div');
        markerElement.className = 'globe-marker';
        
        const isTeacher = location.type === 'teacher';
        const colors = [
          { bg: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/50' },
          { bg: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/50' },
          { bg: 'from-green-500 to-emerald-500', glow: 'shadow-green-500/50' },
          { bg: 'from-purple-500 to-violet-500', glow: 'shadow-purple-500/50' },
          { bg: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/50' },
          { bg: 'from-teal-500 to-cyan-500', glow: 'shadow-teal-500/50' },
          { bg: 'from-indigo-500 to-blue-500', glow: 'shadow-indigo-500/50' },
        ];
        
        const color = colors[index % colors.length];
        const size = isTeacher ? 'w-8 h-8' : 'w-7 h-7';
        const icon = isTeacher ? '🎓' : '👨‍🎓';
        
        markerElement.innerHTML = `
          <div class="relative group cursor-pointer">
            <div class="${size} bg-gradient-to-br ${color.bg} rounded-full border-3 border-white ${color.glow} shadow-2xl hover:scale-125 transition-all duration-300 animate-bounce flex items-center justify-center text-white font-bold">
              <div class="text-lg">${icon}</div>
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
            <div class="absolute inset-0 ${size} bg-gradient-to-br ${color.bg} rounded-full opacity-30 animate-pulse scale-150"></div>
          </div>
        `;

        // Add click event to marker
        markerElement.addEventListener('click', () => {
          setSelectedLocation(location);
        });

        new mapboxgl.Marker(markerElement)
          .setLngLat(location.coordinates)
          .addTo(map.current!);
      });

      setIsLoading(false);
    });

    // Rotation animation settings
    const secondsPerRevolution = 180;
    const maxSpinZoom = 4;
    const slowSpinZoom = 2.5;
    let userInteracting = false;
    let spinEnabled = true;

    // Spin globe function
    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      setTimeout(spinGlobe, 500);
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      setTimeout(spinGlobe, 500);
    });

    map.current.on('moveend', () => {
      if (!userInteracting) {
        setTimeout(spinGlobe, 100);
      }
    });

    // Enable scroll zoom after interaction
    map.current.on('click', () => {
      map.current?.scrollZoom.enable();
    });

    // Start the globe spinning
    setTimeout(spinGlobe, 2000);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [token, tokenLoading]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Loading overlay */}
      {(isLoading || tokenLoading) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/80 text-lg">Loading Globe...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Gradient overlay for better contrast */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/20" />
      
      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 text-sm text-muted-foreground text-center">
          Click markers to explore our global community • Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Marker popup */}
      {selectedLocation && (
        <MarkerPopup
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default Globe;