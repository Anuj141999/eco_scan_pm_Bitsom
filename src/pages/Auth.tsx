import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff, Wand2, Check, X, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Validation schemas
const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters");

// Password strength requirements
const passwordRequirements = [
  { id: "length", label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
  { id: "uppercase", label: "One uppercase letter (A-Z)", test: (pwd: string) => /[A-Z]/.test(pwd) },
  { id: "lowercase", label: "One lowercase letter (a-z)", test: (pwd: string) => /[a-z]/.test(pwd) },
  { id: "number", label: "One number (0-9)", test: (pwd: string) => /[0-9]/.test(pwd) },
  { id: "special", label: "One special character (!@#$%^&*)", test: (pwd: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
];

// Generate a strong password
const generateStrongPassword = (): string => {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghjkmnpqrstuvwxyz";
  const numbers = "23456789";
  const special = "!@#$%^&*";
  
  let password = "";
  
  // Ensure at least one of each required type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill remaining with random mix
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = 0; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split("").sort(() => Math.random() - 0.5).join("");
};

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot-password">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    return passwordRequirements.map(req => ({
      ...req,
      met: req.test(formData.password),
    }));
  }, [formData.password]);

  const allRequirementsMet = passwordStrength.every(req => req.met);
  const strengthPercentage = (passwordStrength.filter(req => req.met).length / passwordRequirements.length) * 100;

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "signup" || urlMode === "login") {
      setMode(urlMode);
    }
  }, [searchParams]);

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/scanner");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/scanner");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = (validatePassword: boolean = true): boolean => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    const emailResult = emailSchema.safeParse(formData.email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    if (validatePassword) {
      // For signup, require all password conditions to be met
      if (mode === "signup") {
        if (!allRequirementsMet) {
          newErrors.password = "Password must meet all requirements below";
        }
      } else {
        // For login, just check minimum length
        const passwordResult = passwordSchema.safeParse(formData.password);
        if (!passwordResult.success) {
          newErrors.password = passwordResult.error.errors[0].message;
        }
      }
    }

    if (mode === "signup") {
      const nameResult = nameSchema.safeParse(formData.name);
      if (!nameResult.success) {
        newErrors.name = nameResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(false)) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth?mode=login`,
      });

      if (error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setResetEmailSent(true);
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.name,
            }
          }
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }

        toast({
          title: "Account created!",
          description: "Your account has been created. Start scanning products!",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
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
                {mode === "login" 
                  ? "Welcome back" 
                  : mode === "signup" 
                    ? "Create account"
                    : "Reset password"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {mode === "login"
                  ? "Sign in to continue scanning"
                  : mode === "signup"
                    ? "Start your eco-friendly journey"
                    : "Enter your email to reset your password"}
              </p>
            </div>

            <Card className="shadow-lifted">
              <CardContent className="p-6">
                {/* Forgot Password Mode */}
                {mode === "forgot-password" ? (
                  resetEmailSent ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-4"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Check your inbox</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We've sent a password reset link to <strong>{formData.email}</strong>
                      </p>
                      <Button
                        variant="eco-outline"
                        onClick={() => {
                          setMode("login");
                          setResetEmailSent(false);
                        }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Sign In
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="you@example.com"
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-destructive">{errors.email}</p>
                        )}
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
                            Sending...
                          </span>
                        ) : (
                          "Send Reset Link"
                        )}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          Back to Sign In
                        </button>
                      </div>
                    </form>
                  )
                ) : (
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
                            className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required={mode === "signup"}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-xs text-destructive">{errors.name}</p>
                        )}
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
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {mode === "signup" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-primary hover:text-primary/80"
                          onClick={() => {
                            const strongPassword = generateStrongPassword();
                            setFormData({ ...formData, password: strongPassword });
                            setShowPassword(true);
                            toast({
                              title: "Strong password generated!",
                              description: "Make sure to save it somewhere safe.",
                            });
                          }}
                        >
                          <Wand2 className="w-3 h-3 mr-1" />
                          Suggest Strong Password
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
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
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    )}

                    {/* Password strength indicator - only show on signup */}
                    <AnimatePresence>
                      {mode === "signup" && formData.password.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 pt-2"
                        >
                          {/* Strength bar */}
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${strengthPercentage}%` }}
                              className={`h-full transition-colors ${
                                strengthPercentage <= 40 
                                  ? "bg-red-500" 
                                  : strengthPercentage <= 60 
                                    ? "bg-orange-500" 
                                    : strengthPercentage <= 80 
                                      ? "bg-yellow-500" 
                                      : "bg-green-500"
                              }`}
                            />
                          </div>
                          
                          {/* Requirements list */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Password must contain:</p>
                            {passwordStrength.map((req) => (
                              <div
                                key={req.id}
                                className={`flex items-center gap-1.5 text-xs transition-colors ${
                                  req.met ? "text-green-600" : "text-muted-foreground"
                                }`}
                              >
                                {req.met ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <X className="w-3 h-3" />
                                )}
                                <span>{req.label}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                )}

                {mode !== "forgot-password" && (
                  <>
                    {/* Forgot Password Link - only show on login */}
                    {mode === "login" && (
                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={() => setMode("forgot-password")}
                          className="text-sm text-muted-foreground hover:text-primary hover:underline"
                        >
                          Forgot your password?
                        </button>
                      </div>
                    )}

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
                  </>
                )}
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
