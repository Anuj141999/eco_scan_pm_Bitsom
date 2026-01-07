import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Factory,
  Recycle,
  Leaf,
  TrendingDown,
  TrendingUp,
  Minus,
  Droplets,
  Package,
  Award,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ProductSuggestion } from "./EcoScoreCard";

interface AlternativeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  productA: ProductSuggestion;
  productB: ProductSuggestion;
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

export const AlternativeComparisonModal = ({
  isOpen,
  onClose,
  productA,
  productB,
}: AlternativeComparisonModalProps) => {
  const { t } = useTranslation();

  const productAGradeStyle = gradeColors[productA.grade];
  const productBGradeStyle = gradeColors[productB.grade];

  const carbonDiff = productA.carbonFootprint - productB.carbonFootprint;
  const bioDiff = productB.biodegradable - productA.biodegradable;

  const productAGradeIndex = gradeOrder.indexOf(productA.grade);
  const productBGradeIndex = gradeOrder.indexOf(productB.grade);
  const gradeImprovement = productBGradeIndex - productAGradeIndex;

  // Determine winner for each metric
  const carbonWinner = carbonDiff > 0 ? "B" : carbonDiff < 0 ? "A" : "tie";
  const bioWinner = bioDiff > 0 ? "B" : bioDiff < 0 ? "A" : "tie";
  const gradeWinner = gradeImprovement > 0 ? "B" : gradeImprovement < 0 ? "A" : "tie";

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

  const productAWaterImpact = getWaterImpact(productA.biodegradable);
  const productBWaterImpact = getWaterImpact(productB.biodegradable);

  // Calculate overall winner
  let scoreA = 0;
  let scoreB = 0;
  if (carbonWinner === "A") scoreA++;
  else if (carbonWinner === "B") scoreB++;
  if (bioWinner === "A") scoreA++;
  else if (bioWinner === "B") scoreB++;
  if (gradeWinner === "A") scoreA++;
  else if (gradeWinner === "B") scoreB++;

  const overallWinner = scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "tie";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Leaf className="w-5 h-5 text-eco-leaf" />
            {t("compareAlternatives")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Products Header Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center"
          >
            {/* Product A */}
            <div className={`rounded-xl p-4 ${productAGradeStyle.bg} ${productAGradeStyle.text} relative`}>
              {overallWinner === "A" && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-950">
                  🏆 {t("betterChoice")}
                </Badge>
              )}
              <p className="text-xs opacity-75 uppercase tracking-wide mb-1">{t("option1")}</p>
              <h3 className="font-semibold text-lg leading-tight mb-2">{productA.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{productA.grade}</span>
                <span className="text-sm opacity-90">{t(productAGradeStyle.labelKey)}</span>
              </div>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-lg">VS</div>
              {gradeImprovement !== 0 && (
                <Badge
                  className={
                    gradeImprovement > 0
                      ? "bg-green-500/10 text-green-600"
                      : "bg-orange-500/10 text-orange-600"
                  }
                  variant="secondary"
                >
                  {gradeImprovement > 0
                    ? `B is +${gradeImprovement} grade`
                    : `A is +${Math.abs(gradeImprovement)} grade`}
                </Badge>
              )}
            </div>

            {/* Product B */}
            <div className={`rounded-xl p-4 ${productBGradeStyle.bg} ${productBGradeStyle.text} relative`}>
              {overallWinner === "B" && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-950">
                  🏆 {t("betterChoice")}
                </Badge>
              )}
              <p className="text-xs opacity-75 uppercase tracking-wide mb-1">{t("option2")}</p>
              <h3 className="font-semibold text-lg leading-tight mb-2">{productB.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{productB.grade}</span>
                <span className="text-sm opacity-90">{t(productBGradeStyle.labelKey)}</span>
              </div>
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
                    <span className={carbonWinner === "A" ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {t("option1")} {carbonWinner === "A" && "✓"}
                    </span>
                    <span className="font-medium">{productA.carbonFootprint} kg CO₂</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (productA.carbonFootprint / 50) * 100)} className="h-3" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={carbonWinner === "B" ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {t("option2")} {carbonWinner === "B" && "✓"}
                    </span>
                    <span className="font-medium">{productB.carbonFootprint} kg CO₂</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (productB.carbonFootprint / 50) * 100)} className="h-3" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background/50">
                {getTrendIcon(-carbonDiff, false)}
                <span className="text-sm">
                  {carbonDiff > 0 ? (
                    <span className="text-green-600 font-medium">Option 2 saves {carbonDiff.toFixed(1)} kg CO₂</span>
                  ) : carbonDiff < 0 ? (
                    <span className="text-green-600 font-medium">Option 1 saves {Math.abs(carbonDiff).toFixed(1)} kg CO₂</span>
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
                    <span className={bioWinner === "A" ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {t("option1")} {bioWinner === "A" && "✓"}
                    </span>
                    <span className="font-medium">{productA.biodegradable}%</span>
                  </div>
                  <Progress value={productA.biodegradable} className="h-3" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={bioWinner === "B" ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {t("option2")} {bioWinner === "B" && "✓"}
                    </span>
                    <span className="font-medium">{productB.biodegradable}%</span>
                  </div>
                  <Progress value={productB.biodegradable} className="h-3" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background/50">
                {getTrendIcon(bioDiff, true)}
                <span className="text-sm">
                  {bioDiff > 0 ? (
                    <span className="text-green-600 font-medium">{t("option2")} +{bioDiff}%</span>
                  ) : bioDiff < 0 ? (
                    <span className="text-green-600 font-medium">{t("option1")} +{Math.abs(bioDiff)}%</span>
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
                <p className="text-xs text-muted-foreground mb-1">{t("option1")}</p>
                <p className={`font-semibold ${productAWaterImpact.color}`}>{productAWaterImpact.level}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t("option2")}</p>
                <p className={`font-semibold ${productBWaterImpact.color}`}>{productBWaterImpact.level}</p>
              </div>
            </div>
          </motion.div>

          {/* Composition Comparison (if available) */}
          {(productA.composition || productB.composition) && (
            <>
              <Separator />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-secondary/30"
              >
                <h4 className="font-semibold flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-eco-earth" />
                  {t("materialComposition")}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {productA.composition?.materials && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{t("option1")}</p>
                      <div className="flex flex-wrap gap-2">
                        {productA.composition.materials.map((material, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {material.name} ({material.percentage}%)
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {productB.composition?.materials && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{t("option2")}</p>
                      <div className="flex flex-wrap gap-2">
                        {productB.composition.materials.map((material, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-eco-leaf/10 text-eco-leaf">
                            {material.name} ({material.percentage}%)
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}

          {/* Certifications Comparison */}
          {(productA.composition?.certifications?.length || productB.composition?.certifications?.length) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-4 rounded-xl bg-secondary/30"
            >
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-500" />
                {t("ecoCertifications")}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{t("option1")}</p>
                  {productA.composition?.certifications?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {productA.composition.certifications.map((cert, idx) => (
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
                  <p className="text-sm font-medium text-muted-foreground">{t("option2")}</p>
                  {productB.composition?.certifications?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {productB.composition.certifications.map((cert, idx) => (
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

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-eco-leaf/10 border border-eco-leaf/20"
          >
            <h4 className="font-semibold text-eco-leaf mb-2 flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              {t("comparisonSummary")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {overallWinner === "A" ? (
                <>{t("betterChoiceWithMetrics", { product: productA.name, count: scoreA })}</>
              ) : overallWinner === "B" ? (
                <>{t("betterChoiceWithMetrics", { product: productB.name, count: scoreB })}</>
              ) : (
                <>{t("equallyEcoFriendly")}</>
              )}
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
