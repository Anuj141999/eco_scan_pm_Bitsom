import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PaymentModal } from "./PaymentModal";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  searches: number;
  features: string[];
  popular?: boolean;
  delay?: number;
}

export const PricingCard = ({
  name,
  price,
  period,
  searches,
  features,
  popular = false,
  delay = 0,
}: PricingCardProps) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="relative"
      >
        {popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-eco-leaf to-eco-mint text-white text-sm font-medium shadow-lg shadow-eco-leaf/30">
              <Sparkles className="w-3.5 h-3.5" />
              Most Popular
            </span>
          </div>
        )}
        <Card className={`h-full transition-all duration-300 overflow-hidden ${
          popular 
            ? "border-eco-leaf shadow-xl shadow-eco-leaf/10 scale-[1.02]" 
            : "hover:shadow-lg hover:border-eco-leaf/30"
        }`}>
          {popular && (
            <div className="h-1 bg-gradient-to-r from-eco-leaf to-eco-mint" />
          )}
          <CardHeader className="text-center pt-8 pb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">{name}</p>
            <div className="mb-2">
              <span className="text-5xl font-display font-bold">{price}</span>
              <span className="text-muted-foreground ml-1">/{period}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-leaf/10 text-eco-leaf text-sm font-medium">
              {searches} scans/month
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-eco-leaf/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-eco-leaf" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant={popular ? "eco" : "outline"} 
              className={`w-full group ${popular ? "shadow-lg shadow-eco-leaf/20" : "border-2"}`}
              size="lg"
              onClick={() => setIsPaymentOpen(true)}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        planName={name}
        planPrice={price}
      />
    </>
  );
};
