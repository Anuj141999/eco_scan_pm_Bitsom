import { motion } from "framer-motion";
import { X, Leaf, Factory, Recycle, Droplets, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export interface ProductComposition {
  materials: {
    name: string;
    percentage: number;
    isEcoFriendly: boolean;
    recyclable: boolean;
  }[];
  packaging: {
    type: string;
    recyclable: boolean;
    biodegradable: boolean;
  };
  certifications: string[];
  environmentalImpact: {
    waterUsage: "low" | "medium" | "high";
    energyConsumption: "low" | "medium" | "high";
    wasteGeneration: "low" | "medium" | "high";
  };
}

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  grade: string;
  category: string;
  carbonFootprint: number;
  biodegradable: number;
  composition?: ProductComposition;
}

const gradeColors: Record<string, { bg: string; text: string }> = {
  S: { bg: "bg-emerald-500", text: "text-white" },
  A: { bg: "bg-green-500", text: "text-white" },
  B: { bg: "bg-lime-500", text: "text-white" },
  C: { bg: "bg-yellow-500", text: "text-foreground" },
  D: { bg: "bg-orange-500", text: "text-white" },
  F: { bg: "bg-red-500", text: "text-white" },
};

const impactColors = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

export const ProductDetailsModal = ({
  isOpen,
  onClose,
  productName,
  grade,
  category,
  carbonFootprint,
  biodegradable,
  composition,
}: ProductDetailsModalProps) => {
  const gradeStyle = gradeColors[grade] || gradeColors.C;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-8">
            <span className="text-xl font-bold">Product Details</span>
            <Badge className={`${gradeStyle.bg} ${gradeStyle.text} text-lg px-3 py-1`}>
              {grade}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold">{productName}</h3>
            <Badge variant="secondary">{category}</Badge>
          </motion.div>

          <Separator />

          {/* Sustainability Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="font-semibold flex items-center gap-2">
              <Leaf className="w-5 h-5 text-eco-leaf" />
              Sustainability Metrics
            </h4>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-muted-foreground" />
                    Carbon Footprint
                  </span>
                  <span className="font-medium">{carbonFootprint} kg CO₂</span>
                </div>
                <Progress value={Math.max(0, 100 - (carbonFootprint / 50) * 100)} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Recycle className="w-4 h-4 text-muted-foreground" />
                    Biodegradability
                  </span>
                  <span className="font-medium">{biodegradable}%</span>
                </div>
                <Progress value={biodegradable} className="h-2" />
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Material Composition */}
          {composition?.materials && composition.materials.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h4 className="font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-eco-earth" />
                Material Composition
              </h4>
              
              <div className="space-y-3">
                {composition.materials.map((material, index) => (
                  <motion.div
                    key={material.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      {material.isEcoFriendly ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{material.name}</p>
                        <div className="flex gap-2 mt-1">
                          {material.isEcoFriendly && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                              Eco-Friendly
                            </Badge>
                          )}
                          {material.recyclable && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                              Recyclable
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-lg">{material.percentage}%</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Packaging Info */}
          {composition?.packaging && (
            <>
              <Separator />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <h4 className="font-semibold">Packaging</h4>
                <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
                  <p className="font-medium">{composition.packaging.type}</p>
                  <div className="flex gap-2">
                    {composition.packaging.recyclable && (
                      <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">
                        <Recycle className="w-3 h-3 mr-1" />
                        Recyclable
                      </Badge>
                    )}
                    {composition.packaging.biodegradable && (
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                        <Leaf className="w-3 h-3 mr-1" />
                        Biodegradable
                      </Badge>
                    )}
                    {!composition.packaging.recyclable && !composition.packaging.biodegradable && (
                      <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Non-Recyclable
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Environmental Impact */}
          {composition?.environmentalImpact && (
            <>
              <Separator />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <h4 className="font-semibold flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-eco-sky" />
                  Environmental Impact
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <Droplets className={`w-5 h-5 mx-auto mb-1 ${impactColors[composition.environmentalImpact.waterUsage]}`} />
                    <p className="text-xs text-muted-foreground">Water Usage</p>
                    <p className={`font-semibold capitalize ${impactColors[composition.environmentalImpact.waterUsage]}`}>
                      {composition.environmentalImpact.waterUsage}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <Factory className={`w-5 h-5 mx-auto mb-1 ${impactColors[composition.environmentalImpact.energyConsumption]}`} />
                    <p className="text-xs text-muted-foreground">Energy</p>
                    <p className={`font-semibold capitalize ${impactColors[composition.environmentalImpact.energyConsumption]}`}>
                      {composition.environmentalImpact.energyConsumption}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <Package className={`w-5 h-5 mx-auto mb-1 ${impactColors[composition.environmentalImpact.wasteGeneration]}`} />
                    <p className="text-xs text-muted-foreground">Waste</p>
                    <p className={`font-semibold capitalize ${impactColors[composition.environmentalImpact.wasteGeneration]}`}>
                      {composition.environmentalImpact.wasteGeneration}
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Certifications */}
          {composition?.certifications && composition.certifications.length > 0 && (
            <>
              <Separator />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <h4 className="font-semibold">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {composition.certifications.map((cert) => (
                    <Badge key={cert} variant="secondary" className="text-sm">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
