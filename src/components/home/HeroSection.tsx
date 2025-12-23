import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, ScanLine, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 nature-gradient" />
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-eco-leaf/10 rounded-full blur-3xl animate-pulse-eco" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-eco-lime/10 rounded-full blur-3xl animate-pulse-eco" style={{ animationDelay: '1s' }} />
      
      {/* Floating Leaves with enhanced animation */}
      <motion.div 
        className="absolute top-20 left-[10%] text-eco-mint/60"
        animate={{ 
          y: [0, -20, 0], 
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf className="w-20 h-20 drop-shadow-lg" />
      </motion.div>
      <motion.div 
        className="absolute top-40 right-[15%] text-eco-leaf/40"
        animate={{ 
          y: [0, -30, 0], 
          rotate: [0, -15, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Leaf className="w-28 h-28 drop-shadow-lg" />
      </motion.div>
      <motion.div 
        className="absolute bottom-32 left-[20%] text-eco-lime/30"
        animate={{ 
          y: [0, -15, 0], 
          rotate: [0, 8, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Leaf className="w-24 h-24 drop-shadow-lg" />
      </motion.div>
      <motion.div 
        className="absolute top-1/2 right-[8%] text-eco-sky/30"
        animate={{ 
          y: [0, -25, 0], 
          rotate: [0, -12, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <Leaf className="w-16 h-16 drop-shadow-lg" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card shadow-card mb-10 border border-border/50"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-leaf opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-eco-leaf" />
            </span>
            <span className="text-sm font-medium text-foreground">
              Join <span className="text-eco-leaf font-semibold">50,000+</span> eco-conscious shoppers
            </span>
            <Sparkles className="w-4 h-4 text-eco-lime" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 leading-[0.95]"
          >
            Scan Products.{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient-eco">Save the Planet.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Make informed eco-friendly choices instantly. Get sustainability scores, 
            carbon footprint data, and discover greener alternatives.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/scanner?demo=true">
              <Button variant="hero" size="xl" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <ScanLine className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Try Free Demo
                </span>
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="eco-outline" size="xl" className="group">
                <span className="group-hover:text-primary-foreground transition-colors">
                  Create Account
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: ScanLine, text: "Instant AI Scan" },
              { icon: ShieldCheck, text: "Verified Data" },
              { icon: TrendingUp, text: "Better Alternatives" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card shadow-card border border-border/50 hover:shadow-eco hover:border-eco-leaf/30 transition-all duration-300"
              >
                <feature.icon className="w-4 h-4 text-eco-leaf" />
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Demo Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="max-w-lg mx-auto mt-20"
        >
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-eco-leaf/20 via-eco-lime/20 to-eco-mint/20 rounded-[2rem] blur-2xl opacity-60" />
            
            <div className="relative glass-card rounded-3xl p-8 shadow-card border border-border/50 overflow-hidden">
              {/* Subtle shine effect */}
              <div className="absolute inset-0 shimmer pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl eco-gradient flex items-center justify-center shadow-eco">
                      <Leaf className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Product Score</p>
                      <p className="font-display font-bold text-lg">Eco Analysis</p>
                    </div>
                  </div>
                  <motion.div 
                    className="px-4 py-2 rounded-xl eco-gradient text-primary-foreground text-lg font-bold shadow-eco"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Grade A
                  </motion.div>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Carbon Footprint</span>
                      <span className="font-semibold text-eco-forest">12 kg CO₂</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full eco-gradient rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Biodegradable</span>
                      <span className="font-semibold text-eco-leaf">85%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full eco-gradient rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.4, delay: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
