import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function ImageCanvas({ image, settings, canvasRef }) {
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas size based on container
      const maxWidth = containerRef.current?.clientWidth || 800;
      const maxHeight = 600;
      let width = img.width;
      let height = img.height;

      // Scale to fit
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();

      // Apply rotation and flip
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((settings.rotation * Math.PI) / 180);
      ctx.scale(settings.flipH ? -1 : 1, settings.flipV ? -1 : 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Apply filters
      let filterString = '';
      filterString += `brightness(${settings.brightness}%) `;
      filterString += `contrast(${settings.contrast}%) `;
      filterString += `saturate(${settings.saturation}%) `;
      filterString += `blur(${settings.blur}px)`;

      ctx.filter = filterString;

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Reset filter for border and text
      ctx.filter = 'none';

      // Restore context
      ctx.restore();

      // Apply preset filter
      if (settings.filter !== 'none') {
        ctx.save();
        applyPresetFilter(ctx, canvas, settings.filter);
        ctx.restore();
      }

      // Draw border
      if (settings.borderWidth > 0) {
        ctx.strokeStyle = settings.borderColor;
        ctx.lineWidth = settings.borderWidth;
        ctx.strokeRect(
          settings.borderWidth / 2,
          settings.borderWidth / 2,
          canvas.width - settings.borderWidth,
          canvas.height - settings.borderWidth
        );
      }

      // Draw text
      if (settings.text) {
        ctx.font = `bold ${settings.textSize}px Inter, sans-serif`;
        ctx.fillStyle = settings.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        const x = (canvas.width * settings.textPosition.x) / 100;
        const y = (canvas.height * settings.textPosition.y) / 100;
        ctx.fillText(settings.text, x, y);
      }
    };

    img.src = image;
  }, [image, settings, canvasRef]);

  const applyPresetFilter = (ctx, canvas, filter) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (filter) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
          data[i] = data[i + 1] = data[i + 2] = gray;
        }
        break;
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        break;
      case 'invert':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
        break;
      case 'vintage':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.2);
          data[i + 1] = Math.min(255, data[i + 1] * 0.9);
          data[i + 2] = Math.min(255, data[i + 2] * 0.7);
        }
        break;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8">
        <div ref={containerRef} className="flex items-center justify-center min-h-[500px]">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
      </Card>
    </motion.div>
  );
}
