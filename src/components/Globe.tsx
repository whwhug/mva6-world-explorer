import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerPopup } from './MarkerPopup';

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
    imageUrl?: string;
  };
}

// Tour content mapping - in order of tour stops
const TOUR_CONTENT: Record<string, { description: string; videoUrl?: string; imageUrl?: string }> = {
  'Ayoub': {
    description: 'Day in the Life video',
    videoUrl: 'https://dl.dropboxusercontent.com/scl/fi/75hg013ab1kpekz61p2e0/James-Story.mp4?rlkey=wc34m6o2mk0ojvkjbwro100rx&st=z7u44imv&raw=1'
  },
  'Rebecca Pinfield': {
    description: 'Flipped Learning: Four Pillars teaching approach',
    imageUrl: '/src/assets/rebecca-timetable.avif',
    videoUrl: '/src/assets/flipped-learning.mp4'
  },
  'Student TBC': {
    description: 'Matthew hosts Q&A with student'
  },
  'Matthew Morris': {
    description: 'List of MVA6 subjects. Matthew explains subject options (A Levels + EPQ). Sixth Form Subject Guide shared in chat for download'
  },
  'Clare': {
    description: 'Video of Clare introducing Maths'
  },
  'Rachel': {
    description: 'Recording of Rachel introducing English'
  },
  'Peter Stiller': {
    description: 'University of Reading badge, IAME COTF badges, karting photo. Matthew interviews Peter (2–3 minutes)'
  },
  'Laura': {
    description: '1-minute video on Careers & Futures at MVA6'
  },
  'Sophie': {
    description: 'Day in the Life video'
  },
  'Isabelle': {
    description: 'Q&A graphic'
  },
  'MVA6': {
    description: 'Graduation video'
  }
};

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
  const [tourLocations, setTourLocations] = useState<LocationData[]>([]);

  // Build tour locations from student and university data - IN ORDER
  useEffect(() => {
    if (students.length === 0 && universities.length === 0) return;

    // Define tour order by name
    const tourOrder = [
      'Ayoub', // Tunisia
      'Rebecca Pinfield', // East London
      'Student TBC', // London
      'Matthew Morris', // Spain
      'Clare', // Northern Ireland
      'Rachel', // Cambridge
      'Peter Stiller', // Reading
      'Laura', // Dubai
      'Sophie', // Taiwan
      'Isabelle', // Bristol
      'MVA6' // Holborn - Graduation
    ];

    const locations: LocationData[] = [];

    // Build tour in the specified order
    tourOrder.forEach(name => {
      // Check if it's a student
      const student = students.find(s => s.name === name);
      if (student) {
        const contentInfo = TOUR_CONTENT[name];
        if (contentInfo) {
          locations.push({
            id: student.id,
            name: `${student.town}, ${student.country}`,
            coordinates: student.coordinates,
            type: 'student',
            content: {
              title: `${student.name} - MVA6 Student`,
              description: contentInfo.description,
              videoUrl: contentInfo.videoUrl
            }
          });
        }
        return;
      }

      // Check if it's a university/staff member
      const university = universities.find(u => u.name === name);
      if (university) {
        const contentInfo = TOUR_CONTENT[name];
        if (contentInfo) {
          locations.push({
            id: `uni-${university.id}`,
            name: `${university.town}, ${university.location}`,
            coordinates: university.coordinates,
            type: 'teacher',
            content: {
              title: `${university.name} - ${university.role}`,
              description: contentInfo.description,
              imageUrl: contentInfo.imageUrl
            }
          });
        }
      }
    });

    setTourLocations(locations);
  }, [students, universities]);

  const visitNextDestination = () => {
    if (isNavigating || !map.current || tourLocations.length === 0) return;
    
    setIsNavigating(true);
    
    // Close current popup first
    setSelectedLocation(null);
    
    const nextIndex = (currentMarkerIndex + 1) % tourLocations.length;
    const nextLocation = tourLocations[nextIndex];
    
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
    if (isNavigating || !map.current || tourLocations.length === 0) return;
    
    setIsNavigating(true);
    
    // Close current popup first
    setSelectedLocation(null);
    
    const prevIndex = currentMarkerIndex === 0 ? tourLocations.length - 1 : currentMarkerIndex - 1;
    const prevLocation = tourLocations[prevIndex];
    
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
        <div class="text-sm text-muted-foreground mb-1">${student.name}</div>
        <div class="text-sm text-muted-foreground mb-1">Year ${student.year}</div>
        <div class="text-sm text-foreground font-medium">${student.country}</div>
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
        <div class="text-sm font-medium text-foreground mb-1">${university.name}</div>
        <div class="text-sm text-muted-foreground mb-1">${university.role}</div>
        <div class="flex items-center gap-1 text-sm text-foreground font-medium mt-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>${university.town}, ${university.location}</span>
        </div>
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
    if (!mapContainer.current) return;

    // Parse student and university data asynchronously
    const initializeData = async () => {
      const studentData = await parseStudentData();
      const universityData = parseUniversityData();
      setStudents(studentData);
      setUniversities(universityData);
    };

    initializeData();

    // Initialize map - token can be added later
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE';
    
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

      // Add student and university markers after style loads
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
  }, []);

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

  // Add tour markers when tourLocations are ready
  useEffect(() => {
    if (!map.current || tourLocations.length === 0) return;

    // Remove any existing tour markers (stored globally for cleanup)
    const existingMarkers = document.querySelectorAll('.globe-marker');
    existingMarkers.forEach(marker => marker.remove());

    tourLocations.forEach((location, index) => {
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
  }, [tourLocations]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Loading overlay */}
      {isLoading && (
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
      
      {/* Layer Controls - Positioned on top right with extra margin for zoom controls */}
      <div className="absolute top-6 right-24 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg min-w-[180px]">
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

      {/* Tour Controls - Bottom right */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-3">
        <button
          onClick={() => {
            setCurrentMarkerIndex(-1);
            visitNextDestination();
          }}
          disabled={isNavigating || tourLocations.length === 0}
          className="bg-secondary/90 hover:bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-secondary/20 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Start Tour</span>
          </div>
        </button>
        
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


      {/* Marker popup */}
      {selectedLocation && (
        <MarkerPopup
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        onNext={visitNextDestination}
        onPrevious={visitPreviousDestination}
        currentIndex={currentMarkerIndex + 1}
        totalCount={tourLocations.length}
        isNavigating={isNavigating}
        />
      )}
    </div>
  );
};

export default Globe;