import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Check, 
  Pencil, 
  Eraser, 
  Undo,
  X,
  Palette
} from 'lucide-react';

export default function DrawingCanvas({ onComplete, onCancel }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [tool, setTool] = useState('pencil'); // 'pencil' or 'eraser'
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [history, setHistory] = useState([]);

  const commonColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#4B0082'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 600;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    setContext(ctx);
    saveToHistory(canvas);
  }, []);

  const saveToHistory = (canvas) => {
    const imageData = canvas.toDataURL();
    setHistory(prev => [...prev, imageData]);
  };

  const startDrawing = (e) => {
    if (!context) return;
    setIsDrawing(true);
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    context.lineWidth = lineWidth;
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && context) {
      context.closePath();
      saveToHistory(canvasRef.current);
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!context) return;
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveToHistory(canvasRef.current);
  };

  const undo = () => {
    if (history.length <= 1) return;
    
    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
    
    const lastImage = newHistory[newHistory.length - 1];
    const img = new Image();
    img.src = lastImage;
    img.onload = () => {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(img, 0, 0);
    };
  };

  const handleComplete = () => {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onComplete(dataUrl);
  };

  // Touch support
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvasRef.current.dispatchEvent(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvasRef.current.dispatchEvent(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvasRef.current.dispatchEvent(mouseEvent);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid lg:grid-cols-[1fr_350px] gap-6"
    >
      {/* Drawing Canvas */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="p-6">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full h-auto cursor-crosshair touch-none"
              style={{ maxHeight: '600px' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Drawing Controls */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 h-fit sticky top-6">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            Drawing Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Tool Selection */}
          <div className="space-y-3">
            <Label className="text-white">Tool</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={tool === 'pencil' ? 'default' : 'outline'}
                onClick={() => setTool('pencil')}
                className={`${
                  tool === 'pencil'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Pencil
              </Button>
              <Button
                variant={tool === 'eraser' ? 'default' : 'outline'}
                onClick={() => setTool('eraser')}
                className={`${
                  tool === 'eraser'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <Eraser className="w-4 h-4 mr-2" />
                Eraser
              </Button>
            </div>
          </div>

          {/* Color Picker */}
          {tool === 'pencil' && (
            <div className="space-y-3">
              <Label className="text-white">Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {commonColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-full aspect-square rounded-lg border-2 transition-all ${
                      color === c ? 'border-purple-400 scale-110' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* Line Width */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white">
                {tool === 'pencil' ? 'Brush Size' : 'Eraser Size'}
              </Label>
              <span className="text-purple-300 text-sm">{lineWidth}px</span>
            </div>
            <Slider
              value={[lineWidth]}
              onValueChange={(val) => setLineWidth(val[0])}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
            {/* Preview */}
            <div className="flex items-center justify-center h-16 bg-white/5 rounded-lg">
              <div
                className="rounded-full"
                style={{
                  width: `${lineWidth}px`,
                  height: `${lineWidth}px`,
                  backgroundColor: tool === 'pencil' ? color : '#999999'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={undo}
              disabled={history.length <= 1}
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Canvas
            </Button>
          </div>

          {/* Complete/Cancel */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <Button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Done Drawing
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
