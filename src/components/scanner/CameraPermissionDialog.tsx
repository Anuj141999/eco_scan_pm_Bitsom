import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Camera, Shield } from "lucide-react";

interface CameraPermissionDialogProps {
  open: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export const CameraPermissionDialog = ({
  open,
  onAllow,
  onDeny,
}: CameraPermissionDialogProps) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full eco-gradient flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary-foreground" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            {t("cameraPermissionTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <p>{t("cameraPermissionDesc")}</p>
             <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
               <Shield className="w-4 h-4 text-eco-leaf" />
               <span>{t("privacyProtected")}</span>
             </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <AlertDialogCancel onClick={onDeny} className="flex-1">
            {t("denyCamera")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAllow} className="flex-1 eco-gradient text-primary-foreground">
            {t("allowCamera")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
