import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ImageUploader } from "@/components/scanner/ImageUploader";
import { EcoScoreCard, EcoScore, ProductSuggestion } from "@/components/scanner/EcoScoreCard";
import { ProductComposition } from "@/components/scanner/ProductDetailsModal";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, ScanLine, Leaf, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const Scanner = () => {
  const { toast } = useToast();
  const { playSuccessSound } = useSoundEffects();
  
  const [scanCount, setScanCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EcoScore | null>(null);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  const maxScans = isDemo ? 3 : 30;

  const handleImageCapture = async (imageData: string) => {
    if (scanCount >= maxScans) {
      setShowLimitWarning(true);
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setSuggestions([]);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-product', {
        body: { imageBase64: imageData }
      });

      if (error) {
        console.error('Error analyzing product:', error);
        toast({
          title: "Analysis Failed",
          description: error.message || "Could not analyze the product. Please try again.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      if (data.error) {
        toast({
          title: "Analysis Failed",
          description: data.error,
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      const serverIsDemo = data.isDemo ?? true;
      setIsDemo(serverIsDemo);

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
      setScanCount((prev) => prev + 1);

      playSuccessSound();

      toast({
        title: "Product Analyzed!",
        description: `Identified: ${data.productName}`,
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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

  return (
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
              Product <span className="text-gradient-eco">Scanner</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Upload or capture a product image to analyze its eco-friendliness
            </p>
            
            {/* Scan Counter */}
            <motion.div 
              className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl glass-card shadow-card border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-8 h-8 rounded-xl eco-gradient flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">
                <span className="text-eco-leaf font-bold">{scanCount}</span>
                <span className="text-muted-foreground"> / {maxScans} scans used</span>
                {isDemo && <span className="text-eco-lime ml-2">(Demo)</span>}
              </span>
            </motion.div>
          </motion.div>

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
                        <h3 className="font-display font-bold text-lg mb-2">Scan Limit Reached</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {isDemo 
                            ? "You've used all 3 free demo scans. Sign up to get more scans and unlock suggestions!"
                            : "You've reached your monthly scan limit. Upgrade your plan for more scans."
                          }
                        </p>
                        <div className="flex gap-3">
                          <Link to="/pricing">
                            <Button variant="eco" size="sm">
                              {isDemo ? "View Plans" : "Upgrade Now"}
                            </Button>
                          </Link>
                          {isDemo && (
                            <Link to="/auth?mode=signup">
                              <Button variant="eco-outline" size="sm">
                                Sign Up Free
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
                <h3 className="text-xl font-display font-bold mb-3">Analyzing Product...</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  AI is identifying the product and calculating sustainability metrics
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
                          Sign up to unlock product suggestions and compare alternatives!
                        </p>
                        <Link to="/auth?mode=signup">
                          <Button variant="eco" size="lg">
                            Create Free Account
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
                    Scan Another Product
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
  );
};

export default Scanner;
