import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Droplets, Factory, Recycle, ExternalLink, Info, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductDetailsModal, ProductComposition } from "./ProductDetailsModal";
import { ProductComparisonModal } from "./ProductComparisonModal";
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

const gradeColors: Record<string, { bg: string; text: string; label: string }> = {
  S: { bg: "bg-gradient-to-r from-emerald-500 to-teal-400", text: "text-white", label: "Excellent" },
  A: { bg: "bg-gradient-to-r from-green-500 to-emerald-400", text: "text-white", label: "Great" },
  B: { bg: "bg-gradient-to-r from-lime-500 to-green-400", text: "text-white", label: "Good" },
  C: { bg: "bg-gradient-to-r from-yellow-500 to-amber-400", text: "text-foreground", label: "Average" },
  D: { bg: "bg-gradient-to-r from-orange-500 to-amber-500", text: "text-white", label: "Below Average" },
  F: { bg: "bg-gradient-to-r from-red-500 to-orange-500", text: "text-white", label: "Poor" },
};

export const EcoScoreCard = ({ score, suggestions, showSuggestions }: EcoScoreCardProps) => {
  const gradeStyle = gradeColors[score.grade];
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
                  <p className="text-sm opacity-90">{gradeStyle.label}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Carbon Footprint */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Factory className="w-5 h-5 text-eco-earth" />
                    <span className="font-medium">Carbon Footprint</span>
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
                  {score.carbonFootprint < 10 ? "Low impact" : score.carbonFootprint < 25 ? "Moderate impact" : "High impact"}
                </p>
              </div>

              {/* Biodegradable Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Recycle className="w-5 h-5 text-eco-leaf" />
                    <span className="font-medium">Biodegradable</span>
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
                  {score.biodegradable >= 80 ? "Highly recyclable" : score.biodegradable >= 50 ? "Partially recyclable" : "Limited recyclability"}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                  <Leaf className="w-5 h-5 text-eco-leaf" />
                  <div>
                    <p className="text-xs text-muted-foreground">Eco Rating</p>
                    <p className="font-semibold">{score.grade === "S" || score.grade === "A" ? "Recommended" : "Consider alternatives"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                  <Droplets className="w-5 h-5 text-eco-sky" />
                  <div>
                    <p className="text-xs text-muted-foreground">Water Impact</p>
                    <p className="font-semibold">{score.biodegradable >= 70 ? "Low" : "Moderate"}</p>
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
                    View Full Details & Composition
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
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-eco-leaf" />
              Greener Alternatives
            </h3>
            <div className="space-y-4">
              {suggestions.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="hover:shadow-eco transition-shadow overflow-hidden">
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
                              <span>{product.biodegradable}% biodegradable</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${gradeColors[product.grade].bg} ${gradeColors[product.grade].text}`}>
                            {product.grade}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => setSelectedSuggestion(product)}
                          title="View Details"
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="eco-outline"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => setComparisonSuggestion(product)}
                          title="Compare Products"
                        >
                          <GitCompare className="w-4 h-4" />
                          Compare
                        </Button>
                        <a
                          href={product.amazonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
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
                          className="flex-1"
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
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};
