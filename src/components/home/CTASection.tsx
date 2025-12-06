import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 eco-gradient opacity-10" />
      
      {/* Decorative Elements */}
      <motion.div 
        className="absolute -left-20 top-1/2 -translate-y-1/2 text-eco-mint opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Leaf className="w-64 h-64" />
      </motion.div>
      <motion.div 
        className="absolute -right-20 top-1/2 -translate-y-1/2 text-eco-mint opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <Leaf className="w-48 h-48" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Shop <span className="text-gradient-eco">Sustainably</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join thousands of eco-conscious shoppers making better choices every day. 
            Start with 3 free scans, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scanner?demo=true">
              <Button variant="hero" size="xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="eco-outline" size="xl">
                View Plans
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
