import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Shield, Zap, Clock } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-eco-leaf/10 via-eco-mint/5 to-background" />
      
      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-eco-leaf/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-eco-leaf/10 rounded-full" />
      
      {/* Floating leaves */}
      <motion.div 
        className="absolute -left-10 top-1/2 -translate-y-1/2 text-eco-leaf/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Leaf className="w-40 h-40" />
      </motion.div>
      <motion.div 
        className="absolute -right-10 top-1/3 text-eco-mint/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        <Leaf className="w-32 h-32" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Ready to Make{" "}
            <span className="text-gradient-eco">Smarter Choices</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of eco-conscious shoppers making a real impact. 
            Start with 3 free scans today — no credit card required.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: Zap, text: "Instant Results" },
              { icon: Shield, text: "Verified Data" },
              { icon: Clock, text: "Free Forever" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <badge.icon className="w-4 h-4 text-eco-leaf" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scanner?demo=true">
              <Button variant="eco" size="xl" className="shadow-lg shadow-eco-leaf/25">
                Start Free Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="xl" className="border-2">
                View Plans & Pricing
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            ✓ No credit card required · ✓ Cancel anytime · ✓ 30-day money back guarantee
          </p>
        </motion.div>

        {/* Testimonial preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 max-w-2xl mx-auto"
        >
          <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-eco-leaf to-eco-mint flex items-center justify-center text-white font-bold">
                SK
              </div>
              <div>
                <p className="font-semibold">Sarah K.</p>
                <p className="text-sm text-muted-foreground">Verified User</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
            </div>
            <p className="text-muted-foreground italic">
              "EcoScan has completely changed how I shop. I now make conscious decisions 
              about every product I buy. The alternative suggestions are incredibly helpful!"
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
