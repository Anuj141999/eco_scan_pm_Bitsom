import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { Leaf, Mail, Shield, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg eco-gradient flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">EcoScan</span>
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Making sustainable shopping accessible for everyone.
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <h4 className="font-semibold text-foreground">Contact Us</h4>
              <a 
                href="mailto:ecoscan@gmail.com" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                ecoscan@gmail.com
              </a>
            </div>

            {/* Legal */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <div className="flex flex-col gap-2">
                <a 
                  href="/privacy" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </a>
                <a 
                  href="/terms" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              © 2024 EcoScan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
