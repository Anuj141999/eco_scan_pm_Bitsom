import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface ImageUploaderProps {
  onImageCapture: (imageData: string) => void;
}

export const ImageUploader = ({ onImageCapture }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { playClickSound } = useSoundEffects();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }, []);

  const convertToJpeg = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const jpegData = canvas.toDataURL("image/jpeg", 0.9);
          URL.revokeObjectURL(url);
          resolve(jpegData);
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };
      
      img.src = url;
    });
  };

  const processFile = async (file: File) => {
    try {
      const unsupportedFormats = ['image/avif', 'image/heic', 'image/heif'];
      
      if (unsupportedFormats.includes(file.type)) {
        const jpegData = await convertToJpeg(file);
        setPreviewImage(jpegData);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreviewImage(result);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const startCamera = async () => {
    playClickSound();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setPreviewImage(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeImage = () => {
    if (previewImage) {
      onImageCapture(previewImage);
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {showCamera ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-3xl overflow-hidden shadow-card border border-border/50"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
              <Button variant="hero" size="lg" onClick={capturePhoto}>
                <Camera className="w-5 h-5" />
                Capture
              </Button>
              <Button variant="glass" size="lg" onClick={stopCamera}>
                <X className="w-5 h-5" />
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : previewImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-3xl overflow-hidden shadow-card border border-border/50"
          >
            <img
              src={previewImage}
              alt="Product preview"
              className="w-full aspect-video object-contain bg-secondary/30"
            />
            <motion.button
              onClick={clearImage}
              className="absolute top-4 right-4 p-3 rounded-2xl glass-card shadow-card hover:bg-card transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative rounded-3xl border-2 border-dashed transition-all duration-300 p-12 overflow-hidden
              ${isDragging 
                ? "border-eco-leaf bg-eco-leaf/5 scale-[1.02] shadow-eco" 
                : "border-border hover:border-eco-leaf/50 hover:bg-secondary/30 shadow-card"
              }
            `}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 glow-gradient opacity-50 pointer-events-none" />
            
            <div className="text-center relative">
              <motion.div
                animate={{ 
                  y: isDragging ? -8 : 0,
                  scale: isDragging ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 mx-auto mb-6 rounded-3xl eco-gradient flex items-center justify-center shadow-eco"
              >
                <ImageIcon className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <h3 className="text-xl font-display font-bold mb-3">
                {isDragging ? "Drop your image here" : "Upload Product Image"}
              </h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                Drag and drop an image, or click the buttons below to get started
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="eco" size="lg" onClick={startCamera}>
                  <Camera className="w-5 h-5" />
                  Take Photo
                </Button>
                <Button 
                  variant="eco-outline" 
                  size="lg"
                  onClick={() => {
                    playClickSound();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="w-5 h-5" />
                  Upload Image
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {previewImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button variant="hero" size="xl" onClick={analyzeImage} className="group">
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Analyze Product
          </Button>
        </motion.div>
      )}
    </div>
  );
};
