export interface University {
  id: number;
  university: string;
  location: string;
  course: string;
  coordinates: [number, number]; // [longitude, latitude]
}

// Location coordinates for universities
const universityLocationCoordinates: Record<string, [number, number]> = {
  "Belfast, Northern Ireland": [-5.9301, 54.5973],
  "London, England": [-0.1276, 51.5074],
  "Manchester, England": [-2.2426, 53.4808],
  "Nottingham, England": [-1.1581, 52.9548],
  "Exeter, England": [-3.5339, 50.7184],
  "Cardiff, Wales": [-3.1791, 51.4816],
  "Sheffield, England": [-1.4701, 53.3811],
  "York, England": [-1.0873, 53.9600],
  "Bath, England": [-2.3590, 51.3758],
  "Aberdeen, Scotland": [-2.0943, 57.1497],
  "Edinburgh, Scotland": [-3.1883, 55.9533],
  "Reading, England": [-0.9781, 51.4543],
  "Aberystwyth, Wales": [-4.0816, 52.4140],
  "Brighton, England": [-0.1372, 50.8225],
  "Birmingham, England": [-1.8904, 52.4862],
  "San Francisco, USA": [-122.4194, 37.7749],
  "Pennsylvania, USA": [-77.1945, 41.2033],
  "Dubai, UAE": [55.2708, 25.2048],
};

export function parseUniversityData(): University[] {
  const csvData = `University,Location,Course,,
Queen's Belfast,"Belfast, Northern Ireland",Psychology (BSc),,
"Regent's, London","London, England",Psychology (BSc),,
Manchester,"Manchester, England",Philosophy (BA),,
Nottingham,"Nottingham, England","Religion, Philosophy & Ethics (BA)",,
Nottingham,"Nottingham, England",Economics (BSc),,
Nottingham,"Nottingham, England",History (BA),,
Exeter,"Exeter, England",Archaeology (BA),,
Cardiff,"Cardiff, Wales",Archaeology (BA),,
Cardiff,"Cardiff, Wales",History (BA),,
Sheffield,"Sheffield, England",Physics with placement (BSc),,
York,"York, England",Physics with placement (BSc),,
Manchester Met,"Manchester, England",Fashion Marketing (BA),,
Bath Spa,"Bath, England",Psychology (BSc),,
Robert Gordon (RGU),"Aberdeen, Scotland",Architectural Technology,,
Edinburgh Napier,"Edinburgh, Scotland",Architectural Technology (BSc),,
London Metropolitan,"London, England",Business (BA),,
Reading,"Reading, England",History (BA),,
Roehampton,"London, England",,,
Aberystwyth,"Aberystwyth, Wales",Modern Languages (BA),,
BIMM Brighton,"Brighton, England",Music Production (BA),,
King's College London,"London, England",Biochemistry (BSc),,
Birmingham,"Birmingham, England",Economics (BSc),,
York St John,"York, England",Business with placement (BA),,
Academy of Art University,"San Francisco, USA",,,
Lehigh University,"Pennsylvania, USA",,,
University (Dubai),"Dubai, UAE",Music or International Business (BA),,`;

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
    
    if (parts.length >= 3) {
      const university = parts[0];
      const location = parts[1];
      const course = parts[2] || '';
      
      // Look up coordinates
      let coordinates: [number, number] = universityLocationCoordinates[location] || [0, 51.5074]; // Default to London
      
      universities.push({
        id: i,
        university,
        location,
        course,
        coordinates
      });
    }
  }
  
  return universities;
}