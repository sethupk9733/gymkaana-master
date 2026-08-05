export interface SuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'area' | 'city' | 'gym';
  searchValue: string;
}

export const CITIES_AND_AREAS: { [state: string]: { [city: string]: string[] } } = {
  "Tamil Nadu": {
    "Chennai": [
      "Anna Nagar", "T. Nagar", "Velachery", "Adyar", "OMR / Thoraipakkam",
      "Nungambakkam", "Guindy", "Porur", "Chromepet", "Tambaram",
      "Kilpauk", "Mylapore", "Ashok Nagar", "Vadapalani", "Ambattur",
      "Medavakkam", "Sholinganallur", "Kodambakkam", "Ekkattuthangal", "Perungudi",
      "Kotturpuram", "Royapettah", "Alwarpet", "Perambur", "Madipakkam"
    ],
    "Coimbatore": [
      "RS Puram", "Gandhipuram", "Peelamedu", "Saibaba Colony", "Saravanampatti",
      "Race Course", "Town Hall", "Singanallur", "Ramanathapuram", "Vadavalli",
      "Kovaipudur", "Ganapathy", "Tidel Park", "Thudiyalur", "Kuniamuthur"
    ],
    "Tirupur": [
      "Avinashi Road", "Palladam Road", "Dharapuram Road", "PN Road", "College Road",
      "Kangeyam Road", "Mangalam Road", "Boyampalayam", "Veerapandi", "Nallur", "Uthukuli Road"
    ],
    "Salem": [
      "Fairlands", "Hasthampatti", "Suramangalam", "Meyyanur", "Alagapuram",
      "Gugai", "Seelanaickenpatti", "Ammapet", "Kondalampatti", "Gorimedu"
    ],
    "Madurai": [
      "Anna Nagar", "KK Nagar", "Simmakkal", "SS Colony", "Tallakulam",
      "Sellur", "Kalavasal", "TVS Nagar", "Pasumalai", "Pudur", "Villapuram"
    ],
    "Udumalpet": [
      "Palani Road", "Dharapuram Road", "Pollachi Road", "Central Bus Stand Area",
      "Gandhi Nagar", "SV Puram", "Kuttaitidal", "Venkatesa Mill Area"
    ],
    "Avinashi": [
      "New Bus Stand Area", "Mangalam Road", "Sevur Road", "Tirupur Road",
      "Coimbatore Road", "Kaikattipudur"
    ],
    "Palladam": [
      "Coimbatore Road", "Tirupur Road", "Pollachi Road", "Dharapuram Road",
      "Karanampettai", "Naranapuram"
    ],
    "Erode": [
      "Perundurai Road", "Sampath Nagar", "Brough Road", "Gandhiji Road",
      "Moolapalayam", "Surampatti", "Thindal", "Veerappanchatram"
    ],
    "Karur": [
      "Covai Road", "Jawahar Bazaar", "Gandhigramam", "Pasupathipalayam", "Thanthonimalai", "Vengamedu"
    ],
    "Dindigul": [
      "Palani Road", "GT Road", "Trichy Road", "RM Colony", "Round Road", "Begambur"
    ],
    "Tiruchirappalli": [
      "Thillai Nagar", "Cantonment", "KK Nagar", "Srirangam", "Chatram", "TTV Nagar", "Woraiyur", "Kattur"
    ],
    "Vellore": [
      "Katpadi", "Sathuvachari", "Gandhinagar", "Bagayam", "Thorapadi", "Old Bus Stand Area"
    ],
    "Thanjavur": [
      "Medical College Road", "New Bus Stand Area", "Old Bus Stand Area", "MC Road", "Pullanaboodi"
    ],
    "Tirunelveli": [
      "Palayamkottai", "Vannarpettai", "Town Area", "High Ground", "Melapalayam"
    ],
    "Hosur": [
      "Bagalur Road", "SIPCOT Phase 1", "SIPCOT Phase 2", "Denkanikottai Road", "Mathigiri", "Zuzuvadi"
    ],
    "Pollachi": [
      "Coimbatore Road", "Palani Road", "Valparai Road", "Mahalingapuram", "Unjavelampatti"
    ]
  },
  "Karnataka": {
    "Bengaluru": [
      "Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Jayanagar",
      "Electronic City", "JP Nagar", "Marathahalli", "Bellandur", "BTM Layout",
      "Malleshwaram", "Banashankari", "Hebbal", "Yelahanka", "Sarjapur Road", "Rajajinagar", "Kalyan Nagar"
    ],
    "Mysore": [
      "Gokulam", "Kuvempunagar", "Vijayanagar", "Jayalakshmipuram", "Hebbal"
    ],
    "Mangalore": [
      "MG Road", "Kadri", "Bejai", "Lalbagh", "Surathkal"
    ]
  },
  "Kerala": {
    "Kochi": [
      "Kakkanad", "Edappally", "MG Road", "Vyttila", "Fort Kochi", "Kalamassery", "Palarivattom", "Kadavanthra", "Panampilly Nagar"
    ],
    "Thiruvananthapuram": [
      "Technopark", "Kazhakkoottam", "Pattom", "Kowdiar", "Vazhuthacaud"
    ],
    "Kozhikode": [
      "Mavoor Road", "Thondayad", "Calicut Beach", "Civil Station"
    ]
  },
  "Telangana": {
    "Hyderabad": [
      "Gachibowli", "HITECH City", "Madhapur", "Jubilee Hills", "Banjara Hills",
      "Kondapur", "Kukatpally", "Miyapur", "Secunderabad", "Begumpet", "Manikonda", "Ameerpet", "Dilsukhnagar"
    ]
  },
  "Maharashtra": {
    "Mumbai": [
      "Andheri East", "Andheri West", "Bandra West", "Borivali", "Juhu", "Powai",
      "Thane West", "Lower Parel", "Dadar", "Malad", "Navi Mumbai (Vashi)", "Navi Mumbai (Nerul)", "Chembur", "Goregaon", "Ghatkopar"
    ],
    "Pune": [
      "Viman Nagar", "Kothrud", "Kharadi", "Hinjewadi", "Baner", "Aundh", "Wakad", "Hadapsar"
    ]
  },
  "Delhi NCR": {
    "New Delhi": [
      "Connaught Place", "South Extension", "Dwarka", "Rohini", "Hauz Khas", "Saket", "Lajpat Nagar", "Karol Bagh", "Vasant Kunj"
    ],
    "Gurgaon": [
      "Cyber City", "Golf Course Road", "Sector 56", "DLF Phase 3", "Sohna Road"
    ],
    "Noida": [
      "Sector 18", "Sector 62", "Sector 50", "Greater Noida West"
    ]
  }
};

export function getSmartLocationSuggestions(query: string, gyms: any[] = []): SuggestionItem[] {
  const trimmed = (query || '').trim().toLowerCase();
  if (!trimmed) return [];

  const suggestions: SuggestionItem[] = [];
  const seenIds = new Set<string>();

  // 1. Search through static location hierarchy
  for (const [state, cities] of Object.entries(CITIES_AND_AREAS)) {
    for (const [city, areas] of Object.entries(cities)) {
      const cityLower = city.toLowerCase();
      const stateLower = state.toLowerCase();

      // Match City
      if (cityLower.includes(trimmed)) {
        const id = `city-${cityLower}`;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          suggestions.push({
            id,
            title: city,
            subtitle: `${state} • City`,
            type: 'city',
            searchValue: city
          });
        }
      }

      // Match Area
      for (const area of areas) {
        const areaLower = area.toLowerCase();
        if (areaLower.includes(trimmed)) {
          const id = `area-${areaLower}-${cityLower}`;
          if (!seenIds.has(id)) {
            seenIds.add(id);
            suggestions.push({
              id,
              title: area,
              subtitle: `${city}, ${state}`,
              type: 'area',
              searchValue: area
            });
          }
        }
      }
    }
  }

  // 2. Search through actual gym names and custom location strings in DB
  for (const gym of gyms) {
    if (!gym) continue;
    const name = gym.name || '';
    const location = gym.location || '';
    const city = gym.city || '';
    const area = gym.area || '';

    // Gym Name Match
    if (name.toLowerCase().includes(trimmed)) {
      const id = `gym-${gym._id || name}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        suggestions.push({
          id,
          title: name,
          subtitle: location || city || gym.address || 'Fitness Hub',
          type: 'gym',
          searchValue: name
        });
      }
    }

    // Dynamic location string from gym record
    if (location && location.toLowerCase().includes(trimmed)) {
      const id = `dynloc-${location.toLowerCase()}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        suggestions.push({
          id,
          title: location,
          subtitle: city ? `${city} • Area` : 'Locality',
          type: 'area',
          searchValue: location
        });
      }
    }
  }

  // Prioritize exact/prefix matches first, capped at 8 results
  return suggestions
    .sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().startsWith(trimmed) ? -1 : 1;
      const bTitleMatch = b.title.toLowerCase().startsWith(trimmed) ? -1 : 1;
      return aTitleMatch - bTitleMatch;
    })
    .slice(0, 8);
}
