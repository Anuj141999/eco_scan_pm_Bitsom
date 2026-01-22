import { useState, useCallback, useEffect } from 'react';
import { EcoScore, ProductSuggestion } from '@/components/scanner/EcoScoreCard';

interface CachedScan {
  result: EcoScore;
  suggestions: ProductSuggestion[];
  timestamp: number;
  imageHash: string;
}

interface ScanCache {
  scans: CachedScan[];
  lastUpdated: number;
}

const CACHE_KEY = 'ecoscan_cache';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 50;

// Generate a simple hash from image data (first 1000 chars + length for speed)
function generateImageHash(imageData: string): string {
  const sample = imageData.slice(0, 1000) + imageData.length.toString();
  let hash = 0;
  for (let i = 0; i < sample.length; i++) {
    const char = sample.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

export function useScanCache() {
  const [cache, setCache] = useState<ScanCache>(() => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ScanCache;
        // Clean expired entries
        const now = Date.now();
        const validScans = parsed.scans.filter(
          scan => now - scan.timestamp < CACHE_EXPIRY_MS
        );
        return { scans: validScans, lastUpdated: now };
      }
    } catch (e) {
      console.warn('Failed to load scan cache:', e);
    }
    return { scans: [], lastUpdated: Date.now() };
  });

  // Persist cache to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.warn('Failed to save scan cache:', e);
    }
  }, [cache]);

  const getCachedResult = useCallback((imageData: string): { result: EcoScore; suggestions: ProductSuggestion[] } | null => {
    const hash = generateImageHash(imageData);
    const now = Date.now();
    
    const cached = cache.scans.find(
      scan => scan.imageHash === hash && now - scan.timestamp < CACHE_EXPIRY_MS
    );
    
    if (cached) {
      console.log('Cache hit for image hash:', hash);
      return { result: cached.result, suggestions: cached.suggestions };
    }
    
    return null;
  }, [cache.scans]);

  const cacheResult = useCallback((
    imageData: string, 
    result: EcoScore, 
    suggestions: ProductSuggestion[]
  ) => {
    const hash = generateImageHash(imageData);
    const now = Date.now();
    
    setCache(prev => {
      // Remove duplicates and expired entries
      const filtered = prev.scans.filter(
        scan => scan.imageHash !== hash && now - scan.timestamp < CACHE_EXPIRY_MS
      );
      
      // Add new entry
      const newScans = [
        { result, suggestions, timestamp: now, imageHash: hash },
        ...filtered
      ].slice(0, MAX_CACHE_SIZE);
      
      return { scans: newScans, lastUpdated: now };
    });
    
    console.log('Cached scan result for hash:', hash);
  }, []);

  const clearCache = useCallback(() => {
    setCache({ scans: [], lastUpdated: Date.now() });
    localStorage.removeItem(CACHE_KEY);
  }, []);

  const getCacheStats = useCallback(() => {
    return {
      cachedScans: cache.scans.length,
      oldestEntry: cache.scans.length > 0 
        ? new Date(Math.min(...cache.scans.map(s => s.timestamp)))
        : null,
    };
  }, [cache.scans]);

  return {
    getCachedResult,
    cacheResult,
    clearCache,
    getCacheStats,
  };
}
