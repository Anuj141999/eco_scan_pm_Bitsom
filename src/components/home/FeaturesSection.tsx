import { motion } from "framer-motion";
import { Camera, BarChart3, Lightbulb, Shield } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Scan Instantly",
    description: "Simply point your camera at any product to get instant sustainability insights.",
  },
  {
    icon: BarChart3,
    title: "Detailed Metrics",
    description: "View carbon footprint, biodegradability scores, and comprehensive eco-ratings.",
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description: "Get personalized recommendations for greener alternatives from trusted retailers.",
  },
  {
    icon: Shield,
    title: "Verified Data",
    description: "All sustainability data is verified against industry standards and certifications.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-gradient-eco">EcoScan</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Making sustainable shopping simple, transparent, and accessible for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-background border border-border hover:shadow-eco transition-all duration-300">
                <div className="w-12 h-12 rounded-xl eco-gradient flex items-center justify-center mb-4 group-hover:shadow-eco transition-shadow">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
