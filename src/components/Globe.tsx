import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerPopup } from './MarkerPopup';
import { useMapboxToken } from '../hooks/useMapboxToken';
import { parseStudentData, Student } from '../utils/studentData';
import { parseUniversityData, University } from '../utils/universityData';
import { User, ToggleLeft, ToggleRight, GraduationCap } from 'lucide-react';

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
    type: 'student',
    content: {
      title: 'Meet James - MVA6 Student',
      description: 'Mathematics & Sciences Department Head, leading innovative STEM education across our global network.',
      videoUrl: 'https://dl.dropboxusercontent.com/scl/fi/75hg013ab1kpekz61p2e0/James-Story.mp4?rlkey=wc34m6o2mk0ojvkjbwro100rx&st=z7u44imv&raw=1'
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
  },
  {
    id: 'malaga',
    name: 'Malaga, Spain',
    coordinates: [-4.4217, 36.7213],
    type: 'teacher',
    content: {
      title: 'Meet Matthew - Head of Sixth Form',
      description: 'Leading our innovative sixth form program with passion and expertise, ensuring every student reaches their full potential.',
      logoUrl: '/api/placeholder/120/120'
    }
  }
];

const Globe = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [showStudents, setShowStudents] = useState(true);
  const [showTeachers, setShowTeachers] = useState(true);
  const [showUniversities, setShowUniversities] = useState(true);
  const [studentMarkers, setStudentMarkers] = useState<mapboxgl.Marker[]>([]);
  const [universityMarkers, setUniversityMarkers] = useState<mapboxgl.Marker[]>([]);
  const { token, isLoading: tokenLoading } = useMapboxToken();

  const visitNextDestination = () => {
    if (isNavigating || !map.current) return;
    
    setIsNavigating(true);
    
    // Close current popup first
    setSelectedLocation(null);
    
    const nextIndex = (currentMarkerIndex + 1) % LOCATIONS.length;
    const nextLocation = LOCATIONS[nextIndex];
    
    // Smooth camera animation to the marker
    map.current.flyTo({
      center: nextLocation.coordinates,
      zoom: 6,
      pitch: 45,
      bearing: 0,
      speed: 0.8,
      curve: 1.2,
      essential: true
    });

    // Update states after animation completes and open new popup
    setTimeout(() => {
      setCurrentMarkerIndex(nextIndex);
      setSelectedLocation(nextLocation);
      setIsNavigating(false);
    }, 2000);
  };

  const visitPreviousDestination = () => {
    if (isNavigating || !map.current) return;
    
    setIsNavigating(true);
    
    // Close current popup first
    setSelectedLocation(null);
    
    const prevIndex = currentMarkerIndex === 0 ? LOCATIONS.length - 1 : currentMarkerIndex - 1;
    const prevLocation = LOCATIONS[prevIndex];
    
    map.current.flyTo({
      center: prevLocation.coordinates,
      zoom: 6,
      pitch: 45,
      bearing: 0,
      speed: 0.8,
      curve: 1.2,
      essential: true
    });

    setTimeout(() => {
      setCurrentMarkerIndex(prevIndex);
      setSelectedLocation(prevLocation);
      setIsNavigating(false);
    }, 2000);
  };

  // Add student markers to the map
  const addStudentMarkers = () => {
    if (!map.current || students.length === 0) return;

    // Remove existing student markers
    studentMarkers.forEach(marker => {
      marker.remove();
      if ((marker as any).tooltip && (marker as any).tooltip.parentNode) {
        (marker as any).tooltip.parentNode.removeChild((marker as any).tooltip);
      }
    });
    setStudentMarkers([]);

    const newMarkers: mapboxgl.Marker[] = [];

    students.forEach((student) => {
      if (!student.town || (student.coordinates[0] === -2.0 && student.coordinates[1] === 54.0)) return; // Skip unknown locations

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'student-marker';
      markerElement.innerHTML = `
        <div class="w-5 h-5 rounded-full flex items-center justify-center border-2 bg-blue-500 border-blue-600 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
          </svg>
        </div>
      `;

      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'student-tooltip hidden absolute bg-background border border-border rounded-lg p-3 shadow-lg z-50 min-w-[200px] pointer-events-none';
      tooltip.innerHTML = `
        <div class="text-sm font-medium text-foreground mb-1">MVA6 Student</div>
        <div class="text-sm text-muted-foreground mb-1">Year ${student.year}</div>
        ${student.isAthlete ? '<div class="text-sm text-yellow-600 mb-1 font-medium">Young athlete</div>' : ''}
        <div class="text-sm text-foreground font-medium">${student.town}, ${student.country}</div>
      `;

      document.body.appendChild(tooltip);

      // Add hover events
      markerElement.addEventListener('mouseenter', (e) => {
        tooltip.classList.remove('hidden');
        const rect = markerElement.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width + 10}px`;
        tooltip.style.top = `${rect.top + rect.height / 2 - tooltip.offsetHeight / 2}px`;
      });

      markerElement.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(student.coordinates)
        .addTo(map.current!);

      newMarkers.push(marker);

      // Store tooltip reference for cleanup
      (marker as any).tooltip = tooltip;
    });

    setStudentMarkers(newMarkers);
  };

  // Add university markers to the map
  const addUniversityMarkers = () => {
    if (!map.current || universities.length === 0) return;

    // Remove existing university markers
    universityMarkers.forEach(marker => {
      marker.remove();
      if ((marker as any).tooltip && (marker as any).tooltip.parentNode) {
        (marker as any).tooltip.parentNode.removeChild((marker as any).tooltip);
      }
    });
    setUniversityMarkers([]);

    const newMarkers: mapboxgl.Marker[] = [];

    universities.forEach((university) => {
      // Create marker element with graduation cap icon
      const markerElement = document.createElement('div');
      markerElement.className = 'university-marker';
      markerElement.innerHTML = `
        <div class="w-6 h-6 rounded-lg flex items-center justify-center border-2 bg-purple-500 border-purple-600 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
      `;

      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'university-tooltip hidden absolute bg-background border border-border rounded-lg p-3 shadow-lg z-50 min-w-[250px] pointer-events-none';
      tooltip.innerHTML = `
        <div class="text-sm font-medium text-foreground mb-1">MVA6 Alumni</div>
        <div class="text-sm text-muted-foreground mb-1">${university.university}</div>
        ${university.course ? `<div class="text-sm text-muted-foreground mb-1">${university.course}</div>` : ''}
        <div class="text-sm text-foreground font-medium">Pin location</div>
        <div class="text-sm text-foreground font-medium">${university.location}</div>
      `;

      document.body.appendChild(tooltip);

      // Add hover events
      markerElement.addEventListener('mouseenter', (e) => {
        tooltip.classList.remove('hidden');
        const rect = markerElement.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width + 10}px`;
        tooltip.style.top = `${rect.top + rect.height / 2 - tooltip.offsetHeight / 2}px`;
      });

      markerElement.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(university.coordinates)
        .addTo(map.current!);

      newMarkers.push(marker);

      // Store tooltip reference for cleanup
      (marker as any).tooltip = tooltip;
    });

    setUniversityMarkers(newMarkers);
  };

  // Toggle student markers visibility
  const toggleStudents = () => {
    setShowStudents(!showStudents);
  };

  const toggleTeachers = () => {
    setShowTeachers(!showTeachers);
    // TODO: Implement teacher marker toggle when teacher data is added
  };

  const toggleUniversities = () => {
    setShowUniversities(!showUniversities);
  };

  useEffect(() => {
    if (!mapContainer.current || tokenLoading || !token) return;

    // Parse student and university data
    const studentData = parseStudentData();
    const universityData = parseUniversityData();
    setStudents(studentData);
    setUniversities(universityData);

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

      // Add student and university markers after main markers are loaded
      addStudentMarkers();
      addUniversityMarkers();

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
      // Remove student markers and tooltips
      studentMarkers.forEach(marker => {
        marker.remove();
        if ((marker as any).tooltip && (marker as any).tooltip.parentNode) {
          (marker as any).tooltip.parentNode.removeChild((marker as any).tooltip);
        }
      });
      // Remove university markers and tooltips
      universityMarkers.forEach(marker => {
        marker.remove();
        if ((marker as any).tooltip && (marker as any).tooltip.parentNode) {
          (marker as any).tooltip.parentNode.removeChild((marker as any).tooltip);
        }
      });
      map.current?.remove();
    };
  }, [token, tokenLoading]);

  // Update student markers when students data changes
  useEffect(() => {
    if (map.current && students.length > 0) {
      addStudentMarkers();
    }
  }, [students]);

  // Update university markers when universities data changes
  useEffect(() => {
    if (map.current && universities.length > 0) {
      addUniversityMarkers();
    }
  }, [universities]);

  // Update marker visibility when toggle changes
  useEffect(() => {
    if (studentMarkers.length > 0) {
      studentMarkers.forEach(marker => {
        if (showStudents) {
          marker.addTo(map.current!);
        } else {
          marker.remove();
        }
      });
    }
  }, [showStudents, studentMarkers]);

  // Update university marker visibility when toggle changes
  useEffect(() => {
    if (universityMarkers.length > 0) {
      universityMarkers.forEach(marker => {
        if (showUniversities) {
          marker.addTo(map.current!);
        } else {
          marker.remove();
        }
      });
    }
  }, [showUniversities, universityMarkers]);

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
      
      {/* Event Title - Centered at top */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg">Open Event</h1>
        <p className="text-lg text-white/90 drop-shadow-lg mt-2">October 16th 2025, 6pm BST</p>
      </div>
      
      {/* Next Stop Button - Right side */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={visitNextDestination}
          disabled={isNavigating}
          className="bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-primary/20 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">Next Stop</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
      
      {/* Layer Controls - Positioned on bottom right */}
      <div className="absolute bottom-6 right-6 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg min-w-[180px]">
        <h3 className="text-sm font-semibold text-foreground mb-3">Map Layers</h3>
        
        {/* Students Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-foreground">Students</span>
          </div>
          <button
            onClick={toggleStudents}
            className="flex items-center p-1 rounded transition-colors hover:bg-muted"
            aria-label="Toggle students"
          >
            {showStudents ? (
              <ToggleRight className="w-5 h-5 text-primary" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Teachers Toggle - Prepared for future data */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-foreground">Teachers</span>
          </div>
          <button
            onClick={toggleTeachers}
            className="flex items-center p-1 rounded transition-colors hover:bg-muted"
            aria-label="Toggle teachers"
            disabled={true}
            title="Coming soon"
          >
            {showTeachers ? (
              <ToggleRight className="w-5 h-5 text-muted-foreground/50" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-muted-foreground/50" />
            )}
          </button>
        </div>

        {/* Universities Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-3 h-3 text-purple-500" />
            <span className="text-sm text-foreground">Universities</span>
          </div>
          <button
            onClick={toggleUniversities}
            className="flex items-center p-1 rounded transition-colors hover:bg-muted"
            aria-label="Toggle universities"
          >
            {showUniversities ? (
              <ToggleRight className="w-5 h-5 text-primary" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>


      {/* Marker popup */}
      {selectedLocation && (
        <MarkerPopup
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onNext={visitNextDestination}
          onPrevious={visitPreviousDestination}
          currentIndex={currentMarkerIndex + 1}
          totalCount={LOCATIONS.length}
          isNavigating={isNavigating}
        />
      )}
    </div>
  );
};

export default Globe;