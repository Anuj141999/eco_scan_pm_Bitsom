import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, History as HistoryIcon, Leaf, Trash2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

interface ScanHistoryItem {
  id: string;
  product_name: string;
  category: string | null;
  grade: string | null;
  carbon_footprint: number | null;
  biodegradable: number | null;
  created_at: string;
  is_demo: boolean | null;
}

const History = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("scan_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast({
        title: t("history.errorTitle"),
        description: t("history.errorDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase
        .from("scan_history")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: t("history.deleteSuccess"),
        description: t("history.deleteSuccessDescription"),
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: t("history.deleteError"),
        description: t("history.deleteErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const getGradeColor = (grade: string | null) => {
    switch (grade) {
      case "S":
        return "bg-gradient-to-r from-yellow-400 to-amber-500 text-black";
      case "A":
        return "bg-green-500 text-white";
      case "B":
        return "bg-emerald-400 text-white";
      case "C":
        return "bg-yellow-500 text-black";
      case "D":
        return "bg-orange-500 text-white";
      case "F":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <HistoryIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t("history.title")}</h1>
                <p className="text-muted-foreground">{t("history.subtitle")}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("history.empty")}</h3>
                <p className="text-muted-foreground mb-6">{t("history.emptyDescription")}</p>
                <Button onClick={() => navigate("/scanner")}>
                  {t("history.startScanning")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold truncate">
                                {item.product_name}
                              </h3>
                              {item.is_demo && (
                                <Badge variant="secondary" className="text-xs shrink-0">
                                  Demo
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                              {item.category && (
                                <span className="bg-muted px-2 py-0.5 rounded">
                                  {item.category}
                                </span>
                              )}
                              <span>{formatDate(item.created_at)}</span>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                              {item.carbon_footprint !== null && (
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">
                                    {t("history.carbonFootprint")}:
                                  </span>
                                  <span className="font-medium">
                                    {item.carbon_footprint}%
                                  </span>
                                </div>
                              )}
                              {item.biodegradable !== null && (
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">
                                    {t("history.biodegradable")}:
                                  </span>
                                  <span className="font-medium">
                                    {item.biodegradable}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <Badge className={`${getGradeColor(item.grade)} text-lg px-3 py-1`}>
                              {item.grade || "?"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteHistoryItem(item.id)}
                              disabled={deleting === item.id}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              {deleting === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default History;
