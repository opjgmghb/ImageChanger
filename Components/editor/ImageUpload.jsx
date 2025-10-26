import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ImageUpload({ onImageUpload }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-xl">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative transition-all duration-300 ${
            dragActive ? 'bg-purple-500/20 border-purple-400' : ''
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center min-h-[500px] cursor-pointer p-12"
          >
            <motion.div
              animate={{
                scale: dragActive ? 1.1 : 1,
                rotate: dragActive ? 5 : 0,
              }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/50">
                <Upload className="w-16 h-16 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4"
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-3 text-center">
              {dragActive ? 'Drop your image here' : 'Upload Your Image'}
            </h2>
            <p className="text-purple-200 text-lg mb-8 text-center max-w-md">
              Drag and drop your image here, or click to browse
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>JPG, PNG, GIF, WebP</span>
              </div>
              <span className="text-white/40">•</span>
              <span>Max 10MB</span>
            </div>
          </label>
        </div>
      </Card>
    </motion.div>
  );
}
