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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Building2, Banknote, Check, Loader2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  
  // UPI
  const [upiId, setUpiId] = useState("");
  
  // Bank
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    toast({
      title: "Payment Successful!",
      description: `You've subscribed to the ${planName} plan.`,
    });
    onClose();
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "credit_card":
      case "debit_card":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </motion.div>
        );

      case "upi":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Tabs defaultValue="upi_id" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upi_id">UPI ID</TabsTrigger>
                <TabsTrigger value="qr_code">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan QR
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upi_id" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter your UPI ID (e.g., yourname@paytm, yourname@gpay, yourname@ybl)
                </p>
              </TabsContent>
              <TabsContent value="qr_code" className="mt-4">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5">
                  {/* QR Code Display */}
                  <div className="w-48 h-48 bg-background rounded-lg p-3 shadow-lg mb-4">
                    <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjxnIGZpbGw9IiMwMDAiPjxyZWN0IHg9IjUiIHk9IjUiIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNSIvPjxyZWN0IHg9IjciIHk9IjciIHdpZHRoPSIyMSIgaGVpZ2h0PSIyMSIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1Ii8+PHJlY3QgeD0iNzAiIHk9IjUiIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNSIvPjxyZWN0IHg9IjcyIiB5PSI3IiB3aWR0aD0iMjEiIGhlaWdodD0iMjEiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI3NSIgeT0iMTAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIvPjxyZWN0IHg9IjUiIHk9IjcwIiB3aWR0aD0iMjUiIGhlaWdodD0iMjUiLz48cmVjdCB4PSI3IiB5PSI3MiIgd2lkdGg9IjIxIiBoZWlnaHQ9IjIxIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMTAiIHk9Ijc1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiLz48cmVjdCB4PSIzNSIgeT0iNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjQ1IiB5PSI1IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PHJlY3QgeD0iNTUiIHk9IjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSIzNSIgeT0iMTUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSI0NSIgeT0iMTUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSI1NSIgeT0iMTUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSIzNSIgeT0iMjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSI0NSIgeT0iMjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSI1NSIgeT0iMjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSI1IiB5PSIzNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjE1IiB5PSIzNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjI1IiB5PSIzNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjM1IiB5PSIzNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjQ1IiB5PSIzNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1Ii8+PHJlY3QgeD0iNjUiIHk9IjM1IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PHJlY3QgeD0iNzUiIHk9IjM1IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PHJlY3QgeD0iODUiIHk9IjM1IiB3aWR0aD0iNSIgaGVpZ2h0PSI1Ii8+PHJlY3QgeD0iNSIgeT0iNDUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSIxNSIgeT0iNDUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSIyNSIgeT0iNDUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSI2NSIgeT0iNDUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSI3NSIgeT0iNDUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSI4NSIgeT0iNDUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiLz48cmVjdCB4PSI1IiB5PSI1NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjE1IiB5PSI1NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjI1IiB5PSI1NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjM1IiB5PSI1NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjY1IiB5PSI1NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9Ijc1IiB5PSI1NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9Ijg1IiB5PSI1NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjM1IiB5PSI2NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjQ1IiB5PSI2NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjU1IiB5PSI2NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjY1IiB5PSI2NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9Ijc1IiB5PSI2NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9Ijg1IiB5PSI2NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjM1IiB5PSI3NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjQ1IiB5PSI3NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjU1IiB5PSI3NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjY1IiB5PSI3NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9Ijc1IiB5PSI3NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9Ijg1IiB5PSI3NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjM1IiB5PSI4NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjQ1IiB5PSI4NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjU1IiB5PSI4NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9IjY1IiB5PSI4NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9Ijc1IiB5PSI4NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjxyZWN0IHg9Ijg1IiB5PSI4NSIgd2lkdGg9IjUiIGhlaWdodD0iNSIvPjwvZz48L3N2Zz4=')] bg-contain rounded" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Scan to Pay</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Scan this QR code using any UPI app<br />
                    (GPay, PhonePe, Paytm, etc.)
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#5F259F] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PP</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#00BAF2] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PT</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">GP</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#00C853] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AM</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        );

      case "bank":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifsc">IFSC Code</Label>
              <Input
                id="ifsc"
                placeholder="ABCD0123456"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                required
              />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Subscribe to <span className="font-semibold text-foreground">{planName}</span> plan for{" "}
            <span className="font-semibold text-eco-leaf">{planPrice}/month</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
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

          {/* Payment Form */}
          <AnimatePresence mode="wait">
            {renderPaymentForm()}
          </AnimatePresence>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="eco"
            className="w-full"
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${planPrice}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your payment is secured with 256-bit encryption
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
