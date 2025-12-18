import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        navigate("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast({
        title: "Error",
        description: "Something went wrong during logout.",
        variant: "destructive",
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl eco-gradient flex items-center justify-center shadow-eco group-hover:shadow-lifted transition-shadow">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Eco<span className="text-gradient-eco">Scan</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Home
            </Link>
            <Link 
              to="/scanner" 
              className={`text-sm font-medium transition-colors ${isActive('/scanner') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Scanner
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors ${isActive('/pricing') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                  {session.user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="eco" size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/scanner" 
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Scanner
              </Link>
              <Link 
                to="/pricing" 
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex gap-3 pt-2">
                {session ? (
                  <div className="flex flex-col gap-3 w-full">
                    <span className="text-sm text-muted-foreground truncate">
                      {session.user.email}
                    </span>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/auth?mode=login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link to="/auth?mode=signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="eco" className="w-full">Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
