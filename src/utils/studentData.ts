export interface Student {
  id: string;
  year: string;
  reason: string;
  country: string;
  town: string;
  coordinates: [number, number];
  isAthlete: boolean;
}

// Basic geocoding data for common locations
const locationCoordinates: Record<string, [number, number]> = {
  // England
  "London, England": [-0.1276, 51.5074],
  "Southampton, England": [-1.4044, 50.9097],
  "Cheltenham, England": [-2.0782, 51.8994],
  "York, England": [-1.0873, 53.9576],
  "Pinner, England": [-0.3816, 51.5928],
  "Aylesbury, England": [-0.8135, 51.8165],
  "Epsom, England": [-0.2692, 51.3304],
  "Chelmsford, England": [0.4690, 51.7356],
  "Haslemere, England": [-0.7102, 51.0888],
  "Tunbridge Wells, England": [0.2634, 51.1327],
  "Marlow, England": [-0.7768, 51.5719],
  "Banbury, England": [-1.3394, 52.0632],
  "Dartford, England": [0.2180, 51.4464],
  "Ruislip, England": [-0.4235, 51.5740],
  "Chichester, England": [-0.7792, 50.8365],
  "Godalming, England": [-0.6149, 51.1816],
  "Twickenham, England": [-0.3247, 51.4464],
  "Orpington, England": [0.0982, 51.3727],
  "Preston, England": [-2.7035, 53.7632],
  "Herne Bay, England": [1.1272, 51.3743],
  "Aylesford, England": [0.4613, 51.3019],
  "Harpenden, England": [-0.3542, 51.8151],
  "Dover, England": [1.3134, 51.1279],
  "Woking, England": [-0.5581, 51.3148],
  "Salisbury, England": [-1.7947, 51.0693],
  "Chipping Sodbury, England": [-2.3929, 51.5419],
  "Oxford, England": [-1.2577, 51.7520],
  "Danbury, England": [0.6034, 51.7005],
  "Loughton, England": [0.0558, 51.6410],
  "Carshalton Beeches, England": [-0.1670, 51.3618],
  "Skipton, England": [-2.0175, 53.9622],
  "West Molesey, England": [-0.3692, 51.4028],
  "Weston under Lizard, England": [-2.1541, 52.7405],
  "Carlisle, England": [-2.9336, 54.8951],
  "Totland Bay, England": [-1.5454, 50.6701],
  "Pontefract, England": [-1.3123, 53.6919],
  "Didcot Blewbury, England": [-1.2424, 51.6087],
  "Hockley, England": [0.6407, 51.6018],
  "Norwich, England": [1.2974, 52.6309],
  "Mill Hill, England": [-0.2159, 51.6151],
  "Saffron Walden, England": [0.2417, 52.0225],
  "Birchington, England": [1.3045, 51.3744],
  "Woburn Sands, England": [-0.6668, 52.0124],
  "Newbury, England": [-1.3230, 51.4013],
  "Maidstone, England": [0.5235, 51.2704],
  "Oxted, England": [-0.0049, 51.2548],
  "Milton Keynes, England": [-0.7594, 52.0406],
  "Liverpool, England": [-2.9916, 53.4084],
  "Lyme Regis, England": [-2.9336, 50.7251],
  "Kingston upon Thames, England": [-0.3064, 51.4128],
  "Exeter, England": [-3.5275, 50.7184],
  "Reading, England": [-0.9781, 51.4543],
  "Sale, England": [-2.3214, 53.4237],
  "Emsworth, England": [-0.9358, 50.8484],
  "Slough, England": [-0.5950, 51.5105],
  "Stocksfield, England": [-1.9441, 54.9466],
  "East Grinstead, England": [-0.0086, 51.1259],
  "Chester, England": [-2.8920, 53.1906],
  "Leeds, England": [-1.5491, 53.8008],
  "Durham, England": [-1.5849, 54.7761],
  "Redditch, England": [-1.9461, 52.3068],
  "Morden, England": [-0.1951, 51.4022],
  "Feltham, England": [-0.4095, 51.4481],
  "Shoreham-by-Sea, England": [-0.2731, 50.8302],
  "Abingdon, England": [-1.2876, 51.6710],
  "Hayes, England": [-0.4198, 51.5048],
  "Wallingford, England": [-1.1256, 51.5959],
  "Barnstaple, England": [-4.0579, 51.0804],
  "Devizes, England": [-1.9959, 51.3507],

  // Scotland  
  "Innerleithen, Scotland": [-3.0606, 55.6211],
  "Aberdeen, Scotland": [-2.0943, 57.1497],
  "Edinburgh, Scotland": [-3.1883, 55.9533],

  // International locations
  "Zurich, Switzerland": [8.5417, 47.3769],
  "Bucharest, Romania": [26.1025, 44.4268],
  "Marsaxlokk, Malta": [14.5437, 35.8422],
  "Täby, Sweden": [18.0687, 59.4439],
  "Waldbüttelbrunn, Germany": [9.8644, 49.7879],
  "Groningen, Netherlands": [6.5665, 53.2194],
  "Den Haag, Netherlands": [4.3007, 52.0705],
  "Abu Dhabi, United Arab Emirates": [54.3773, 24.4539],
  "Dubai, United Arab Emirates": [55.2708, 25.2048],
  "Bonn, Germany": [7.0982, 50.7374],
  "Bad Kreuznach, Germany": [7.8687, 49.8459],
  "Hong Kong, China": [114.1694, 22.3193],
  "Rockley, Barbados": [-59.6387, 13.0814],
  "La Massana, Spain": [1.5147, 42.5500],
  "Sotogrande, Spain": [-5.2847, 36.2894],
  "Santa Eularia Del Riu, Spain": [1.5347, 38.9849],
  "Klosters, Switzerland": [9.8769, 46.8709],
  "Porto Salvo, Portugal": [-9.3206, 38.7167],
  "Menzel Bourguiba, Tunisia": [9.7847, 37.1547],
  "Almuñécar, Spain": [-3.7306, 36.7347],
  "Dnipro, Ukraine": [35.0462, 48.4647],
  "Bergem, Luxembourg": [6.0653, 49.5319],
  "Karczemki, Poland": [18.5319, 54.1319],
  "Barueri, Brazil": [-46.8761, -23.5106],
  "Wien, Austria": [16.3738, 48.2082],
  "Wooburn Green, England": [-0.6708, 51.6047],
  "Zielona Gora, Poland": [15.5061, 51.9356],
  "Glastonbury, England": [-2.7147, 51.1481],
  "Sant Pere de Ribes, Spain": [1.7647, 41.2647],
  "Riga, Latvia": [24.1052, 56.9496],
  "Milan, Italy": [9.1900, 45.4642],
  "Beirut, Dubai": [35.5018, 33.8938], // This seems like incorrect data
  "Holte, Denmark": [12.5147, 55.8147],
  "Taipei, Taiwan": [121.5654, 25.0330],
  "Vossem, Belgium": [4.5147, 50.8147],
  "Drøbak, Norway": [10.6347, 59.6647],
  "Sanlucar de Barrameda, Spain": [-6.3547, 36.7847],
  "Sandys, Bermuda": [-64.3447, 32.2947],
  "Andelfingen, Switzerland": [8.6847, 47.5947],
  "Odesa, Ukraine": [30.7326, 46.4775],
  "Neu-Isenburg, Germany": [8.7047, 50.0547],
  "Castelnaudary, France": [1.9547, 43.3147],
  "Tallinn, Estonia": [24.7536, 59.4370],
  "Ajman, United Arab Emirates": [55.5136, 25.4052],
};

export function parseStudentData(): Student[] {
  const csvText = `Year (NC),Reason to join,Country Of Residence,Town
12,SEND,England,Devizes
12,Lifestyle,England,Southampton
13,Mental Health,England,CHELTENHAM
12,Medical,England,York
12,SEND,England,Pinner
13,SEND,England,Aylesbury
13,Lifestyle,United Arab Emirates,"2, Ajman"
12,SEND,Switzerland,Zurich
13,Sport or Performance,England,Epsom
12,Sport or Performance,England,Chelmsford
12,SEND,England,Haslemere
12,Sport or Performance,England,London
12,Mental Health,Scotland,Innerleithen
13,Sport or Performance,Romania,Bucharest
12,Mental Health,England,London
13,Mental Health,England,Tunbridge Wells
12,Sport or Performance,Malta,Marsaxlokk
12,SEND,England,Marlow
12,Sport or Performance,England,Banbury
13,SEND,England,Dartford
13,Mental Health,England,RUISLIP
12,Mental Health,England,London
12,Sport or Performance,England,Chichester
13,Sport or Performance,Sweden,Täby
12,Sport or Performance,England,London
12,Sport or Performance,England,Godalming
12,SEND,England,Twickenham
13,Lifestyle,Germany,Waldbüttelbrunn
13,SEND,England,
13,SEND,England,Orpington
12,Lifestyle,Netherlands,Groningen
12,Gifted,Netherlands,Den Haag
13,Sport or Performance,United Arab Emirates,Abu Dhabi
13,Sport or Performance,Germany,Bonn
12,Sport or Performance,Germany,Bad Kreuznach
13,SEND,England,London
12,SEND,England,Preston
13,Lifestyle,China,Hong Kong
13,SEND,England,Herne Bay
12,Mental Health,Barbados,Rockley
13,Mental Health,England,Tewkesbury
13,Sport or Performance,England,Weston under Lizard
13,SEND,England,London
12,SEND,England,Aylesford
12,SEND,England,Harpenden
13,Sport or Performance,Spain,La Massana
13,Mental Health,England,London
12,Lifestyle,Romania,Bucharest
13,Sport or Performance,Spain,Sotogrande
12,Medical,England,Carlisle
13,Lifestyle,Spain,Santa Eularia Del Riu
12,Sport or Performance,England,Dover
13,Medical,England,Woking
13,Mental Health,England,Salisbury
12,SEND,England,Chipping Sodbury
12,Sport or Performance,Switzerland,Klosters
12,Mental Health,England,Oxford
12,Lifestyle,England,London
12,Mental Health,England,Danbury
12,Sport or Performance,Portugal,Porto Salvo
12,Lifestyle,Tunisia,Menzel Bourguiba
13,Lifestyle,Spain,Almuñécar
13,Mental Health,England,Skipton
13,Mental Health,England,West Molesey
12,Medical,England,Loughton
13,Ukraine free place,Ukraine,Dnipro
13,Sport or Performance,Luxembourg,Bergem
12,Ukraine free place,Ukraine,Dnipro
12,Sport or Performance,Poland,Karczemki
12,SEND,England,Carshalton Beeches
12,Lifestyle,Spain,Almuñécar
13,Sport or Performance,Brazil,Barueri
12,Medical,Austria,Wien
12,SEND,United Arab Emirates,Abu Dhabi
13,Sport or Performance,England,Wooburn Green
13,Lifestyle,Poland,Zielona Gora
12,Lifestyle,Scotland,Aberdeen
13,Medical,England,Glastonbury
12,Mental Health,England,London
12,Sport or Performance,England,Totland Bay
12,Mental Health,England,Pontefract
12,Sport or Performance,England,Didcot Blewbury
13,Sport or Performance,Spain,Sant Pere de Ribes
12,Mental Health,England,Hockley
12,Lifestyle,Latvia,Riga
12,Sport or Performance,United Arab Emirates,Dubai
12,Lifestyle,England,Norwich
12,Sport or Performance,Italy,Milan
12,Sport or Performance,United Arab Emirates,Dubai
12,Mental Health,England,
12,Sport or Performance,Dubai,Beirut
12,Medical,England,
13,Lifestyle,England,Barnstaple
12,Mental Health,England,London
12,Lifestyle,England,Mill Hill
13,SEND,England,Saffron Walden
12,SEND,England,Birchington
12,Sport or Performance,England,Woburn Sands
12,Lifestyle,Denmark,Holte
13,Sport or Performance,England,
12,Medical,England,Newbury
13,,England,Maidstone
12,SEND,England,Oxted
12,Lifestyle,Taiwan,Taipei
12,Sport or Performance,England,Milton Keynes
13,Sport or Performance,United Arab Emirates,
13,Medical,England,Liverpool
13,SEND,England,Lyme Regis
13,Lifestyle,Belgium,Vossem
12,Mental Health,England,Kingston upon Thames
12,Lifestyle,England,Exeter
12,SEND,England,Reading
12,Mental Health,England,London
12,Lifestyle,United Arab Emirates,Dubai
13,Sport or Performance,England,Sale
12,Mental Health,England,Emsworth
13,Mental Health,England,Slough
13,Lifestyle,England,Stocksfield
12,Mental Health,England,East Grinstead
12,Mental Health,England,Salisbury
12,Medical,England,Chester
13,Lifestyle,Norway,Drøbak
12,Mental Health,England,London
12,SEND,England,Leeds
12,Sport or Performance,England,London
12,Mental Health,England,Durham
12,Lifestyle,Spain,Sanlucar de Barrameda
12,Mental Health,Bermuda,Sandys
12,Medical,England,Orpington
12,Mental Health,United Arab Emirates,Dubai
13,Mental Health,England,
12,Lifestyle,England,Redditch
12,Mental Health,England,London
12,SEND,England,Morden
13,Ukraine free place,Ukraine,Odesa
12,SEND,England,Feltham
12,Lifestyle,Switzerland,Andelfingen
12,Mental Health,England,shoreham-by-sea
13,SEND,England,Abingdon
12,SEND,England,Hayes
12,Mental Health,England,Tunbridge Wells
13,SEND,Scotland,Edinburgh
12,Lifestyle,England,York
13,Sport or Performance,Germany,Neu-Isenburg
12,SEND,England,Wallingford
13,Lifestyle,France,Castelnaudary
12,Medical,England,London
12,SEND,England,London
13,Lifestyle,Estonia,Tallinn`;

  const lines = csvText.split('\n');
  const students: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 4) {
      const year = parts[0];
      const reason = parts[1];
      const country = parts[2];
      let town = parts[3];
      
      // Handle quoted towns like "2, Ajman"
      if (town.startsWith('"')) {
        town = town.replace(/"/g, '');
      }
      
      // Clean up town names
      town = town.trim();
      if (town === '') continue; // Skip entries with no town
      
      // Create location key for coordinates lookup
      const locationKey = `${town}, ${country}`;
      let coordinates: [number, number];
      
      // Try to find coordinates, fallback to approximate locations
      if (locationCoordinates[locationKey]) {
        coordinates = locationCoordinates[locationKey];
      } else if (locationCoordinates[`${town}, England`] && country === 'England') {
        coordinates = locationCoordinates[`${town}, England`];
      } else {
        // Default coordinates for unknown locations (center of UK)
        coordinates = [-2.0, 54.0];
      }
      
      const isAthlete = reason === 'Sport or Performance';
      
      students.push({
        id: `student-${i}`,
        year,
        reason,
        country,
        town,
        coordinates,
        isAthlete
      });
    }
  }

  return students;
}