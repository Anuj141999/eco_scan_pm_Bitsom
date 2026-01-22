import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ScanQuota {
  used: number;
  limit: number;
  remaining: number;
  isDemo: boolean;
  resetDate: Date | null;
}

const DEMO_LIMIT = 3;
const AUTHENTICATED_LIMIT = 30;
const QUOTA_STORAGE_KEY = 'ecoscan_quota';

interface StoredQuota {
  used: number;
  date: string; // ISO date string for daily reset
}

export function useScanQuota() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [quota, setQuota] = useState<ScanQuota>({
    used: 0,
    limit: DEMO_LIMIT,
    remaining: DEMO_LIMIT,
    isDemo: true,
    resetDate: null,
  });

  // Check auth status and load quota
  useEffect(() => {
    const loadQuota = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      
      const limit = isAuth ? AUTHENTICATED_LIMIT : DEMO_LIMIT;
      const today = new Date().toISOString().split('T')[0];
      
      // Load stored quota
      try {
        const stored = localStorage.getItem(QUOTA_STORAGE_KEY);
        if (stored) {
          const parsed: StoredQuota = JSON.parse(stored);
          
          // Reset if it's a new day
          if (parsed.date !== today) {
            setQuota({
              used: 0,
              limit,
              remaining: limit,
              isDemo: !isAuth,
              resetDate: getNextResetDate(),
            });
          } else {
            const used = parsed.used;
            setQuota({
              used,
              limit,
              remaining: Math.max(0, limit - used),
              isDemo: !isAuth,
              resetDate: getNextResetDate(),
            });
          }
        } else {
          setQuota({
            used: 0,
            limit,
            remaining: limit,
            isDemo: !isAuth,
            resetDate: getNextResetDate(),
          });
        }
      } catch (e) {
        console.warn('Failed to load quota:', e);
      }
    };

    loadQuota();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      
      const limit = isAuth ? AUTHENTICATED_LIMIT : DEMO_LIMIT;
      setQuota(prev => ({
        ...prev,
        limit,
        remaining: Math.max(0, limit - prev.used),
        isDemo: !isAuth,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist quota changes
  useEffect(() => {
    if (isAuthenticated === null) return;
    
    const today = new Date().toISOString().split('T')[0];
    const toStore: StoredQuota = {
      used: quota.used,
      date: today,
    };
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(toStore));
  }, [quota.used, isAuthenticated]);

  const incrementUsage = useCallback(() => {
    setQuota(prev => {
      const newUsed = prev.used + 1;
      return {
        ...prev,
        used: newUsed,
        remaining: Math.max(0, prev.limit - newUsed),
      };
    });
  }, []);

  const canScan = useCallback(() => {
    return quota.remaining > 0;
  }, [quota.remaining]);

  const getQuotaPercentage = useCallback(() => {
    return Math.round((quota.used / quota.limit) * 100);
  }, [quota.used, quota.limit]);

  return {
    quota,
    incrementUsage,
    canScan,
    getQuotaPercentage,
    isLoading: isAuthenticated === null,
  };
}

function getNextResetDate(): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}
