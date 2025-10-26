import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Sparkles, 
  Type, 
  RotateCw, 
  Frame,
  Sun,
  Contrast,
  Droplet,
  Wind
} from 'lucide-react';
import { motion } from 'framer-motion';

const FilterButton = ({ name, active, onClick }) => (
  <Button
    variant={active ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className={`${
      active
        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
        : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
    }`}
  >
    {name}
  </Button>
);

export default function EditControls({ settings, onSettingChange }) {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 sticky top-6">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Edit Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="adjust" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 mb-6">
            <TabsTrigger value="adjust" className="data-[state=active]:bg-purple-500">
              <Palette className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="filters" className="data-[state=active]:bg-purple-500">
              <Sparkles className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-purple-500">
              <Type className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="transform" className="data-[state=active]:bg-purple-500">
              <RotateCw className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* Adjustments Tab */}
          <TabsContent value="adjust" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-400" />
                    Brightness
                  </Label>
                  <span className="text-purple-300 text-sm">{settings.brightness}%</span>
                </div>
                <Slider
                  value={[settings.brightness]}
                  onValueChange={(val) => onSettingChange('brightness', val[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white flex items-center gap-2">
                    <Contrast className="w-4 h-4 text-blue-400" />
                    Contrast
                  </Label>
                  <span className="text-purple-300 text-sm">{settings.contrast}%</span>
                </div>
                <Slider
                  value={[settings.contrast]}
                  onValueChange={(val) => onSettingChange('contrast', val[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-pink-400" />
                    Saturation
                  </Label>
                  <span className="text-purple-300 text-sm">{settings.saturation}%</span>
                </div>
                <Slider
                  value={[settings.saturation]}
                  onValueChange={(val) => onSettingChange('saturation', val[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    Blur
                  </Label>
                  <span className="text-purple-300 text-sm">{settings.blur}px</span>
                </div>
                <Slider
                  value={[settings.blur]}
                  onValueChange={(val) => onSettingChange('blur', val[0])}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </motion.div>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Label className="text-white">Preset Filters</Label>
              <div className="grid grid-cols-2 gap-2">
                <FilterButton
                  name="None"
                  active={settings.filter === 'none'}
                  onClick={() => onSettingChange('filter', 'none')}
                />
                <FilterButton
                  name="Grayscale"
                  active={settings.filter === 'grayscale'}
                  onClick={() => onSettingChange('filter', 'grayscale')}
                />
                <FilterButton
                  name="Sepia"
                  active={settings.filter === 'sepia'}
                  onClick={() => onSettingChange('filter', 'sepia')}
                />
                <FilterButton
                  name="Invert"
                  active={settings.filter === 'invert'}
                  onClick={() => onSettingChange('filter', 'invert')}
                />
                <FilterButton
                  name="Vintage"
                  active={settings.filter === 'vintage'}
                  onClick={() => onSettingChange('filter', 'vintage')}
                />
              </div>
            </motion.div>
          </TabsContent>

          {/* Text Tab */}
          <TabsContent value="text" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-white">Caption Text</Label>
                <Input
                  value={settings.text}
                  onChange={(e) => onSettingChange('text', e.target.value)}
                  placeholder="Enter your caption..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.textColor}
                    onChange={(e) => onSettingChange('textColor', e.target.value)}
                    className="w-16 h-10 cursor-pointer"
                  />
                  <Input
                    value={settings.textColor}
                    onChange={(e) => onSettingChange('textColor', e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Text Size</Label>
                  <span className="text-purple-300 text-sm">{settings.textSize}px</span>
                </div>
                <Slider
                  value={[settings.textSize]}
                  onValueChange={(val) => onSettingChange('textSize', val[0])}
                  min={12}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Horizontal Position</Label>
                <Slider
                  value={[settings.textPosition.x]}
                  onValueChange={(val) => 
                    onSettingChange('textPosition', { ...settings.textPosition, x: val[0] })
                  }
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Vertical Position</Label>
                <Slider
                  value={[settings.textPosition.y]}
                  onValueChange={(val) => 
                    onSettingChange('textPosition', { ...settings.textPosition, y: val[0] })
                  }
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </motion.div>
          </TabsContent>

          {/* Transform Tab */}
          <TabsContent value="transform" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Rotation</Label>
                  <span className="text-purple-300 text-sm">{settings.rotation}°</span>
                </div>
                <Slider
                  value={[settings.rotation]}
                  onValueChange={(val) => onSettingChange('rotation', val[0])}
                  min={0}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Flip</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={settings.flipH ? "default" : "outline"}
                    onClick={() => onSettingChange('flipH', !settings.flipH)}
                    className={`${
                      settings.flipH
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    Flip Horizontal
                  </Button>
                  <Button
                    variant={settings.flipV ? "default" : "outline"}
                    onClick={() => onSettingChange('flipV', !settings.flipV)}
                    className={`${
                      settings.flipV
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    Flip Vertical
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Frame className="w-4 h-4 text-purple-400" />
                  Border
                </Label>
                <div className="flex gap-2 items-center">
                  <Slider
                    value={[settings.borderWidth]}
                    onValueChange={(val) => onSettingChange('borderWidth', val[0])}
                    min={0}
                    max={50}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-purple-300 text-sm w-12">{settings.borderWidth}px</span>
                </div>
              </div>

              {settings.borderWidth > 0 && (
                <div className="space-y-2">
                  <Label className="text-white">Border Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.borderColor}
                      onChange={(e) => onSettingChange('borderColor', e.target.value)}
                      className="w-16 h-10 cursor-pointer"
                    />
                    <Input
                      value={settings.borderColor}
                      onChange={(e) => onSettingChange('borderColor', e.target.value)}
                      className="flex-1 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
