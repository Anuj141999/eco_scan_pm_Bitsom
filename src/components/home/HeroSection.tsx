import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, ScanLine, ShieldCheck, TrendingUp, Sparkles, Play, ArrowRight, Users, Star, Zap } from "lucide-react";

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-eco-mint/5 to-background" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-32 left-[8%] text-eco-leaf/20"
        animate={{ 
          y: [0, -15, 0], 
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf className="w-16 h-16" />
      </motion.div>
      <motion.div 
        className="absolute top-48 right-[12%] text-eco-mint/25"
        animate={{ 
          y: [0, -20, 0], 
          rotate: [0, -8, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Leaf className="w-20 h-20" />
      </motion.div>
      <motion.div 
        className="absolute bottom-40 left-[15%] text-eco-lime/15"
        animate={{ 
          y: [0, -12, 0], 
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Leaf className="w-12 h-12" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card border border-border shadow-sm mb-8"
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-eco-leaf to-eco-mint border-2 border-background flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              Trusted by <span className="text-eco-leaf font-bold">50,000+</span> users
            </span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.1]"
          >
            {t("heroTitle")}{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block">
              <span className="text-gradient-eco">{t("heroTitleHighlight")}</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-3 bg-eco-leaf/20 rounded-full -z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t("heroDescription")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
          >
            <Link to="/scanner?demo=true">
              <Button variant="eco" size="xl" className="group shadow-lg shadow-eco-leaf/25 hover:shadow-xl hover:shadow-eco-leaf/30 transition-all">
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                {t("startScanning")}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="outline" size="xl" className="group border-2">
                {t("createAccount")}
              </Button>
            </Link>
          </motion.div>

          {/* No credit card required */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-muted-foreground mb-12"
          >
            <Zap className="w-4 h-4 inline mr-1 text-eco-leaf" />
            3 free scans • No credit card required • Takes 30 seconds
          </motion.p>

          {/* How it works - Quick visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16"
          >
            {[
              { step: "1", title: "Scan", desc: "Take a photo of any product", icon: ScanLine },
              { step: "2", title: "Analyze", desc: "Get instant eco scores", icon: ShieldCheck },
              { step: "3", title: "Choose", desc: "Find greener alternatives", icon: TrendingUp },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="relative group"
              >
                <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border hover:border-eco-leaf/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-eco-leaf/10 flex items-center justify-center mb-3 group-hover:bg-eco-leaf/20 transition-colors">
                    <item.icon className="w-6 h-6 text-eco-leaf" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-eco-leaf text-white text-sm font-bold flex items-center justify-center shadow-md">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-eco-leaf/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Demo Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-eco-leaf/30 via-eco-lime/30 to-eco-mint/30 rounded-3xl blur-xl opacity-50" />
              
              <div className="relative bg-card rounded-2xl p-6 shadow-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-leaf to-eco-mint flex items-center justify-center shadow-sm">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sample Analysis</p>
                      <p className="font-semibold">Organic Cotton Tee</p>
                    </div>
                  </div>
                  <motion.div 
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-lg font-bold shadow-sm"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    A
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="text-muted-foreground">Carbon Footprint</span>
                      <span className="font-semibold text-eco-forest">12 kg CO₂</span>
                    </div>
                    <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-eco-leaf to-eco-lime rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="text-muted-foreground">Biodegradable</span>
                      <span className="font-semibold text-eco-leaf">85%</span>
                    </div>
                    <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-eco-leaf to-eco-mint rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-eco-leaf font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Great choice! This product is eco-friendly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
