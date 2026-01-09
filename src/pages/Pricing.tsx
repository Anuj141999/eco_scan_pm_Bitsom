import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/Navbar";
import { PricingCard } from "@/components/pricing/PricingCard";
import { motion } from "framer-motion";
import { Leaf, Check, Shield, Zap, Clock, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

const faqs = [
  {
    q: "Can I try EcoScan for free?",
    a: "Yes! Our free demo gives you 3 scans to experience EcoScan. No credit card required.",
  },
  {
    q: "What's the difference between plans?",
    a: "All plans include core features like eco-scores and carbon footprint analysis. Higher plans offer more scans, premium suggestions with purchase links, and priority support.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel your subscription anytime with no questions asked. We also offer a 30-day money-back guarantee.",
  },
  {
    q: "How accurate is the AI analysis?",
    a: "Our AI achieves 98% accuracy by cross-referencing industry databases and sustainability certifications.",
  },
];

const Pricing = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-leaf/10 text-eco-leaf mb-6">
               <Leaf className="w-4 h-4" />
               <span className="text-sm font-medium">{t("pricingTitle")} {t("pricingHighlight")}</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
               {t("pricingTitle")} <span className="text-gradient-eco">{t("pricingHighlight")}</span>
             </h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               {t("pricingDescription")}
             </p>
          </motion.div>

          {/* Free demo highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto mb-12"
          >
            <div className="bg-gradient-to-r from-eco-leaf/10 to-eco-mint/10 rounded-2xl p-6 border border-eco-leaf/20">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-eco-leaf/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-eco-leaf" />
                  </div>
                  <div>
                    <p className="font-semibold">{t("tryDemo")}</p>
                    <p className="text-sm text-muted-foreground">{t("demoScansNoCard")}</p>
                  </div>
                </div>
                <Link to="/scanner?demo=true">
                  <Button variant="eco" className="shadow-lg shadow-eco-leaf/20">
                    {t("getStarted")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                {...plan}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {[
              { icon: Shield, text: "30-Day Money Back" },
              { icon: Clock, text: "Cancel Anytime" },
              { icon: Zap, text: "Instant Access" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <badge.icon className="w-4 h-4 text-eco-leaf" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>

          {/* All Plans Include */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-2xl font-display font-bold text-center mb-8">All Plans Include</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                "Instant AI scanning",
                "Verified eco data",
                "Mobile-friendly app",
                "Secure & private",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-6 h-6 rounded-full bg-eco-leaf/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-eco-leaf" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-4">
                <HelpCircle className="w-4 h-4 text-eco-leaf" />
                <span className="text-sm font-medium">FAQ</span>
              </div>
              <h2 className="text-2xl font-display font-bold">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-5 border border-border"
                >
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <a 
                href="mailto:ecoscan@gmail.com" 
                className="text-eco-leaf hover:underline font-medium"
              >
                Contact us at ecoscan@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
