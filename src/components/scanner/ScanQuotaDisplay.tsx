import { motion } from "framer-motion";
import { Leaf, Database } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ScanQuotaDisplayProps {
  used: number;
  limit: number;
  remaining: number;
  isDemo: boolean;
  resetDate: Date | null;
  cachedScans?: number;
}

export function ScanQuotaDisplay({
  used,
  limit,
  remaining,
  isDemo,
  resetDate,
  cachedScans = 0,
}: ScanQuotaDisplayProps) {
  const { t } = useTranslation();
  const percentage = Math.round((used / limit) * 100);
  const isLow = remaining <= Math.ceil(limit * 0.2);
  const isExhausted = remaining === 0;

  const getProgressColor = () => {
    if (isExhausted) return "bg-destructive";
    if (isLow) return "bg-amber-500";
    return "bg-eco-leaf";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card rounded-2xl p-4 shadow-card border border-border/50">
        {/* Main quota row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExhausted ? 'bg-destructive/10' : 'eco-gradient'}`}>
              <Leaf className={`w-5 h-5 ${isExhausted ? 'text-destructive' : 'text-primary-foreground'}`} />
            </div>
            <div>
              <p className="text-sm font-medium">
                <span className={`font-bold ${isExhausted ? 'text-destructive' : 'text-eco-leaf'}`}>
                  {used}
                </span>
                <span className="text-muted-foreground"> / {limit} {t("scansUsed", "scans used")}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {isDemo ? t("demoMode", "Demo Mode") : t("authenticatedMode", "Full Access")}
                <span className="ml-2">• {t("scansLeft", { count: remaining, defaultValue: `${remaining} left` })}</span>
              </p>
            </div>
          </div>
          
          {/* Status badges */}
          <div className="flex items-center gap-2">
            {cachedScans > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600 text-xs">
                      <Database className="w-3 h-3" />
                      {cachedScans}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("cachedScansDesc", { count: cachedScans, defaultValue: `${cachedScans} cached results - instant & free` })}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <Progress value={percentage} className="h-2 bg-secondary" />
          <div 
            className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Warning messages */}
        {(isLow || isExhausted) && (
          <div className="flex items-center justify-end mt-2">
            {isLow && !isExhausted && (
              <p className="text-xs text-amber-600">
                {t("lowQuotaWarning", "Running low on scans")}
              </p>
            )}
            
            {isExhausted && (
              <p className="text-xs text-destructive font-medium">
                {t("quotaExhausted", "Daily limit reached")}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
