import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "signup" || urlMode === "login") {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: mode === "login" ? "Welcome back!" : "Account created!",
      description: mode === "login" 
        ? "You've successfully logged in." 
        : "Your account has been created. Start scanning products!",
    });

    setIsLoading(false);
    
    // In a real app, redirect to scanner
    window.location.href = "/scanner";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl eco-gradient flex items-center justify-center shadow-eco">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {mode === "login"
                  ? "Sign in to continue scanning"
                  : "Start your eco-friendly journey"}
              </p>
            </div>

            <Card className="shadow-lifted">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {mode === "signup" && (
                      <motion.div
                        key="name"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className="pl-10"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required={mode === "signup"}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="eco"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Leaf className="w-4 h-4" />
                        </motion.span>
                        {mode === "login" ? "Signing in..." : "Creating account..."}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {mode === "login" ? "Sign In" : "Create Account"}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {mode === "login" ? (
                      <>
                        Don't have an account?{" "}
                        <button
                          onClick={() => setMode("signup")}
                          className="text-primary font-medium hover:underline"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          onClick={() => setMode("login")}
                          className="text-primary font-medium hover:underline"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Demo Option */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-muted-foreground mb-3">
                Just want to try it out?
              </p>
              <Link to="/scanner?demo=true">
                <Button variant="outline" size="sm">
                  Try Free Demo (3 scans)
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
