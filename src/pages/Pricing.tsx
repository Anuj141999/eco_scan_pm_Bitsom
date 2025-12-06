import { Navbar } from "@/components/layout/Navbar";
import { PricingCard } from "@/components/pricing/PricingCard";
import { motion } from "framer-motion";
import { Leaf, Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    price: "$9.99",
    period: "month",
    searches: 30,
    features: [
      "30 product scans per month",
      "Full eco-score breakdown",
      "Carbon footprint analysis",
      "Biodegradable rating",
      "Basic product suggestions",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$49.99",
    period: "month",
    searches: 60,
    popular: true,
    features: [
      "60 product scans per month",
      "Full eco-score breakdown",
      "Carbon footprint analysis",
      "Biodegradable rating",
      "Premium product suggestions",
      "Price comparison links",
      "Priority support",
      "Scan history",
    ],
  },
  {
    name: "Business",
    price: "$99.99",
    period: "month",
    searches: 200,
    features: [
      "200 product scans per month",
      "Full eco-score breakdown",
      "Carbon footprint analysis",
      "Biodegradable rating",
      "All premium suggestions",
      "Price comparison links",
      "24/7 priority support",
      "Scan history & analytics",
      "API access",
      "Team sharing",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-6">
              <Leaf className="w-4 h-4 text-eco-leaf" />
              <span className="text-sm font-medium">Simple, transparent pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="text-gradient-eco">Eco Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start with a free demo or choose a plan that fits your sustainable shopping needs.
              Cancel anytime.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                {...plan}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Features Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-center mb-8">All Plans Include</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "Instant product scanning",
                "Verified sustainability data",
                "Mobile-friendly interface",
                "Secure & private",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border"
                >
                  <div className="w-6 h-6 rounded-full eco-gradient flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Contact us at{" "}
              <a href="mailto:hello@ecoscan.app" className="text-primary hover:underline">
                hello@ecoscan.app
              </a>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
