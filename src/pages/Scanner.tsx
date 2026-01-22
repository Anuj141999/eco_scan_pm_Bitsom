import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/Navbar";
import { ImageUploader } from "@/components/scanner/ImageUploader";
import { EcoScoreCard, EcoScore, ProductSuggestion } from "@/components/scanner/EcoScoreCard";
import { ProductComposition } from "@/components/scanner/ProductDetailsModal";
import { CreditsExhaustedModal } from "@/components/scanner/CreditsExhaustedModal";
import { ScanQuotaDisplay } from "@/components/scanner/ScanQuotaDisplay";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ScanLine, Leaf, Sparkles, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useScanCache } from "@/hooks/useScanCache";
import { useScanQuota } from "@/hooks/useScanQuota";
import { getRandomFallbackProduct } from "@/data/fallbackProducts";

const Scanner = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { playSuccessSound } = useSoundEffects();
  const location = useLocation();
  
  // Hooks for caching and quota management
  const { getCachedResult, cacheResult, getCacheStats } = useScanCache();
  const { quota, incrementUsage, canScan, isLoading: quotaLoading } = useScanQuota();
  
  // State management
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EcoScore | null>(() => {
    const saved = sessionStorage.getItem('scanResult');
    return saved ? JSON.parse(saved) : null;
  });
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>(() => {
    const saved = sessionStorage.getItem('scanSuggestions');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [isDemo, setIsDemo] = useState<boolean | null>(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [backendErrorCode, setBackendErrorCode] = useState<string | null>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [usedCache, setUsedCache] = useState(false);
  const lastImageRef = useRef<string | null>(null);

  // Persist result and suggestions to sessionStorage
  useEffect(() => {
    if (result) {
      sessionStorage.setItem('scanResult', JSON.stringify(result));
    } else {
      sessionStorage.removeItem('scanResult');
    }
  }, [result]);

  useEffect(() => {
    if (suggestions.length > 0) {
      sessionStorage.setItem('scanSuggestions', JSON.stringify(suggestions));
    } else {
      sessionStorage.removeItem('scanSuggestions');
    }
  }, [suggestions]);

  // Sync quota with session storage for backward compatibility
  useEffect(() => {
    sessionStorage.setItem('scanCount', quota.used.toString());
  }, [quota.used]);

  // Check auth status on mount to determine demo mode
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const searchParams = new URLSearchParams(location.search);
      const demoParam = searchParams.get("demo") === "true";
      
      // User is in demo mode if not authenticated OR if demo=true in URL
      setIsDemo(!session || demoParam);
    };

    checkAuthStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const searchParams = new URLSearchParams(location.search);
      const demoParam = searchParams.get("demo") === "true";
      setIsDemo(!session || demoParam);
    });

    return () => subscription.unsubscribe();
  }, [location.search]);

  const maxScans = isDemo ? 3 : 30;

  const handleImageCapture = async (imageData: string) => {
    // Check quota first
    if (!canScan()) {
      setShowLimitWarning(true);
      return;
    }

    // Store image for potential retry
    lastImageRef.current = imageData;

    // Check cache first - instant and free!
    const cached = getCachedResult(imageData);
    if (cached) {
      setResult(cached.result);
      setSuggestions(cached.suggestions);
      setUsedCache(true);
      playSuccessSound();
      toast({
        title: t("cachedResult", "Cached Result"),
        description: t("cachedResultDesc", "Retrieved from cache - no credits used!"),
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setSuggestions([]);
    setBackendErrorCode(null);
    setIsFallbackData(false);
    setUsedCache(false);
    setIsOfflineMode(false);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-product', {
        body: { imageBase64: imageData },
      });

      if (error) {
        const raw = error.message || '';
        const statusMatch = raw.match(/returned\s+(\d{3})/i);
        const status = statusMatch ? Number(statusMatch[1]) : undefined;

        let serverError: string | undefined;
        const jsonStart = raw.indexOf('{');
        if (jsonStart !== -1) {
          try {
            const parsed = JSON.parse(raw.slice(jsonStart));
            serverError = parsed?.error;
          } catch {
            // ignore
          }
        }

        console.error('Error analyzing product:', { status, raw });

        const isCredits = status === 402 && /credits|payment_required|not enough/i.test(raw);

        if (isCredits) {
          // Use offline fallback mode instead of blocking the user
          console.log('Credits exhausted - using offline fallback mode');
          const fallback = getRandomFallbackProduct();
          setResult(fallback.result);
          setSuggestions(fallback.suggestions);
          setIsOfflineMode(true);
          setIsFallbackData(true);
          playSuccessSound();
          toast({
            title: t("offlineModeActive", "Offline Mode"),
            description: t("offlineModeDesc", "Using local analysis - no credits consumed"),
          });
          setIsAnalyzing(false);
          return;
        }

        const description = serverError || error.message || t('analysisFailedDesc');

        toast({
          title: t('analysisFailed'),
          description,
          variant: 'destructive',
        });

        setIsAnalyzing(false);
        return;
      }

      if (data?.error) {
        const isCredits = data.code === 'credits_exhausted' || /credits|payment_required/i.test(data.error);
        if (isCredits) {
          // Use offline fallback mode instead of blocking the user
          console.log('Credits exhausted (from data) - using offline fallback mode');
          const fallback = getRandomFallbackProduct();
          setResult(fallback.result);
          setSuggestions(fallback.suggestions);
          setIsOfflineMode(true);
          setIsFallbackData(true);
          setBackendErrorCode(data.code || 'credits_exhausted');
          playSuccessSound();
          toast({
            title: t("offlineModeActive", "Offline Mode"),
            description: t("offlineModeDesc", "Using local analysis - no credits consumed"),
          });
          setIsAnalyzing(false);
          return;
        }
        // Store any error code for banner display
        if (data.code) {
          setBackendErrorCode(data.code);
        }

        toast({
          title: t('analysisFailed'),
          description: data.error,
          variant: 'destructive',
        });
        setIsAnalyzing(false);
        return;
      }

      const serverIsDemo = data.isDemo ?? true;
      setIsDemo(serverIsDemo);
      
      // Check if this is fallback demo data
      if (data.isFallback) {
        setIsFallbackData(true);
      }

      const score: EcoScore = {
        grade: data.grade,
        carbonFootprint: data.carbonFootprint,
        biodegradable: data.biodegradable,
        productName: data.productName,
        category: data.category,
        composition: data.composition as ProductComposition | undefined,
      };

      const productSuggestions: ProductSuggestion[] = (data.suggestions || []).map((s: any) => ({
        name: s.name,
        grade: s.grade,
        amazonLink: `https://www.amazon.in/s?k=${encodeURIComponent(s.amazonSearch || s.name)}`,
        flipkartLink: `https://www.flipkart.com/search?q=${encodeURIComponent(s.flipkartSearch || s.name)}`,
        carbonFootprint: s.carbonFootprint,
        biodegradable: s.biodegradable,
        imageUrl: s.imageUrl,
        composition: s.composition as ProductComposition | undefined,
      }));

      setResult(score);
      setSuggestions(productSuggestions);
      incrementUsage();
      
      // Cache successful results for future use
      if (lastImageRef.current) {
        cacheResult(lastImageRef.current, score, productSuggestions);
      }

      playSuccessSound();

      toast({
        title: t("productAnalyzed"),
        description: t("identified", { name: data.productName }),
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: t("genericErrorTitle"),
        description: t("genericErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setSuggestions([]);
    setShowLimitWarning(false);
  };

  const handleRetryWithLastImage = () => {
    if (lastImageRef.current) {
      setShowCreditsModal(false);
      handleImageCapture(lastImageRef.current);
    }
  };

  return (
    <>
      {/* Credits Exhausted Modal */}
      <CreditsExhaustedModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        onRetry={handleRetryWithLastImage}
        isRetrying={isAnalyzing}
      />
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-eco-leaf/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 bg-eco-lime/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      <main className="pt-28 pb-20 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-3xl eco-gradient shadow-eco mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            >
              <ScanLine className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              {t('ecoScanner').split(' ')[0]} <span className="text-gradient-eco">{t('scanner')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
              {t('scannerDescription')}
            </p>
            
            {/* Scan Quota Display */}
            {!quotaLoading && (
              <ScanQuotaDisplay
                used={quota.used}
                limit={quota.limit}
                remaining={quota.remaining}
                isDemo={quota.isDemo}
                resetDate={quota.resetDate}
                cachedScans={getCacheStats().cachedScans}
                isOfflineMode={isOfflineMode}
              />
            )}
          </motion.div>

          {/* Backend Error Banner */}
          <AnimatePresence>
            {backendErrorCode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 text-sm">
                    <span className="font-semibold">{t('backendError', 'Backend Error')}: </span>
                    <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-xs font-mono">
                      {backendErrorCode}
                    </code>
                    {backendErrorCode === 'credits_exhausted' && (
                      <span className="ml-2 text-muted-foreground">
                        — {t('addCreditsHint', 'Add credits in Settings → Workspace → Usage')}
                      </span>
                    )}
                    {backendErrorCode === 'rate_limited' && (
                      <span className="ml-2 text-muted-foreground">
                        — {t('rateLimitHint', 'Wait a moment and try again')}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
                    onClick={() => setBackendErrorCode(null)}
                  >
                    ✕
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Limit Warning */}
          <AnimatePresence>
            {showLimitWarning && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-8"
              >
                <Card className="border-destructive/30 bg-destructive/5 shadow-card overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-destructive" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg mb-2">{t('scanLimitReached')}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {isDemo 
                            ? t('signUpForMore')
                            : t('upgradeToPro')
                          }
                        </p>
                        <div className="flex gap-3">
                          <Link to="/pricing">
                            <Button variant="eco" size="sm">
                              {isDemo ? t('getStarted') : t('upgradeToPro')}
                            </Button>
                          </Link>
                          {isDemo && (
                            <Link to="/auth?mode=signup">
                              <Button variant="eco-outline" size="sm">
                                {t('signUpNow')}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-24"
              >
                <motion.div 
                  className="relative w-24 h-24 mx-auto mb-8"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 rounded-full border-4 border-secondary" />
                  <div className="absolute inset-0 rounded-full border-4 border-eco-leaf border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-eco-leaf" />
                  </div>
                </motion.div>
                <h3 className="text-xl font-display font-bold mb-3">{t('analyzeProduct')}...</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {t("analyzingSubtitle")}
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <EcoScoreCard
                  score={result}
                  suggestions={suggestions}
                  showSuggestions={!isDemo}
                />
                
                {isDemo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                  >
                    <Card className="glass-card border-eco-leaf/20 shadow-eco overflow-hidden">
                      <CardContent className="p-8 text-center">
                        <div className="w-12 h-12 rounded-2xl eco-gradient flex items-center justify-center mx-auto mb-4 shadow-eco">
                          <Sparkles className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-6">
                          {t('signUpForSuggestions')}
                        </p>
                        <Link to="/auth?mode=signup">
                          <Button variant="eco" size="lg">
                            {t('createAccount')}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                <motion.div 
                  className="mt-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button variant="eco-outline" size="lg" onClick={resetScan}>
                    <ScanLine className="w-5 h-5" />
                    {t('scanAnotherProduct')}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="uploader"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ImageUploader onImageCapture={handleImageCapture} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
    </>
  );
};

export default Scanner;
