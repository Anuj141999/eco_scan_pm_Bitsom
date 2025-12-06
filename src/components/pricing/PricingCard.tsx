import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full eco-gradient text-primary-foreground text-sm font-medium shadow-eco">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}
      <Card className={`h-full transition-all duration-300 ${popular ? "border-primary shadow-eco scale-105" : "hover:shadow-eco"}`}>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">{name}</CardTitle>
          <div className="mt-4">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-muted-foreground">/{period}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {searches} product searches
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full eco-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            variant={popular ? "eco" : "eco-outline"} 
            className="w-full"
            size="lg"
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
