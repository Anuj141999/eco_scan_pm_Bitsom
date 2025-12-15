import { Navbar } from "@/components/layout/Navbar";
import { Leaf, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms and Conditions</h1>
            <p className="text-muted-foreground">Last updated: December 15, 2024</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to EcoScan. These Terms and Conditions constitute a legally binding agreement between 
              you and EcoScan governing your access to and use of our website, mobile application, and 
              related services (collectively, the "Services").
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using our Services, you agree to be bound by these Terms. If you disagree 
              with any part of these terms, you may not access the Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Description of Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              EcoScan provides a sustainability analysis platform that allows users to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Scan or upload product images for sustainability analysis</li>
              <li>Receive eco-scores and sustainability grades (S/A/B/C/D/F)</li>
              <li>View carbon footprint and biodegradability metrics</li>
              <li>Discover eco-friendly product alternatives</li>
              <li>Access personalized sustainability recommendations</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our analysis is based on AI-powered image recognition and sustainability databases. While we 
              strive for accuracy, results should be considered as guidance rather than absolute assessments.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. User Accounts</h2>
            
            <h3 className="text-xl font-medium text-foreground">3.1 Registration</h3>
            <p className="text-muted-foreground leading-relaxed">
              To access certain features of our Services, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6">3.2 Account Termination</h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account at any time if you violate these 
              Terms or engage in conduct that we determine to be harmful to our Services or other users.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Subscription Plans and Payments</h2>
            
            <h3 className="text-xl font-medium text-foreground">4.1 Free Trial and Demo</h3>
            <p className="text-muted-foreground leading-relaxed">
              We offer a limited free demo that allows 3 product scans with basic features. Full access to 
              eco-scores, detailed metrics, and product suggestions requires a paid subscription.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6">4.2 Subscription Tiers</h3>
            <p className="text-muted-foreground leading-relaxed">
              We offer the following subscription plans:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Basic Plan (₹799/month):</strong> 30 scans per month</li>
              <li><strong>Pro Plan (₹3,999/month):</strong> 60 scans per month</li>
              <li><strong>Enterprise Plan (₹7,999/month):</strong> 200 scans per month</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6">4.3 Payment Terms</h3>
            <p className="text-muted-foreground leading-relaxed">
              By subscribing to a paid plan, you agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Pay all applicable fees as described at the time of purchase</li>
              <li>Provide valid payment information (credit card, debit card, UPI, or bank transfer)</li>
              <li>Authorize us to charge your payment method on a recurring basis</li>
              <li>Accept that prices may change with prior notice</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6">4.4 Refund Policy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Subscription fees are generally non-refundable. However, we may provide refunds or credits 
              at our sole discretion in cases of technical issues preventing service access or billing errors.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to use our Services to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Upload malicious content, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Services</li>
              <li>Use automated systems to access the Services without permission</li>
              <li>Resell or redistribute our Services without authorization</li>
              <li>Upload inappropriate, offensive, or illegal content</li>
              <li>Impersonate others or provide false information</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Intellectual Property</h2>
            
            <h3 className="text-xl font-medium text-foreground">6.1 Our Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Services, including all content, features, and functionality, are owned by EcoScan and 
              are protected by copyright, trademark, and other intellectual property laws. You may not copy, 
              modify, distribute, or create derivative works without our express written consent.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6">6.2 User Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of content you upload to our Services (such as product images). By 
              uploading content, you grant us a non-exclusive, royalty-free license to use, process, and 
              analyze such content to provide our Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED. WE SPECIFICALLY DISCLAIM:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties that the Services will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy of sustainability assessments</li>
              <li>Warranties that defects will be corrected</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our eco-scores and sustainability metrics are based on available data and AI analysis. They 
              should not be considered as definitive environmental certifications or endorsements.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ECOSCAN SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from your use or inability to use the Services</li>
              <li>Damages exceeding the amount you paid us in the past 12 months</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, 
              so some of the above limitations may not apply to you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless EcoScan and its officers, directors, employees, 
              and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Your use of the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of third parties</li>
              <li>Any content you upload or submit through the Services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Services may contain links to third-party websites, including online retailers for 
              eco-friendly products. We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>The content, accuracy, or practices of third-party websites</li>
              <li>Products or services offered by third parties</li>
              <li>Your transactions with third-party retailers</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We encourage you to review the terms and privacy policies of any third-party services you access.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. Modifications to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of significant 
              changes by posting a notice on our website or sending you an email. Your continued use of 
              the Services after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">12. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India, without 
              regard to its conflict of law provisions. Any disputes arising from these Terms shall be 
              resolved in the courts of India.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">13. Severability</h2>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall 
              be limited or eliminated to the minimum extent necessary, and the remaining provisions shall 
              remain in full force and effect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">14. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-card border border-border rounded-lg p-6 mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg eco-gradient flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg text-foreground">EcoScan</span>
              </div>
              <a 
                href="mailto:ecoscan@gmail.com" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="w-4 h-4" />
                ecoscan@gmail.com
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 EcoScan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
