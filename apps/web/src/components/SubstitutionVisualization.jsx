// Audited: Strict React Hook rules enforced. Hooks called at top level.
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const SubstitutionVisualization = ({ steps, currentStep, speed = 1 }) => {
  if (!steps || steps.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No data to display</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-cyan-400">Caesar Cipher (Substitution)</div>
        <Badge variant="outline" className="text-xs">
          Step {Math.min(currentStep, steps.length)} of {steps.length}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {steps.map((step, index) => {
          const isProcessed = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <motion.div
              key={`char-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col items-center p-2 rounded-lg border ${
                isCurrent ? 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 
                isProcessed ? 'border-blue-500/30 bg-blue-950/20' : 
                'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="text-xs text-muted-foreground mb-1">{index}</div>
              
              <div className={`w-10 h-10 flex items-center justify-center rounded font-mono text-lg font-bold ${
                isProcessed || isCurrent ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                {isProcessed ? step.resultChar : step.originalChar}
              </div>
              
              {isCurrent && step.isAlphabetic && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-6 text-xs font-bold text-green-400 whitespace-nowrap"
                >
                  +{step.shiftAmount}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 text-xs text-muted-foreground pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-cyan-500/20 border border-cyan-500/50"></div>
          <span>Original</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></div>
          <span>Shifted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-cyan-400 bg-cyan-950/50"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

export default SubstitutionVisualization;