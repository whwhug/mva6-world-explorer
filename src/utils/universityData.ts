export interface University {
  id: number;
  name: string;
  role: string;
  location: string;
  town: string;
  coordinates: [number, number]; // [longitude, latitude]
}

// Location coordinates for staff/alumni
const universityLocationCoordinates: Record<string, [number, number]> = {
  "East London, England": [0.0715, 51.5427],
  "Barcelona, Spain": [2.1734, 41.3851],
  "Belfast, Northern Ireland": [-5.9301, 54.5973],
  "Cambridge, England": [0.1218, 52.2053],
  "Reading, England": [-0.9781, 51.4543],
  "Dubai, United Arab Emirates": [55.2708, 25.2048],
  "Bristol, England": [-2.5879, 51.4545],
  "Holborn, England": [-0.1200, 51.5174],
};

export function parseUniversityData(): University[] {
  const csvData = `Name,Role,Location,Town
Rebecca Pinfield,Vice Principal Pastoral,England,East London
Matthew Morris,Head of Sixth Form,Spain,Barcelona
Clare,Maths Teacher,Northern Ireland,Belfast
Rachel,Head of English,England,Cambridge
Peter Stiller,Alumni,England,Reading
Laura,Careers Lead,United Arab Emirates,Dubai
Isabelle,Admissions Advisor,England,Bristol
MVA6,Graduation,England,Holborn`;

  const universities: University[] = [];
  const lines = csvData.split('\n');
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line, handling quoted values
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    
    if (parts.length >= 4) {
      const name = parts[0];
      const role = parts[1];
      const location = parts[2];
      const town = parts[3];
      
      // Look up coordinates
      const locationKey = `${town}, ${location}`;
      let coordinates: [number, number] = universityLocationCoordinates[locationKey] || [-0.1276, 51.5074]; // Default to London
      
      universities.push({
        id: i,
        name,
        role,
        location,
        town,
        coordinates
      });
    }
  }
  
  return universities;
}