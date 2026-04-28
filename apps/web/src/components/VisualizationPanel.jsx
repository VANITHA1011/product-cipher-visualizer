import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import D3CaesarVisualization from '@/components/D3CaesarVisualization.jsx';
import D3RailFenceVisualization from '@/components/D3RailFenceVisualization.jsx';
import D3ProductCipherVisualization from '@/components/D3ProductCipherVisualization.jsx';

const VisualizationPanel = ({ cipherMode, cipherData, speed, plaintext, activeTab, setActiveTab }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSteps = useMemo(() => {
    if (!cipherData) return 0;
    if (cipherMode === 'caesar') return cipherData.steps?.length ?? 0;
    if (cipherMode === 'railFence') return (cipherData.writeSteps?.length ?? 0) + (cipherData.readSteps?.length ?? 0);
    if (cipherMode === 'product') return (cipherData.caesarResult?.steps?.length ?? 0) + (cipherData.railFenceResult?.writeSteps?.length ?? 0) + (cipherData.railFenceResult?.readSteps?.length ?? 0);
    return 0;
  }, [cipherData, cipherMode]);

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (cipherMode === 'railFence') setActiveTab('railFence');
    else if (cipherMode === 'product') setActiveTab('flow');
    else setActiveTab('caesar');
  }, [cipherData, cipherMode]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < totalSteps) {
      interval = setInterval(() => setCurrentStep(prev => prev + 1), 1000 / speed);
    } else if (currentStep >= totalSteps) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, totalSteps, speed]);

  if (!cipherData || !cipherData.ciphertext || cipherData.mode !== cipherMode) {
    return (
      <Card className="glass-card h-full border-0">
        <CardHeader>
          <CardTitle className="text-gray-900">Step-by-Step Visualization</CardTitle>
          <CardDescription className="text-gray-500">Enter plaintext to see the encryption process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-12"><p>No encryption data to visualize</p></div>
        </CardContent>
      </Card>
    );
  }

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentStep(prev => Math.min(totalSteps, prev + 1));

  let localCaesarStep = currentStep;
  let localRailStep = 0;
  if (cipherMode === 'product') {
    const caesarTotal = cipherData.caesarResult?.steps?.length ?? 0;
    if (currentStep > caesarTotal) { localCaesarStep = caesarTotal; localRailStep = currentStep - caesarTotal; }
  } else if (cipherMode === 'railFence') {
    localRailStep = currentStep;
  }

  return (
    <Card className="glass-card flex flex-col h-full border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900">Encryption Visualization</CardTitle>
        <CardDescription className="text-gray-500">Watch the cipher algorithm in action</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Overall Progress</span>
            <span>{Math.round((currentStep / totalSteps) * 100) || 0}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all duration-300 ease-linear" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>
        </div>

        <div className="flex-1 min-h-[300px] rounded-lg border border-white/50 p-4 overflow-hidden" style={{background: 'linear-gradient(135deg, #f8fafc, #eef2ff)'}}>
          {cipherMode === 'product' ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100">
                <TabsTrigger value="flow" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">Flow Diagram</TabsTrigger>
                <TabsTrigger value="caesar" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">1. Caesar</TabsTrigger>
                <TabsTrigger value="railFence" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">2. Rail Fence</TabsTrigger>
              </TabsList>
              <TabsContent value="flow" className="flex-1 overflow-y-auto mt-0">
                <D3ProductCipherVisualization plaintext={plaintext} caesarResult={cipherData.caesarResult} railFenceResult={cipherData.railFenceResult} currentStep={currentStep} speed={speed} />
              </TabsContent>
              <TabsContent value="caesar" className="flex-1 overflow-y-auto mt-0">
                <D3CaesarVisualization steps={cipherData.caesarResult.steps} currentStep={localCaesarStep} speed={speed} />
              </TabsContent>
              <TabsContent value="railFence" className="flex-1 overflow-y-auto mt-0">
                <D3RailFenceVisualization railPattern={cipherData.railFenceResult.railPattern} writeSteps={cipherData.railFenceResult.writeSteps} readSteps={cipherData.railFenceResult.readSteps} currentStep={localRailStep} railCount={cipherData.railFenceResult.railPattern.length} speed={speed} />
              </TabsContent>
            </Tabs>
          ) : cipherMode === 'caesar' ? (
            <D3CaesarVisualization steps={cipherData.steps ?? []} currentStep={currentStep} speed={speed} />
          ) : (
            <D3RailFenceVisualization railPattern={cipherData.railPattern ?? []} writeSteps={cipherData.writeSteps ?? []} readSteps={cipherData.readSteps ?? []} currentStep={currentStep} railCount={cipherData.railPattern?.length ?? 0} speed={speed} />
          )}
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Button variant="outline" size="icon" onClick={handleReset} className="border-gray-300 text-gray-600"><RotateCcw size={16} /></Button>
          <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentStep === 0} className="border-gray-300 text-gray-600"><SkipBack size={16} /></Button>
          <Button variant={isPlaying ? 'destructive' : 'default'} className={!isPlaying ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : ''} onClick={handlePlayPause} disabled={currentStep >= totalSteps && !isPlaying}>
            {isPlaying ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
            {isPlaying ? 'Pause' : currentStep >= totalSteps ? 'Finished' : 'Play'}
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext} disabled={currentStep >= totalSteps} className="border-gray-300 text-gray-600"><SkipForward size={16} /></Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizationPanel;
