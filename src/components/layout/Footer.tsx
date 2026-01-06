import { useTranslation } from "react-i18next";
import { Leaf, Mail, Shield, FileText, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";

interface FooterProps {
  minimal?: boolean;
}

export const Footer = ({ minimal = false }: FooterProps) => {
  const { t } = useTranslation();

  if (minimal) {
    return (
      <footer className="py-8 border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 EcoScan. {t('allRightsReserved')}
            </p>
            <LanguageSelector />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="py-16 border-t border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-leaf to-eco-mint flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">EcoScan</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-sm">
              {t('footerDescription')}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the planet
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/scanner?demo=true" className="text-muted-foreground hover:text-eco-leaf transition-colors">
                  {t('tryDemo')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-eco-leaf transition-colors">
                  {t('pricing')}
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-eco-leaf transition-colors">
                  {t('signIn')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('contact')}</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:ecoscan@gmail.com" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-eco-leaf transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  ecoscan@gmail.com
                </a>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-eco-leaf transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-eco-leaf transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 EcoScan. {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground bg-eco-leaf/10 px-3 py-1 rounded-full">
              🌱 {t('carbonNeutral')}
            </span>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </footer>
  );
};
