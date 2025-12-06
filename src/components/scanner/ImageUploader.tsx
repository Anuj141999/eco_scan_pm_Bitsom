import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const startCamera = async () => {
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
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {showCamera ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden bg-foreground/5"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <Button variant="eco" size="lg" onClick={capturePhoto}>
                <Camera className="w-5 h-5" />
                Capture
              </Button>
              <Button variant="secondary" size="lg" onClick={stopCamera}>
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
            className="relative rounded-2xl overflow-hidden"
          >
            <img
              src={previewImage}
              alt="Product preview"
              className="w-full aspect-video object-contain bg-foreground/5"
            />
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
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
              relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12
              ${isDragging 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }
            `}
          >
            <div className="text-center">
              <motion.div
                animate={{ y: isDragging ? -5 : 0 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center"
              >
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">
                {isDragging ? "Drop your image here" : "Upload Product Image"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Drag and drop an image, or click to browse
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="eco" onClick={startCamera}>
                  <Camera className="w-4 h-4" />
                  Take Photo
                </Button>
                <Button 
                  variant="eco-outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
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
          <Button variant="hero" size="xl" onClick={analyzeImage}>
            Analyze Product
          </Button>
        </motion.div>
      )}
    </div>
  );
};
