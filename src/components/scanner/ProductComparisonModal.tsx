import { motion } from "framer-motion";
import { ArrowRight, Factory, Recycle, Leaf, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { EcoScore, ProductSuggestion } from "./EcoScoreCard";

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  scannedProduct: EcoScore;
  suggestion: ProductSuggestion;
}

const gradeColors: Record<string, { bg: string; text: string; label: string }> = {
  S: { bg: "bg-gradient-to-r from-emerald-500 to-teal-400", text: "text-white", label: "Excellent" },
  A: { bg: "bg-gradient-to-r from-green-500 to-emerald-400", text: "text-white", label: "Great" },
  B: { bg: "bg-gradient-to-r from-lime-500 to-green-400", text: "text-white", label: "Good" },
  C: { bg: "bg-gradient-to-r from-yellow-500 to-amber-400", text: "text-foreground", label: "Average" },
  D: { bg: "bg-gradient-to-r from-orange-500 to-amber-500", text: "text-white", label: "Below Average" },
  F: { bg: "bg-gradient-to-r from-red-500 to-orange-500", text: "text-white", label: "Poor" },
};

const gradeOrder = ["F", "D", "C", "B", "A", "S"];

export const ProductComparisonModal = ({
  isOpen,
  onClose,
  scannedProduct,
  suggestion,
}: ProductComparisonModalProps) => {
  const scannedGradeStyle = gradeColors[scannedProduct.grade];
  const suggestionGradeStyle = gradeColors[suggestion.grade];

  const carbonDiff = scannedProduct.carbonFootprint - suggestion.carbonFootprint;
  const bioDiff = suggestion.biodegradable - scannedProduct.biodegradable;
  
  const scannedGradeIndex = gradeOrder.indexOf(scannedProduct.grade);
  const suggestionGradeIndex = gradeOrder.indexOf(suggestion.grade);
  const gradeImprovement = suggestionGradeIndex - scannedGradeIndex;

  const getTrendIcon = (diff: number, higherIsBetter: boolean) => {
    const improved = higherIsBetter ? diff > 0 : diff < 0;
    const worse = higherIsBetter ? diff < 0 : diff > 0;
    
    if (improved) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (worse) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Leaf className="w-5 h-5 text-eco-leaf" />
            Product Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Products Header Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center"
          >
            {/* Scanned Product */}
            <div className={`rounded-xl p-4 ${scannedGradeStyle.bg} ${scannedGradeStyle.text}`}>
              <p className="text-xs opacity-75 uppercase tracking-wide mb-1">Your Product</p>
              <h3 className="font-semibold text-lg leading-tight mb-2">{scannedProduct.productName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{scannedProduct.grade}</span>
                <span className="text-sm opacity-90">{scannedGradeStyle.label}</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1">
              <ArrowRight className="w-8 h-8 text-eco-leaf" />
              {gradeImprovement > 0 && (
                <Badge className="bg-green-500/10 text-green-600 text-xs">
                  +{gradeImprovement} grade{gradeImprovement > 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            {/* Suggestion Product */}
            <div className={`rounded-xl p-4 ${suggestionGradeStyle.bg} ${suggestionGradeStyle.text}`}>
              <p className="text-xs opacity-75 uppercase tracking-wide mb-1">Greener Alternative</p>
              <h3 className="font-semibold text-lg leading-tight mb-2">{suggestion.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{suggestion.grade}</span>
                <span className="text-sm opacity-90">{suggestionGradeStyle.label}</span>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Carbon Footprint Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="font-semibold flex items-center gap-2">
              <Factory className="w-5 h-5 text-eco-earth" />
              Carbon Footprint
            </h4>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Scanned Product */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Product</span>
                  <span className="font-medium">{scannedProduct.carbonFootprint} kg CO₂</span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - (scannedProduct.carbonFootprint / 50) * 100)} 
                  className="h-3" 
                />
              </div>
              
              {/* Suggestion */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Alternative</span>
                  <span className="font-medium">{suggestion.carbonFootprint} kg CO₂</span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - (suggestion.carbonFootprint / 50) * 100)} 
                  className="h-3" 
                />
              </div>
            </div>

            {/* Difference */}
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary/50">
              {getTrendIcon(-carbonDiff, false)}
              <span className="text-sm">
                {carbonDiff > 0 ? (
                  <span className="text-green-600 font-medium">
                    {carbonDiff.toFixed(1)} kg CO₂ less emissions
                  </span>
                ) : carbonDiff < 0 ? (
                  <span className="text-red-600 font-medium">
                    {Math.abs(carbonDiff).toFixed(1)} kg CO₂ more emissions
                  </span>
                ) : (
                  <span className="text-muted-foreground">Same carbon footprint</span>
                )}
              </span>
            </div>
          </motion.div>

          <Separator />

          {/* Biodegradability Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-semibold flex items-center gap-2">
              <Recycle className="w-5 h-5 text-eco-leaf" />
              Biodegradability
            </h4>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Scanned Product */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Product</span>
                  <span className="font-medium">{scannedProduct.biodegradable}%</span>
                </div>
                <Progress value={scannedProduct.biodegradable} className="h-3" />
              </div>
              
              {/* Suggestion */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Alternative</span>
                  <span className="font-medium">{suggestion.biodegradable}%</span>
                </div>
                <Progress value={suggestion.biodegradable} className="h-3" />
              </div>
            </div>

            {/* Difference */}
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary/50">
              {getTrendIcon(bioDiff, true)}
              <span className="text-sm">
                {bioDiff > 0 ? (
                  <span className="text-green-600 font-medium">
                    {bioDiff}% more biodegradable
                  </span>
                ) : bioDiff < 0 ? (
                  <span className="text-red-600 font-medium">
                    {Math.abs(bioDiff)}% less biodegradable
                  </span>
                ) : (
                  <span className="text-muted-foreground">Same biodegradability</span>
                )}
              </span>
            </div>
          </motion.div>

          <Separator />

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-eco-leaf/10 border border-eco-leaf/20"
          >
            <h4 className="font-semibold text-eco-leaf mb-2 flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Environmental Impact Summary
            </h4>
            <p className="text-sm text-muted-foreground">
              By switching from <strong>{scannedProduct.productName}</strong> to{" "}
              <strong>{suggestion.name}</strong>, you would:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {carbonDiff > 0 && (
                <li className="flex items-center gap-2 text-green-600">
                  <TrendingDown className="w-4 h-4" />
                  Reduce carbon emissions by {carbonDiff.toFixed(1)} kg CO₂
                </li>
              )}
              {bioDiff > 0 && (
                <li className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  Increase biodegradability by {bioDiff}%
                </li>
              )}
              {gradeImprovement > 0 && (
                <li className="flex items-center gap-2 text-green-600">
                  <Leaf className="w-4 h-4" />
                  Improve eco-grade by {gradeImprovement} level{gradeImprovement > 1 ? "s" : ""}
                </li>
              )}
              {carbonDiff <= 0 && bioDiff <= 0 && gradeImprovement <= 0 && (
                <li className="text-muted-foreground">
                  Both products have similar environmental impact
                </li>
              )}
            </ul>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
