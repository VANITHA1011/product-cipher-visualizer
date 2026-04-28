import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shuffle, RotateCcw } from 'lucide-react';

const ControlPanel = ({ plaintext, setPlaintext, shift, setShift, rails, setRails, cipherMode, setCipherMode, animationSpeed, setAnimationSpeed, onReset }) => {
  const handleRandomizeShift = () => setShift(Math.floor(Math.random() * 25) + 1);
  const handleRandomizeRails = () => setRails(Math.floor(Math.random() * 7) + 2);

  return (
    <Card className="glass-card h-full border-0">
      <CardHeader>
        <CardTitle className="text-gray-900">Cipher Controls</CardTitle>
        <CardDescription className="text-gray-500">Configure encryption parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="plaintext" className="text-gray-700">Plaintext</Label>
            <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
              {plaintext.length} chars
            </Badge>
          </div>
          <Textarea
            id="plaintext"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value.toUpperCase())}
            placeholder="ENTER TEXT..."
            className="min-h-[80px] bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 font-mono uppercase"
            maxLength={100}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-gray-700">Cipher Mode</Label>
          <RadioGroup value={cipherMode} onValueChange={setCipherMode} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded border border-gray-200">
              <RadioGroupItem value="caesar" id="mode-caesar" />
              <Label htmlFor="mode-caesar" className="cursor-pointer flex-1 text-gray-700">Caesar Only (Substitution)</Label>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded border border-gray-200">
              <RadioGroupItem value="railFence" id="mode-rail" />
              <Label htmlFor="mode-rail" className="cursor-pointer flex-1 text-gray-700">Rail Fence Only (Transposition)</Label>
            </div>
            <div className="flex items-center space-x-2 bg-cyan-50 p-2 rounded border border-cyan-200">
              <RadioGroupItem value="product" id="mode-product" />
              <Label htmlFor="mode-product" className="cursor-pointer flex-1 text-cyan-700 font-medium">Product Cipher (Combined)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className={`space-y-3 transition-opacity ${cipherMode === 'railFence' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center justify-between">
            <Label className="text-gray-700">Caesar Shift Key</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 border-blue-300 border">+{shift}</Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500" onClick={handleRandomizeShift}>
                <Shuffle size={12} />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-3 bg-blue-100 rounded-full -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full -translate-y-1/2 z-10 transition-all duration-200 shadow-md" style={{ width: `${((shift - 1) / 24) * 100}%` }}></div>
            <Slider 
              value={[shift]} 
              onValueChange={(val) => setShift(val[0])} 
              min={1} 
              max={25} 
              step={1} 
              disabled={cipherMode === 'railFence'}
              className="[&_[data-radix-slider-track]]:bg-transparent [&_[data-radix-slider-range]]:bg-transparent [&_[data-radix-slider-thumb]]:bg-blue-600 [&_[data-radix-slider-thumb]]:border-blue-700 [&_[data-radix-slider-thumb]]:w-5 [&_[data-radix-slider-thumb]]:h-5 [&_[data-radix-slider-thumb]]:shadow-lg [&_[data-radix-slider-thumb]]:z-20"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400"><span>1</span><span>25</span></div>
        </div>

        <div className={`space-y-3 transition-opacity ${cipherMode === 'caesar' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center justify-between">
            <Label className="text-gray-700">Rail Count</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700 border-purple-300 border">{rails} Rails</Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500" onClick={handleRandomizeRails}>
                <Shuffle size={12} />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-3 bg-purple-100 rounded-full -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full -translate-y-1/2 z-10 transition-all duration-200 shadow-md" style={{ width: `${((rails - 2) / 6) * 100}%` }}></div>
            <Slider 
              value={[rails]} 
              onValueChange={(val) => setRails(val[0])} 
              min={2} 
              max={8} 
              step={1} 
              disabled={cipherMode === 'caesar'}
              className="[&_[data-radix-slider-track]]:bg-transparent [&_[data-radix-slider-range]]:bg-transparent [&_[data-radix-slider-thumb]]:bg-purple-600 [&_[data-radix-slider-thumb]]:border-purple-700 [&_[data-radix-slider-thumb]]:w-5 [&_[data-radix-slider-thumb]]:h-5 [&_[data-radix-slider-thumb]]:shadow-lg [&_[data-radix-slider-thumb]]:z-20"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400"><span>2</span><span>8</span></div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Label className="text-gray-700">Animation Speed</Label>
            <Badge variant="outline" className="text-gray-600 border-gray-300">{animationSpeed}x</Badge>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-3 bg-cyan-100 rounded-full -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 h-3 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full -translate-y-1/2 z-10 transition-all duration-200 shadow-md" style={{ width: `${((animationSpeed - 0.5) / 9.5) * 100}%` }}></div>
            <Slider 
              value={[animationSpeed]} 
              onValueChange={(val) => setAnimationSpeed(val[0])} 
              min={0.5} 
              max={10} 
              step={0.5}
              className="[&_[data-radix-slider-track]]:bg-transparent [&_[data-radix-slider-range]]:bg-transparent [&_[data-radix-slider-thumb]]:bg-cyan-600 [&_[data-radix-slider-thumb]]:border-cyan-700 [&_[data-radix-slider-thumb]]:w-5 [&_[data-radix-slider-thumb]]:h-5 [&_[data-radix-slider-thumb]]:shadow-lg [&_[data-radix-slider-thumb]]:z-20"
            />
            <div className="flex justify-between text-xs text-gray-400"><span>0.5x</span><span>10x</span></div>
          </div>
        </div>

        <Button onClick={onReset} variant="destructive" className="w-full gap-2">
          <RotateCcw size={16} />
          Reset All
        </Button>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
