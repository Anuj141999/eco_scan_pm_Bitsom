import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, ScanLine, ShieldCheck, TrendingUp } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 nature-gradient" />
      
      {/* Floating Leaves */}
      <motion.div 
        className="absolute top-20 left-10 text-eco-mint opacity-40"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf className="w-16 h-16" />
      </motion.div>
      <motion.div 
        className="absolute top-40 right-20 text-eco-leaf opacity-30"
        animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Leaf className="w-24 h-24" />
      </motion.div>
      <motion.div 
        className="absolute bottom-40 left-1/4 text-eco-mint opacity-25"
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Leaf className="w-20 h-20" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-eco-leaf animate-pulse-eco" />
            <span className="text-sm font-medium text-muted-foreground">
              Join 50,000+ eco-conscious shoppers
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Scan Products.{" "}
            <span className="text-gradient-eco">Save the Planet.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Make informed eco-friendly choices instantly. Scan any product to get its 
            sustainability score, carbon footprint, and discover greener alternatives.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/scanner?demo=true">
              <Button variant="hero" size="xl">
                <ScanLine className="w-5 h-5" />
                Try Free Demo
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="eco-outline" size="xl">
                Create Account
              </Button>
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft">
              <ScanLine className="w-4 h-4 text-eco-leaf" />
              <span className="text-sm font-medium">Instant Scan</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft">
              <ShieldCheck className="w-4 h-4 text-eco-leaf" />
              <span className="text-sm font-medium">Verified Data</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft">
              <TrendingUp className="w-4 h-4 text-eco-leaf" />
              <span className="text-sm font-medium">Better Alternatives</span>
            </div>
          </motion.div>
        </div>

        {/* Demo Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-md mx-auto mt-16"
        >
          <div className="card-gradient rounded-3xl p-6 shadow-lifted border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Product Score</span>
              <span className="px-3 py-1 rounded-full eco-gradient text-primary-foreground text-sm font-bold">
                Grade A
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Carbon Footprint</span>
                <span className="font-semibold">12 kg CO₂</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-3/4 eco-gradient rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Biodegradable</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-[85%] eco-gradient rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
