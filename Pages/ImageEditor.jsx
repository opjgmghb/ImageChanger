import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Upload, RotateCw, Crop, Type, Sparkles, Pencil, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '../components/editor/ImageUpload';
import DrawingCanvas from '../components/editor/DrawingCanvas';
import EditControls from '../components/editor/EditControls';
import ImageCanvas from '../components/editor/ImageCanvas';

export default function ImageEditor() {
  const [mode, setMode] = useState(null); // null, 'upload', or 'draw'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editSettings, setEditSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotation: 0,
    flipH: false,
    flipV: false,
    filter: 'none',
    borderWidth: 0,
    borderColor: '#000000',
    text: '',
    textColor: '#ffffff',
    textSize: 32,
    textPosition: { x: 50, y: 50 }
  });

  const canvasRef = useRef(null);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrawingComplete = (dataUrl) => {
    setUploadedImage(dataUrl);
  };

  const handleSettingChange = (key, value) => {
    setEditSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const resetImage = () => {
    setUploadedImage(null);
    setMode(null);
    setEditSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      rotation: 0,
      flipH: false,
      flipV: false,
      filter: 'none',
      borderWidth: 0,
      borderColor: '#000000',
      text: '',
      textColor: '#ffffff',
      textSize: 32,
      textPosition: { x: 50, y: 50 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                  Image Editor
                </h1>
                <p className="text-purple-200 text-lg">Transform your images with powerful editing tools</p>
              </div>
              {uploadedImage && (
                <div className="flex gap-3">
                  <Button
                    onClick={resetImage}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {!mode ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
                >
                  {/* Upload Option */}
                  <Card 
                    className="relative overflow-hidden border-2 border-white/20 bg-white/5 backdrop-blur-xl cursor-pointer hover:border-purple-400 transition-all group"
                    onClick={() => setMode('upload')}
                  >
                    <div className="p-12 text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/50"
                      >
                        <ImageIcon className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-3">Upload Image</h3>
                      <p className="text-purple-200">
                        Upload an existing image from your device to edit
                      </p>
                    </div>
                  </Card>

                  {/* Draw Option */}
                  <Card 
                    className="relative overflow-hidden border-2 border-white/20 bg-white/5 backdrop-blur-xl cursor-pointer hover:border-purple-400 transition-all group"
                    onClick={() => setMode('draw')}
                  >
                    <div className="p-12 text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50"
                      >
                        <Pencil className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-3">Draw & Create</h3>
                      <p className="text-purple-200">
                        Create your own drawing from scratch
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ) : !uploadedImage ? (
                mode === 'upload' ? (
                  <ImageUpload onImageUpload={handleImageUpload} />
                ) : (
                  <DrawingCanvas onComplete={handleDrawingComplete} onCancel={() => setMode(null)} />
                )
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid lg:grid-cols-[1fr_400px] gap-6"
                >
                  {/* Canvas Area */}
                  <div>
                    <ImageCanvas
                      image={uploadedImage}
                      settings={editSettings}
                      canvasRef={canvasRef}
                    />
                  </div>

                  {/* Controls Sidebar */}
                  <div>
                    <EditControls
                      settings={editSettings}
                      onSettingChange={handleSettingChange}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
