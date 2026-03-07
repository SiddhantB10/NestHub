// Mumbai Rental Market Data — derived from House_Rent_Dataset.csv (Mumbai-only, filtered)
// Source: Real rental listings from Mumbai (2022 dataset, 200+ listings)
// Used to benchmark PG/hostel prices against market apartment rents

export const mumbaiMarketData = {
  source: 'House Rent Dataset 2022 — Mumbai Listings',
  totalListings: 200,
  lastUpdated: '2022-07',

  // Area-wise average apartment rents (from CSV, grouped by locality)
  areaRents: {
    'Vile Parle West': {
      avg1BHK: 33500,
      avg2BHK: 80000,
      sampleSize: 4,
      minRent: 18000,
      maxRent: 90000,
      furnishing: 'Semi-Furnished to Furnished',
      localities: ['Sai Palace Apartment', 'Irla', 'Navpada'],
    },
    'Vile Parle East': {
      avg1BHK: 40000,
      avg2BHK: 80000,
      sampleSize: 3,
      minRent: 40000,
      maxRent: 80000,
      furnishing: 'Semi-Furnished to Furnished',
      localities: ['Nehru Road', 'Parle Tilak Vidyalaya area'],
    },
    'Juhu': {
      avg1BHK: null,
      avg2BHK: null,
      avgOverall: 273000,
      sampleSize: 4,
      minRent: 49500,
      maxRent: 400000,
      furnishing: 'Furnished',
      localities: ['Juhu Tara', 'JVPD Scheme', 'Juhu Lane'],
      note: 'Premium locality — mostly luxury apartments',
    },
    'Andheri West': {
      avg1BHK: 25000,
      avg2BHK: 47000,
      sampleSize: 8,
      minRent: 20000,
      maxRent: 400000,
      furnishing: 'Semi-Furnished',
      localities: ['Shaheen Apartment', 'DN Nagar', 'Lokhandwala', 'Oshiwara'],
    },
    'Andheri East': {
      avg1BHK: 33500,
      avg2BHK: 42000,
      sampleSize: 6,
      minRent: 27000,
      maxRent: 50000,
      furnishing: 'Semi-Furnished to Furnished',
      localities: ['Azad Nagar', 'MIDC', 'Marol', 'Sakinaka'],
    },
    'Santacruz West': {
      avg1BHK: null,
      avg2BHK: 70000,
      avg3BHK: 100000,
      sampleSize: 5,
      minRent: 21000,
      maxRent: 160000,
      furnishing: 'Semi-Furnished to Furnished',
      localities: ['Linking Road', 'Santacruz Society'],
    },
    'Santacruz East': {
      avg1BHK: null,
      avg2BHK: 65000,
      sampleSize: 2,
      minRent: 65000,
      maxRent: 65000,
      furnishing: 'Semi-Furnished',
      localities: ['Kabra Centroid'],
    },
    'Bandra West': {
      avg1BHK: 67500,
      avg2BHK: 130000,
      avg3BHK: 190000,
      sampleSize: 15,
      minRent: 55000,
      maxRent: 270000,
      furnishing: 'Semi-Furnished to Furnished',
      localities: ['Pali Hill', 'Turner Road', 'Carter Road'],
      note: 'Premium area — significantly above average',
    },
    'Khar West': {
      avg1BHK: null,
      avg2BHK: null,
      avg3BHK: 165000,
      sampleSize: 3,
      minRent: 45000,
      maxRent: 170000,
      furnishing: 'Semi-Furnished to Furnished',
      localities: ['Old Khar', 'Khar Society'],
    },
    'Goregaon': {
      avg1BHK: 25700,
      avg2BHK: null,
      avg3BHK: 117500,
      sampleSize: 5,
      minRent: 19400,
      maxRent: 150000,
      furnishing: 'Semi-Furnished',
      localities: ['Goregaon West', 'Goregaon East', 'Oberoi Esquire'],
    },
    'Malad': {
      avg1BHK: 20000,
      avg2BHK: 60000,
      avg3BHK: 72500,
      sampleSize: 6,
      minRent: 13000,
      maxRent: 75000,
      furnishing: 'Semi-Furnished to Unfurnished',
      localities: ['Malad East', 'Malad West', 'Kanakia Levels'],
    },
    'Borivali': {
      avg1BHK: 28500,
      avg2BHK: 35000,
      avg3BHK: 55000,
      sampleSize: 5,
      minRent: 27000,
      maxRent: 55000,
      furnishing: 'Semi-Furnished to Furnished',
      localities: ['Borivali West', 'Borivali East', 'Ekta Meadows'],
    },
    'Kandivali': {
      avg1BHK: 22000,
      avg2BHK: 38500,
      sampleSize: 5,
      minRent: 21000,
      maxRent: 42000,
      furnishing: 'Semi-Furnished to Unfurnished',
      localities: ['Kandivali East', 'Kandivali West', 'Thakur Village'],
    },
    'Powai': {
      avg1BHK: 32000,
      avg2BHK: 62000,
      avg3BHK: 89000,
      sampleSize: 5,
      minRent: 32000,
      maxRent: 89000,
      furnishing: 'Semi-Furnished',
      localities: ['Hiranandani Castle Rock', 'Lake Florence', 'Lake Bloom'],
    },
    'Mira Road': {
      avg1BHK: 13750,
      avg2BHK: 16000,
      sampleSize: 5,
      minRent: 13000,
      maxRent: 20000,
      furnishing: 'Semi-Furnished to Unfurnished',
      localities: ['Mira Road East', 'Man Opus', 'DB Ozone'],
      note: 'Budget-friendly area — far from NMIMS (25+ km)',
    },
  },

  // City-wide aggregates
  cityStats: {
    median1BHK: 25000,
    median2BHK: 50000,
    median3BHK: 100000,
    avgRent: 72000,
    minRent: 6500,
    maxRent: 400000,
    avgSizeSqFt: 750,
    totalAreas: 50,
    percentBachelorFriendly: 68,
  },

  // NMIMS-relevant areas (within ~3 km radius) rent summary
  nmimsAreaStats: {
    areas: ['Vile Parle West', 'Vile Parle East', 'Juhu', 'Andheri West', 'Andheri East', 'Santacruz West'],
    avg1BHKRent: 33000,
    avg2BHKRent: 64000,
    minRentNearby: 18000,
    maxRentNearby: 400000,
    avgRentNearby: 52000,
  },
};

// Get market comparison data for a specific hostel area
export function getMarketComparison(area) {
  // Normalize area name for matching
  const normalizedArea = area.trim();
  const data = mumbaiMarketData.areaRents[normalizedArea];

  if (!data) {
    // Try partial match
    const match = Object.keys(mumbaiMarketData.areaRents).find(
      key => normalizedArea.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedArea.toLowerCase())
    );
    if (match) return mumbaiMarketData.areaRents[match];
    return null;
  }
  return data;
}

// Calculate savings vs renting an apartment
export function calculateSavingsVsRent(hostelPrice, area) {
  const marketData = getMarketComparison(area);
  if (!marketData) return null;

  const benchmarkRent = marketData.avg1BHK || marketData.minRent;
  if (!benchmarkRent) return null;

  const savings = benchmarkRent - hostelPrice;
  const savingsPercent = Math.round((savings / benchmarkRent) * 100);

  return {
    benchmarkRent,
    savings: Math.max(0, savings),
    savingsPercent: Math.max(0, savingsPercent),
    area,
    note: marketData.note || null,
  };
}
