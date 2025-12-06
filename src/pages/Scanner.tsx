import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { ImageUploader } from "@/components/scanner/ImageUploader";
import { EcoScoreCard, EcoScore, ProductSuggestion } from "@/components/scanner/EcoScoreCard";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, ScanLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for demonstration
const mockProducts: Record<string, EcoScore> = {
  default: {
    grade: "B",
    carbonFootprint: 18,
    biodegradable: 65,
    productName: "Generic Product",
    category: "Consumer Goods",
  },
};

const mockSuggestions: ProductSuggestion[] = [
  {
    name: "Eco-Friendly Alternative A",
    grade: "S",
    amazonLink: "https://www.amazon.in/s?k=eco+friendly+products",
    flipkartLink: "https://www.flipkart.com/search?q=eco+friendly+products",
    carbonFootprint: 5,
    biodegradable: 95,
  },
  {
    name: "Green Choice Product B",
    grade: "A",
    amazonLink: "https://www.amazon.in/s?k=sustainable+products",
    flipkartLink: "https://www.flipkart.com/search?q=sustainable+products",
    carbonFootprint: 8,
    biodegradable: 88,
  },
  {
    name: "Sustainable Option C",
    grade: "A",
    amazonLink: "https://www.amazon.in/s?k=green+products",
    flipkartLink: "https://www.flipkart.com/search?q=green+products",
    carbonFootprint: 10,
    biodegradable: 82,
  },
];

const Scanner = () => {
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  
  const [scanCount, setScanCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EcoScore | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const maxScans = isDemo ? 3 : 30; // Demo gets 3, logged in users get based on plan

  const generateRandomScore = (): EcoScore => {
    const grades: EcoScore["grade"][] = ["S", "A", "B", "C", "D", "F"];
    const gradeIndex = Math.floor(Math.random() * grades.length);
    const grade = grades[gradeIndex];
    
    const carbonFootprint = Math.floor(Math.random() * 45) + 5;
    const biodegradable = Math.floor(Math.random() * 70) + 20;
    
    const categories = ["Food & Beverages", "Personal Care", "Household", "Electronics", "Clothing"];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const productNames = ["Organic Shampoo", "Bamboo Toothbrush", "Recycled Notebook", "Glass Container", "Cotton T-Shirt"];
    const productName = productNames[Math.floor(Math.random() * productNames.length)];

    return {
      grade,
      carbonFootprint,
      biodegradable,
      productName,
      category,
    };
  };

  const handleImageCapture = async (imageData: string) => {
    if (scanCount >= maxScans) {
      setShowLimitWarning(true);
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const score = generateRandomScore();
    setResult(score);
    setScanCount((prev) => prev + 1);
    setIsAnalyzing(false);
  };

  const resetScan = () => {
    setResult(null);
    setShowLimitWarning(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Product <span className="text-gradient-eco">Scanner</span>
            </h1>
            <p className="text-muted-foreground">
              Upload or capture a product image to analyze its eco-friendliness
            </p>
            
            {/* Scan Counter */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
              <ScanLine className="w-4 h-4 text-eco-leaf" />
              <span className="text-sm font-medium">
                {scanCount} / {maxScans} scans used
                {isDemo && " (Demo)"}
              </span>
            </div>
          </motion.div>

          {/* Limit Warning */}
          <AnimatePresence>
            {showLimitWarning && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">Scan Limit Reached</h3>
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-eco-leaf animate-spin" />
                <h3 className="text-lg font-semibold mb-2">Analyzing Product...</h3>
                <p className="text-sm text-muted-foreground">
                  Calculating carbon footprint and sustainability metrics
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EcoScoreCard
                  score={result}
                  suggestions={mockSuggestions}
                  showSuggestions={!isDemo}
                />
                
                {isDemo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <Card className="bg-secondary/50 border-primary/20">
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          🌿 Sign up to unlock product suggestions and compare alternatives!
                        </p>
                        <Link to="/auth?mode=signup">
                          <Button variant="eco" size="sm">
                            Create Free Account
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                <div className="mt-8 text-center">
                  <Button variant="eco-outline" onClick={resetScan}>
                    Scan Another Product
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="uploader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
