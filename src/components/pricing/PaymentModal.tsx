import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Building2, Banknote, Check, AlertTriangle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
}

type PaymentMethod = "credit_card" | "debit_card" | "upi" | "bank";

const paymentMethods = [
  { id: "credit_card" as PaymentMethod, label: "Credit Card", icon: CreditCard },
  { id: "debit_card" as PaymentMethod, label: "Debit Card", icon: Banknote },
  { id: "upi" as PaymentMethod, label: "UPI", icon: Smartphone },
  { id: "bank" as PaymentMethod, label: "Bank Transfer", icon: Building2 },
];

export const PaymentModal = ({ isOpen, onClose, planName, planPrice }: PaymentModalProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");

  const handleContactSales = () => {
    window.location.href = "mailto:ecoscan@gmail.com?subject=Subscription%20Inquiry%20-%20" + encodeURIComponent(planName) + "%20Plan";
    toast({
      title: "Opening Email",
      description: "Please contact our sales team to complete your subscription.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Subscribe to {planName}</DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-eco-leaf">{planPrice}/month</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Demo Mode Warning */}
          <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Demo Mode:</strong> Payment processing is not available in this demo. 
              Contact our sales team to subscribe.
            </AlertDescription>
          </Alert>

          {/* Payment Method Selection (Display Only) */}
          <div className="space-y-3">
            <Label className="text-muted-foreground">Available Payment Methods</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="grid grid-cols-2 gap-3"
            >
              {paymentMethods.map((method) => (
                <Label
                  key={method.id}
                  htmlFor={method.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                  <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">{method.label}</span>
                  {paymentMethod === method.id && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Plan Features Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">What's included:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Full access to eco-scores</li>
              <li>• Carbon footprint & biodegradability metrics</li>
              <li>• Eco-friendly product suggestions</li>
              <li>• Priority support</li>
            </ul>
          </div>

          {/* Contact Sales Button */}
          <Button
            onClick={handleContactSales}
            variant="eco"
            className="w-full"
            size="lg"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Contact Sales to Subscribe
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Our team will help you set up secure payment processing.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
