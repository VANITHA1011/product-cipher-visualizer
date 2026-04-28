// Audited: Strict React Hook rules enforced. Hooks called at top level.
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const TranspositionVisualization = ({ railPattern, writeSteps, readSteps, currentStep, railCount, speed = 1 }) => {
  if (!railPattern || railPattern.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No data to display</div>;
  }

  const totalWriteSteps = writeSteps.length;
  const totalReadSteps = readSteps.length;
  const totalSteps = totalWriteSteps + totalReadSteps;
  
  const isWriting = currentStep < totalWriteSteps;
  const displayStep = Math.min(currentStep, totalSteps);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-magenta-400">Rail Fence Cipher (Transposition)</div>
        <div className="flex gap-2">
          <Badge variant={isWriting ? "default" : "outline"} className={isWriting ? "bg-cyan-600" : ""}>
            Phase 1: Write
          </Badge>
          <Badge variant={!isWriting && currentStep > 0 ? "default" : "outline"} className={!isWriting && currentStep > 0 ? "bg-green-600" : ""}>
            Phase 2: Read
          </Badge>
          <Badge variant="outline" className="text-xs ml-2">
            Step {displayStep} of {totalSteps}
          </Badge>
        </div>
      </div>

      <div className="relative py-4 overflow-x-auto">
        <div className="min-w-max space-y-2">
          {railPattern.map((row, rIndex) => (
            <div key={`rail-${rIndex}`} className="flex items-center gap-1">
              <div className="w-6 text-xs text-muted-foreground font-mono">R{rIndex}</div>
              <div className="flex gap-1 relative">
                {/* Rail line background */}
                <div className="absolute inset-0 top-1/2 h-[1px] bg-gray-800 -z-10"></div>
                
                {row.map((char, cIndex) => {
                  // Determine if this character should be visible based on current step
                  const writeStepIndex = writeSteps.findIndex(s => s.originalPos === cIndex);
                  const isWritten = writeStepIndex !== -1 && writeStepIndex < currentStep;
                  
                  const readStepIndex = readSteps.findIndex(s => s.originalPos === cIndex && s.rail === rIndex);
                  const isRead = !isWriting && readStepIndex !== -1 && (readStepIndex + totalWriteSteps) < currentStep;
                  const isCurrentlyReading = !isWriting && readStepIndex !== -1 && (readStepIndex + totalWriteSteps) === currentStep;
                  
                  if (char === null) {
                    return <div key={`empty-${rIndex}-${cIndex}`} className="w-8 h-8"></div>;
                  }

                  return (
                    <motion.div
                      key={`char-${rIndex}-${cIndex}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: isWritten ? 1 : 0,
                        scale: isWritten ? 1 : 0,
                        y: isCurrentlyReading ? -5 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-mono text-sm font-bold border z-10 ${
                        isCurrentlyReading ? 'bg-green-500 text-white border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' :
                        isRead ? 'bg-green-950/50 text-green-400 border-green-800' :
                        'bg-magenta-950/50 text-magenta-400 border-magenta-800'
                      }`}
                    >
                      {char}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Result Preview */}
      <div className="mt-6 space-y-2">
        <div className="text-xs text-muted-foreground">Resulting Ciphertext:</div>
        <div className="p-3 bg-gray-900 border border-gray-800 rounded font-mono text-sm text-white break-all min-h-[46px]">
          {!isWriting && readSteps.slice(0, currentStep - totalWriteSteps).map(s => s.char).join('')}
          {isWriting && <span className="text-gray-600 italic">Waiting for read phase...</span>}
        </div>
      </div>
    </div>
  );
};

export default TranspositionVisualization;