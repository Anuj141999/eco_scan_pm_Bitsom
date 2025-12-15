import { Navbar } from "@/components/layout/Navbar";
import { Leaf, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: December 15, 2024</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to EcoScan. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, disclose, and safeguard your information when 
              you use our mobile application and website.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
              policy, please do not access the application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-foreground">2.1 Personal Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Register for an account</li>
              <li>Subscribe to our services</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              This information may include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Name and email address</li>
              <li>Phone number</li>
              <li>Billing and payment information</li>
              <li>Account preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6">2.2 Usage Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              We automatically collect certain information when you use EcoScan, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Device information (type, operating system, unique device identifiers)</li>
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Pages visited and features used</li>
              <li>Products scanned and search queries</li>
              <li>Time and date of your visits</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6">2.3 Image Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you use our product scanning feature, we process images you upload to analyze product 
              sustainability. These images are processed in real-time and are not permanently stored on 
              our servers unless you explicitly save them to your scan history.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide, operate, and maintain our services</li>
              <li>Process your transactions and manage your subscriptions</li>
              <li>Analyze product sustainability and provide eco-scores</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about updates, offers, and support</li>
              <li>Detect and prevent fraud or unauthorized access</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Sharing Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Third-party vendors who help us operate our platform (payment processors, cloud hosting, analytics)</li>
              <li><strong>Business Partners:</strong> Companies we partner with to offer joint products or services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal 
              data against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect 
              your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to certain processing of your data</li>
              <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us at the email address provided below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience. These include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Essential Cookies:</strong> Required for the application to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You can control cookies through your browser settings. Disabling certain cookies may affect 
              the functionality of our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our application may contain links to third-party websites and services, including eco-friendly 
              product retailers. We are not responsible for the privacy practices of these third parties. 
              We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              EcoScan is not intended for children under the age of 13. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and believe your child has 
              provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by 
              posting the new privacy policy on this page and updating the "Last updated" date. We encourage 
              you to review this policy periodically for any changes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicy;
