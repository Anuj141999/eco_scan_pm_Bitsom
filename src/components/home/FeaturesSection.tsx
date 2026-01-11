import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Camera, BarChart3, Lightbulb, Shield, Leaf, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Camera,
    titleKey: "instantAnalysis",
    descriptionKey: "instantAnalysisDesc",
    benefitKeys: ["benefitPhotoCapture", "benefitWorksAnyProduct", "benefitAiRecognition"],
  },
  {
    icon: BarChart3,
    titleKey: "detailedMetricsTitle",
    descriptionKey: "detailedMetricsDesc",
    benefitKeys: ["benefitCarbonFootprint", "benefitBiodegradable", "benefitEcoGrade"],
  },
  {
    icon: Lightbulb,
    titleKey: "smartRecommendations",
    descriptionKey: "smartRecommendationsDesc",
    benefitKeys: ["benefitPurchaseLinks", "benefitPriceComparisons", "benefitBetterAlternatives"],
  },
  {
    icon: Shield,
    titleKey: "verifiedDataTitle",
    descriptionKey: "verifiedDataDesc",
    benefitKeys: ["benefitTrustedAi", "benefitIndustryBenchmarks", "benefitRegularUpdates"],
  },
];

export const FeaturesSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-eco-leaf/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-eco-mint/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-leaf/10 text-eco-leaf mb-6">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">{t("featuresTitle")} {t("featuresHighlight")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            {t("featuresTitle")} <span className="text-gradient-eco">{t("featuresHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("featuresDescription")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-background border border-border hover:border-eco-leaf/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-eco-leaf/10 flex items-center justify-center flex-shrink-0 group-hover:bg-eco-leaf/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-eco-leaf" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-eco-leaf transition-colors">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-muted-foreground mb-4">{t(feature.descriptionKey)}</p>
                    <ul className="space-y-2">
                      {feature.benefitKeys.map((benefitKey) => (
                        <li key={benefitKey} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-eco-leaf flex-shrink-0" />
                          <span>{t(benefitKey)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-16 border-t border-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "50K+", labelKey: "statsActiveUsers" },
              { value: "500K+", labelKey: "statsProductsScanned" },
              { value: "98%", labelKey: "statsAccuracyRate" },
              { value: "4.9/5", labelKey: "statsUserRating" },
            ].map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-eco-leaf mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
