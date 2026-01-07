import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Leaf, Droplets, Factory, Recycle, ExternalLink, Info, GitCompare, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductDetailsModal, ProductComposition } from "./ProductDetailsModal";
import { ProductComparisonModal } from "./ProductComparisonModal";
import { AlternativeComparisonModal } from "./AlternativeComparisonModal";
export interface EcoScore {
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  carbonFootprint: number;
  biodegradable: number;
  productName: string;
  category: string;
  composition?: ProductComposition;
}

export interface ProductSuggestion {
  name: string;
  grade: "S" | "A" | "B";
  amazonLink: string;
  flipkartLink: string;
  carbonFootprint: number;
  biodegradable: number;
  imageUrl?: string;
  composition?: ProductComposition;
}

interface EcoScoreCardProps {
  score: EcoScore;
  suggestions: ProductSuggestion[];
  showSuggestions: boolean;
}

const gradeColors: Record<string, { bg: string; text: string }> = {
  S: { bg: "bg-gradient-to-r from-emerald-500 to-teal-400", text: "text-white" },
  A: { bg: "bg-gradient-to-r from-green-500 to-emerald-400", text: "text-white" },
  B: { bg: "bg-gradient-to-r from-lime-500 to-green-400", text: "text-white" },
  C: { bg: "bg-gradient-to-r from-yellow-500 to-amber-400", text: "text-foreground" },
  D: { bg: "bg-gradient-to-r from-orange-500 to-amber-500", text: "text-white" },
  F: { bg: "bg-gradient-to-r from-red-500 to-orange-500", text: "text-white" },
};

export const EcoScoreCard = ({ score, suggestions, showSuggestions }: EcoScoreCardProps) => {
  const { t } = useTranslation();

  const gradeStyle = gradeColors[score.grade];
  const gradeLabelMap: Record<string, string> = {
    S: t("gradeExcellent"),
    A: t("gradeGreat"),
    B: t("gradeGood"),
    C: t("gradeAverage"),
    D: t("gradeBelowAverage"),
    F: t("gradePoor"),
  };
  const gradeLabel = gradeLabelMap[score.grade] ?? "";

  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    grade: string;
    category: string;
    carbonFootprint: number;
    biodegradable: number;
    composition?: ProductComposition;
  } | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<ProductSuggestion | null>(null);
  const [comparisonSuggestion, setComparisonSuggestion] = useState<ProductSuggestion | null>(null);
  
  // State for comparing two alternatives
  const [selectedForComparison, setSelectedForComparison] = useState<ProductSuggestion[]>([]);
  const [showAlternativeComparison, setShowAlternativeComparison] = useState(false);

  const toggleSelectForComparison = (product: ProductSuggestion) => {
    setSelectedForComparison(prev => {
      const isSelected = prev.some(p => p.name === product.name);
      if (isSelected) {
        return prev.filter(p => p.name !== product.name);
      } else if (prev.length < 2) {
        const newSelection = [...prev, product];
        if (newSelection.length === 2) {
          setShowAlternativeComparison(true);
        }
        return newSelection;
      }
      return prev;
    });
  };

  const clearComparison = () => {
    setSelectedForComparison([]);
    setShowAlternativeComparison(false);
  };

  return (
    <>
      {/* Product Details Modal for scanned product */}
      <ProductDetailsModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        productName={selectedProduct?.name || ""}
        grade={selectedProduct?.grade || "C"}
        category={selectedProduct?.category || ""}
        carbonFootprint={selectedProduct?.carbonFootprint || 0}
        biodegradable={selectedProduct?.biodegradable || 0}
        composition={selectedProduct?.composition}
      />

      {/* Product Details Modal for suggestion */}
      <ProductDetailsModal
        isOpen={!!selectedSuggestion}
        onClose={() => setSelectedSuggestion(null)}
        productName={selectedSuggestion?.name || ""}
        grade={selectedSuggestion?.grade || "A"}
        category={score.category}
        carbonFootprint={selectedSuggestion?.carbonFootprint || 0}
        biodegradable={selectedSuggestion?.biodegradable || 0}
        composition={selectedSuggestion?.composition}
      />

      {/* Product Comparison Modal */}
      {comparisonSuggestion && (
        <ProductComparisonModal
          isOpen={!!comparisonSuggestion}
          onClose={() => setComparisonSuggestion(null)}
          scannedProduct={score}
          suggestion={comparisonSuggestion}
        />
      )}

      {/* Alternative Comparison Modal */}
      {showAlternativeComparison && selectedForComparison.length === 2 && (
        <AlternativeComparisonModal
          isOpen={showAlternativeComparison}
          onClose={clearComparison}
          productA={selectedForComparison[0]}
          productB={selectedForComparison[1]}
        />
      )}
      <div className="space-y-6">
        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className={`${gradeStyle.bg} ${gradeStyle.text} py-8`}>
              <div className="flex items-center justify-between">
                <div className="max-w-[200px] md:max-w-xs">
                  <p className="text-xs opacity-75 mb-1 uppercase tracking-wide">{score.category}</p>
                  <p className="text-lg font-normal opacity-95 leading-snug">{score.productName}</p>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-bold">{score.grade}</div>
                  <p className="text-sm opacity-90">{gradeLabel}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Carbon Footprint */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Factory className="w-5 h-5 text-eco-earth" />
                    <span className="font-medium">{t("carbonFootprint")}</span>
                  </div>
                  <span className="text-lg font-bold">{score.carbonFootprint} kg CO₂</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100 - (score.carbonFootprint / 50) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full eco-gradient rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {score.carbonFootprint < 10 ? t("lowImpact") : score.carbonFootprint < 25 ? t("moderateImpact") : t("highImpact")}
                </p>
              </div>

              {/* Biodegradable Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Recycle className="w-5 h-5 text-eco-leaf" />
                    <span className="font-medium">{t("biodegradable")}</span>
                  </div>
                  <span className="text-lg font-bold">{score.biodegradable}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score.biodegradable}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full eco-gradient rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {score.biodegradable >= 80 ? t("highlyRecyclable") : score.biodegradable >= 50 ? t("partiallyRecyclable") : t("limitedRecyclability")}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                  <Leaf className="w-5 h-5 text-eco-leaf" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("ecoRating")}</p>
                    <p className="font-semibold">{score.grade === "S" || score.grade === "A" ? t("recommended") : t("considerAlternatives")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                  <Droplets className="w-5 h-5 text-eco-sky" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("waterImpact")}</p>
                    <p className="font-semibold">{score.biodegradable >= 70 ? t("impactLow") : t("impactModerate")}</p>
                  </div>
                </div>
              </div>

              {/* View Details Button - Only for subscribed users */}
              {showSuggestions && (
                <div className="pt-2">
                  <Button
                    variant="eco-outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedProduct({
                      name: score.productName,
                      grade: score.grade,
                      category: score.category,
                      carbonFootprint: score.carbonFootprint,
                      biodegradable: score.biodegradable,
                      composition: score.composition,
                    })}
                  >
                    <Info className="w-4 h-4 mr-2" />
                    {t("viewFullDetailsComposition")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Leaf className="w-5 h-5 text-eco-leaf" />
                {t("alternatives")}
              </h3>
              {suggestions.length >= 2 && (
                <div className="flex items-center gap-2">
                  {selectedForComparison.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearComparison}
                      className="text-muted-foreground"
                    >
                      <X className="w-4 h-4 mr-1" />
                       {t("clear")}
                     </Button>
                  )}
                   <Badge variant="secondary" className="text-xs">
                     {t("selectedForComparison", { count: selectedForComparison.length })}
                   </Badge>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {suggestions.map((product, index) => {
                const isSelected = selectedForComparison.some(p => p.name === product.name);
                return (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <Card className={`hover:shadow-eco transition-all overflow-hidden ${isSelected ? 'ring-2 ring-eco-leaf ring-offset-2' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4 mb-3">
                          {/* Product Image */}
                          {product.imageUrl && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{product.name}</h4>
                               <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                 <span>{product.carbonFootprint} kg CO₂</span>
                                 <span>{t("biodegradablePercent", { value: product.biodegradable })}</span>
                               </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${gradeColors[product.grade].bg} ${gradeColors[product.grade].text}`}>
                              {product.grade}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {/* Select for comparison checkbox */}
                          {suggestions.length >= 2 && (
                            <Button
                              variant={isSelected ? "eco" : "outline"}
                              size="sm"
                              className="flex-shrink-0"
                              onClick={() => toggleSelectForComparison(product)}
                              disabled={!isSelected && selectedForComparison.length >= 2}
                               title={isSelected ? t("removeFromComparison") : t("selectForComparison")}
                             >
                              {isSelected ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" />
                                   {t("selected")}
                                 </>
                               ) : (
                                 <>
                                   <GitCompare className="w-4 h-4 mr-1" />
                                   {t("select")}
                                 </>
                               )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                            onClick={() => setSelectedSuggestion(product)}
                             title={t("viewDetails")}
                           >
                            <Info className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="eco-outline"
                            size="sm"
                            className="flex-shrink-0"
                            onClick={() => setComparisonSuggestion(product)}
                             title={t("compareWithScanned")}
                           >
                             <GitCompare className="w-4 h-4" />
                             {t("vsScanned")}
                          </Button>
                          <a
                            href={product.amazonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[80px]"
                          >
                            <Button variant="outline" size="sm" className="w-full">
                              Amazon
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </a>
                          <a
                            href={product.flipkartLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[80px]"
                          >
                            <Button variant="outline" size="sm" className="w-full">
                              Flipkart
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};
