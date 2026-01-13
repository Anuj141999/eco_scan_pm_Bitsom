import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CreditsExhaustedModalProps {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function CreditsExhaustedModal({ open, onClose, onRetry, isRetrying }: CreditsExhaustedModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
            <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-xl">{t("creditsExhaustedTitle", "AI Credits Exhausted")}</DialogTitle>
          <DialogDescription className="text-center max-w-sm">
            {t(
              "creditsExhaustedDesc",
              "Your workspace has run out of AI credits. Add more credits to continue scanning products."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">{t("howToAddCredits", "How to add credits")}</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>{t("step1Credits", "Go to Settings, Workspace, Usage")}</li>
              <li>{t("step2Credits", 'Click "Add Credits" or upgrade your plan')}</li>
              <li>{t("step3Credits", "Return here and retry")}</li>
            </ol>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            {t("close", "Close")}
          </Button>
          <Button variant="eco" onClick={onRetry} disabled={isRetrying} className="w-full sm:w-auto gap-2">
            {isRetrying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {t("retryWithLastImage", "Retry with Last Image")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
