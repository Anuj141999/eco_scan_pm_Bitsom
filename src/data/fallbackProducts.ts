import { EcoScore, ProductSuggestion } from '@/components/scanner/EcoScoreCard';
import { ProductComposition } from '@/components/scanner/ProductDetailsModal';

interface FallbackProduct {
  result: EcoScore;
  suggestions: ProductSuggestion[];
}

// Diverse fallback products for different scenarios
const fallbackProducts: FallbackProduct[] = [
  {
    result: {
      grade: 'C',
      productName: 'Packaged Snack Product',
      category: 'Food & Beverages',
      carbonFootprint: 18,
      biodegradable: 35,
      composition: {
        materials: [
          { name: 'Plastic Film', percentage: 30, isEcoFriendly: false, recyclable: false },
          { name: 'Processed Ingredients', percentage: 55, isEcoFriendly: false, recyclable: false },
          { name: 'Natural Flavoring', percentage: 15, isEcoFriendly: true, recyclable: false },
        ],
        packaging: { type: 'Plastic Wrapper', recyclable: false, biodegradable: false },
        certifications: [],
        environmentalImpact: { waterUsage: 'medium', energyConsumption: 'medium', wasteGeneration: 'high' },
      } as ProductComposition,
    },
    suggestions: [
      {
        name: 'Slurrp Farm Millet Puffs',
        grade: 'A',
        amazonLink: 'https://www.amazon.in/s?k=slurrp+farm+millet+puffs',
        flipkartLink: 'https://www.flipkart.com/search?q=slurrp+farm+millet+puffs',
        carbonFootprint: 8,
        biodegradable: 85,
      },
      {
        name: 'Too Yumm Veggie Stix',
        grade: 'B',
        amazonLink: 'https://www.amazon.in/s?k=too+yumm+veggie+stix',
        flipkartLink: 'https://www.flipkart.com/search?q=too+yumm+veggie+stix',
        carbonFootprint: 12,
        biodegradable: 70,
      },
    ],
  },
  {
    result: {
      grade: 'D',
      productName: 'Plastic Bottle Beverage',
      category: 'Food & Beverages',
      carbonFootprint: 25,
      biodegradable: 20,
      composition: {
        materials: [
          { name: 'PET Plastic', percentage: 40, isEcoFriendly: false, recyclable: true },
          { name: 'High Fructose Corn Syrup', percentage: 35, isEcoFriendly: false, recyclable: false },
          { name: 'Purified Water', percentage: 25, isEcoFriendly: true, recyclable: false },
        ],
        packaging: { type: 'Plastic Wrapper', recyclable: true, biodegradable: false },
        certifications: [],
        environmentalImpact: { waterUsage: 'high', energyConsumption: 'high', wasteGeneration: 'high' },
      } as ProductComposition,
    },
    suggestions: [
      {
        name: 'Paper Boat Traditional Drinks',
        grade: 'A',
        amazonLink: 'https://www.amazon.in/s?k=paper+boat+drinks',
        flipkartLink: 'https://www.flipkart.com/search?q=paper+boat+drinks',
        carbonFootprint: 10,
        biodegradable: 80,
      },
      {
        name: 'Raw Pressery Cold Pressed Juice',
        grade: 'S',
        amazonLink: 'https://www.amazon.in/s?k=raw+pressery+juice',
        flipkartLink: 'https://www.flipkart.com/search?q=raw+pressery+juice',
        carbonFootprint: 6,
        biodegradable: 92,
      },
    ],
  },
  {
    result: {
      grade: 'C',
      productName: 'Personal Care Product',
      category: 'Personal Care',
      carbonFootprint: 20,
      biodegradable: 40,
      composition: {
        materials: [
          { name: 'Plastic Container', percentage: 25, isEcoFriendly: false, recyclable: true },
          { name: 'Chemical Ingredients', percentage: 50, isEcoFriendly: false, recyclable: false },
          { name: 'Natural Extracts', percentage: 25, isEcoFriendly: true, recyclable: false },
        ],
        packaging: { type: 'Plastic Wrapper', recyclable: true, biodegradable: false },
        certifications: [],
        environmentalImpact: { waterUsage: 'medium', energyConsumption: 'medium', wasteGeneration: 'medium' },
      } as ProductComposition,
    },
    suggestions: [
      {
        name: 'Mamaearth Natural Products',
        grade: 'A',
        amazonLink: 'https://www.amazon.in/s?k=mamaearth+natural',
        flipkartLink: 'https://www.flipkart.com/search?q=mamaearth+natural',
        carbonFootprint: 9,
        biodegradable: 82,
      },
      {
        name: 'Khadi Natural Herbal',
        grade: 'S',
        amazonLink: 'https://www.amazon.in/s?k=khadi+natural+herbal',
        flipkartLink: 'https://www.flipkart.com/search?q=khadi+natural+herbal',
        carbonFootprint: 5,
        biodegradable: 95,
      },
    ],
  },
  {
    result: {
      grade: 'D',
      productName: 'Household Cleaning Product',
      category: 'Household',
      carbonFootprint: 28,
      biodegradable: 25,
      composition: {
        materials: [
          { name: 'HDPE Plastic', percentage: 30, isEcoFriendly: false, recyclable: true },
          { name: 'Chemical Surfactants', percentage: 55, isEcoFriendly: false, recyclable: false },
          { name: 'Fragrance', percentage: 15, isEcoFriendly: false, recyclable: false },
        ],
        packaging: { type: 'Plastic Wrapper', recyclable: true, biodegradable: false },
        certifications: [],
        environmentalImpact: { waterUsage: 'high', energyConsumption: 'medium', wasteGeneration: 'high' },
      } as ProductComposition,
    },
    suggestions: [
      {
        name: 'Beco Eco-Friendly Cleaner',
        grade: 'A',
        amazonLink: 'https://www.amazon.in/s?k=beco+eco+friendly+cleaner',
        flipkartLink: 'https://www.flipkart.com/search?q=beco+eco+friendly+cleaner',
        carbonFootprint: 8,
        biodegradable: 88,
      },
      {
        name: 'The Better Home Plant-Based',
        grade: 'S',
        amazonLink: 'https://www.amazon.in/s?k=the+better+home+cleaner',
        flipkartLink: 'https://www.flipkart.com/search?q=the+better+home+cleaner',
        carbonFootprint: 5,
        biodegradable: 95,
      },
    ],
  },
];

// Keep track of which fallback was last used
let lastFallbackIndex = -1;

export function getRandomFallbackProduct(): FallbackProduct {
  // Rotate through fallbacks to provide variety
  lastFallbackIndex = (lastFallbackIndex + 1) % fallbackProducts.length;
  return fallbackProducts[lastFallbackIndex];
}

export function getAllFallbackProducts(): FallbackProduct[] {
  return fallbackProducts;
}
