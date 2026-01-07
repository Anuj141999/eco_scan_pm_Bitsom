import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Factory,
  Recycle,
  Leaf,
  TrendingDown,
  TrendingUp,
  Minus,
  Droplets,
  Package,
  Award,
  Calendar,
  TreePine,
  Car,
  Lightbulb,
} from "lucide-react";
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

const gradeColors: Record<string, { bg: string; text: string; labelKey: string }> = {
  S: { bg: "bg-gradient-to-r from-emerald-500 to-teal-400", text: "text-white", labelKey: "gradeExcellent" },
  A: { bg: "bg-gradient-to-r from-green-500 to-emerald-400", text: "text-white", labelKey: "gradeGreat" },
  B: { bg: "bg-gradient-to-r from-lime-500 to-green-400", text: "text-white", labelKey: "gradeGood" },
  C: { bg: "bg-gradient-to-r from-yellow-500 to-amber-400", text: "text-foreground", labelKey: "gradeAverage" },
  D: { bg: "bg-gradient-to-r from-orange-500 to-amber-500", text: "text-white", labelKey: "gradeBelowAverage" },
  F: { bg: "bg-gradient-to-r from-red-500 to-orange-500", text: "text-white", labelKey: "gradePoor" },
};

const gradeOrder = ["F", "D", "C", "B", "A", "S"];

export const ProductComparisonModal = ({
  isOpen,
  onClose,
  scannedProduct,
  suggestion,
}: ProductComparisonModalProps) => {
  const { t } = useTranslation();

  const scannedGradeStyle = gradeColors[scannedProduct.grade];
  const suggestionGradeStyle = gradeColors[suggestion.grade];

  const carbonDiff = scannedProduct.carbonFootprint - suggestion.carbonFootprint;
  const bioDiff = suggestion.biodegradable - scannedProduct.biodegradable;

  const scannedGradeIndex = gradeOrder.indexOf(scannedProduct.grade);
  const suggestionGradeIndex = gradeOrder.indexOf(suggestion.grade);
  const gradeImprovement = suggestionGradeIndex - scannedGradeIndex;

  // Calculate yearly impact (assuming weekly usage)
  const yearlyUsage = 52;
  const yearlyCarbonSaved = carbonDiff * yearlyUsage;
  const treesEquivalent = yearlyCarbonSaved > 0 ? Math.round(yearlyCarbonSaved / 21) : 0; // 1 tree absorbs ~21kg CO2/year
  const carMilesEquivalent = yearlyCarbonSaved > 0 ? Math.round(yearlyCarbonSaved * 2.3) : 0; // ~0.43kg CO2 per mile

  const getTrendIcon = (diff: number, higherIsBetter: boolean) => {
    const improved = higherIsBetter ? diff > 0 : diff < 0;
    const worse = higherIsBetter ? diff < 0 : diff > 0;

    if (improved) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (worse) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getWaterImpact = (biodegradable: number) => {
    if (biodegradable >= 80) return { level: t("impactLow"), color: "text-green-600" };
    if (biodegradable >= 50) return { level: t("impactModerate"), color: "text-yellow-600" };
    return { level: t("impactHigh"), color: "text-red-600" };
  };

  const scannedWaterImpact = getWaterImpact(scannedProduct.biodegradable);
  const suggestionWaterImpact = getWaterImpact(suggestion.biodegradable);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Leaf className="w-5 h-5 text-eco-leaf" />
            {t("detailedProductComparison")}
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
              <p className="text-xs opacity-75 uppercase tracking-wide mb-1">{t("yourProduct")}</p>
              <h3 className="font-semibold text-lg leading-tight mb-2">{scannedProduct.productName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{scannedProduct.grade}</span>
                <span className="text-sm opacity-90">{t(scannedGradeStyle.labelKey)}</span>
              </div>
              <p className="text-xs opacity-75 mt-2">{scannedProduct.category}</p>
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
              <p className="text-xs opacity-75 uppercase tracking-wide mb-1">{t("greenerAlternative")}</p>
              <h3 className="font-semibold text-lg leading-tight mb-2">{suggestion.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{suggestion.grade}</span>
                <span className="text-sm opacity-90">{t(suggestionGradeStyle.labelKey)}</span>
              </div>
              <p className="text-xs opacity-75 mt-2">{scannedProduct.category}</p>
            </div>
          </motion.div>

          <Separator />

          {/* Detailed Metrics Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Carbon Footprint */}
            <div className="space-y-4 p-4 rounded-xl bg-secondary/30">
              <h4 className="font-semibold flex items-center gap-2">
                <Factory className="w-5 h-5 text-eco-earth" />
                {t("carbonFootprint")}
              </h4>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("yourProduct")}</span>
                    <span className="font-medium">{scannedProduct.carbonFootprint} kg CO₂</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (scannedProduct.carbonFootprint / 50) * 100)} className="h-3" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("alternative")}</span>
                    <span className="font-medium">{suggestion.carbonFootprint} kg CO₂</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (suggestion.carbonFootprint / 50) * 100)} className="h-3" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background/50">
                {getTrendIcon(-carbonDiff, false)}
                <span className="text-sm">
                  {carbonDiff > 0 ? (
                    <span className="text-green-600 font-medium">
                      {carbonDiff.toFixed(1)} kg CO₂ less per use
                    </span>
                  ) : carbonDiff < 0 ? (
                    <span className="text-red-600 font-medium">
                      {Math.abs(carbonDiff).toFixed(1)} kg CO₂ more per use
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{t("sameCarbonFootprint")}</span>
                  )}
                </span>
              </div>
            </div>

            {/* Biodegradability */}
            <div className="space-y-4 p-4 rounded-xl bg-secondary/30">
              <h4 className="font-semibold flex items-center gap-2">
                <Recycle className="w-5 h-5 text-eco-leaf" />
                {t("biodegradabilityLabel")}
              </h4>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("yourProduct")}</span>
                    <span className="font-medium">{scannedProduct.biodegradable}%</span>
                  </div>
                  <Progress value={scannedProduct.biodegradable} className="h-3" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("alternative")}</span>
                    <span className="font-medium">{suggestion.biodegradable}%</span>
                  </div>
                  <Progress value={suggestion.biodegradable} className="h-3" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background/50">
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
                    <span className="text-muted-foreground">{t("sameBiodegradability")}</span>
                  )}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Water Impact Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-xl bg-secondary/30"
          >
            <h4 className="font-semibold flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-eco-sky" />
              {t("waterPollutionImpact")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-background/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t("yourProduct")}</p>
                <p className={`font-semibold ${scannedWaterImpact.color}`}>{scannedWaterImpact.level}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t("alternative")}</p>
                <p className={`font-semibold ${suggestionWaterImpact.color}`}>{suggestionWaterImpact.level}</p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Yearly Impact Calculator */}
          {carbonDiff > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-gradient-to-r from-eco-leaf/10 to-eco-sky/10 border border-eco-leaf/20"
            >
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-eco-leaf" />
                {t("yearlyImpactWeeklyUsage")}
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-background/60">
                  <Factory className="w-6 h-6 text-eco-earth mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{yearlyCarbonSaved.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">{t("kgCo2SavedYear")}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/60">
                  <TreePine className="w-6 h-6 text-eco-leaf mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{treesEquivalent}</p>
                  <p className="text-xs text-muted-foreground">{t("treesPlantedEquivalent")}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/60">
                  <Car className="w-6 h-6 text-eco-earth mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{carMilesEquivalent}</p>
                  <p className="text-xs text-muted-foreground">{t("carMilesAvoided")}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Composition Comparison (if available) */}
          {(scannedProduct.composition || suggestion.composition) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-4 rounded-xl bg-secondary/30"
            >
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-eco-earth" />
                {t("materialComposition")}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {scannedProduct.composition?.materials && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{t("yourProduct")}</p>
                    <div className="flex flex-wrap gap-2">
                      {scannedProduct.composition.materials.map((material, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {material.name} ({material.percentage}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {suggestion.composition?.materials && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{t("alternative")}</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestion.composition.materials.map((material, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-eco-leaf/10 text-eco-leaf">
                          {material.name} ({material.percentage}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Certifications Comparison */}
          {(scannedProduct.composition?.certifications?.length || suggestion.composition?.certifications?.length) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-secondary/30"
            >
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-500" />
                {t("ecoCertifications")}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{t("yourProduct")}</p>
                  {scannedProduct.composition?.certifications?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {scannedProduct.composition.certifications.map((cert, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">{t("noCertifications")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{t("alternative")}</p>
                  {suggestion.composition?.certifications?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {suggestion.composition.certifications.map((cert, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-eco-leaf text-eco-leaf">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">{t("noCertifications")}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <Separator />

          {/* Environmental Impact Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-4 rounded-xl bg-eco-leaf/10 border border-eco-leaf/20"
          >
            <h4 className="font-semibold text-eco-leaf mb-2 flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              {t("environmentalImpactSummary")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t("bySwitchingFromTo", { from: scannedProduct.productName, to: suggestion.name })}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {carbonDiff > 0 && (
                <li className="flex items-center gap-2 text-green-600">
                  <TrendingDown className="w-4 h-4 flex-shrink-0" />
                  {t("reduceCarbonPerUse", { value: carbonDiff.toFixed(1) })}
                </li>
              )}
              {bioDiff > 0 && (
                <li className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4 flex-shrink-0" />
                  {t("increaseBiodegradability", { value: bioDiff })}
                </li>
              )}
              {gradeImprovement > 0 && (
                <li className="flex items-center gap-2 text-green-600">
                  <Leaf className="w-4 h-4 flex-shrink-0" />
                  {t("improveEcoGrade", { value: gradeImprovement })}
                </li>
              )}
              {scannedWaterImpact.level !== suggestionWaterImpact.level && suggestionWaterImpact.level === t("impactLow") && (
                <li className="flex items-center gap-2 text-green-600">
                  <Droplets className="w-4 h-4 flex-shrink-0" />
                  {t("reduceWaterPollutionToLow")}
                </li>
              )}
              {carbonDiff <= 0 && bioDiff <= 0 && gradeImprovement <= 0 && (
                <li className="text-muted-foreground">{t("similarEnvironmentalImpact")}</li>
              )}
            </ul>
          </motion.div>

          {/* Pro Tip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <h4 className="font-semibold text-amber-600 mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {t("ecoTip")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {carbonDiff > 0
                ? t("ecoTipSmallChanges", { product: suggestion.name, value: yearlyCarbonSaved.toFixed(0) })
                : t("ecoTipLifecycle")}
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
