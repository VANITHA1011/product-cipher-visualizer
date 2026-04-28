import { useState, useEffect } from 'react';

const STEP_DELAY = 1500;

const StepAnimation = ({ plaintext, cipherData, cipherMode, running, onFinished }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [steps, setSteps] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // Build steps from Flask API response
  useEffect(() => {
    if (!cipherData || !plaintext) { setSteps([]); setCurrentStep(-1); setIsFinished(false); return; }
    setIsFinished(false);
    setCurrentStep(-1);

    const built = [];
    if (cipherMode === 'caesar') {
      built.push({ label: 'Plaintext', value: plaintext.toUpperCase(), color: 'text-white', bg: 'border-gray-600' });
      built.push({ label: 'Caesar Output', value: cipherData.ciphertext?.toUpperCase(), color: 'text-yellow-400', bg: 'border-yellow-600' });
    } else if (cipherMode === 'railFence') {
      built.push({ label: 'Plaintext', value: plaintext.toUpperCase(), color: 'text-white', bg: 'border-gray-600' });
      built.push({ label: 'Rail Fence Output', value: cipherData.ciphertext?.toUpperCase(), color: 'text-purple-400', bg: 'border-purple-600' });
    } else {
      built.push({ label: 'Plaintext', value: plaintext.toUpperCase(), color: 'text-white', bg: 'border-gray-600' });
      built.push({ label: 'Caesar Output', value: cipherData.caesarResult?.ciphertext?.toUpperCase(), color: 'text-yellow-400', bg: 'border-yellow-600' });
      built.push({ label: 'Rail Fence Output (Final)', value: cipherData.railFenceResult?.ciphertext?.toUpperCase(), color: 'text-purple-400', bg: 'border-purple-600' });
    }
    setSteps(built);
  }, [cipherData, plaintext, cipherMode]);

  // Run animation
  useEffect(() => {
    if (!running || steps.length === 0) return;
    setIsFinished(false);
    setCurrentStep(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i < steps.length) {
        setCurrentStep(i);
      } else {
        clearInterval(id);
        setIsFinished(true);
        if (onFinished) onFinished(); // ← auto-switch tab in parent
      }
    }, STEP_DELAY);
    return () => clearInterval(id);
  }, [running, steps]);

  if (!running || steps.length === 0 || currentStep < 0) return null;

  const finalStep = steps[steps.length - 1];

  return (
    <div className="mt-4 rounded-xl bg-gray-900 border border-gray-700 p-6">

      {/* DURING ANIMATION — show current step only */}
      {!isFinished && (
        <>
          <p className="text-center text-gray-400 text-xs uppercase tracking-widest mb-6 font-semibold">
            Step {currentStep + 1} of {steps.length}
          </p>
          <div className="flex flex-col items-center gap-3">
            {steps.slice(0, currentStep + 1).map((step, idx) => (
              <div key={idx} className="flex flex-col items-center w-full gap-1">
                <span className="text-gray-500 text-xs uppercase tracking-widest">{step.label}</span>
                <div className={`bg-gray-800 rounded-lg px-6 py-3 w-full text-center border ${step.bg}`}>
                  <span className={`font-mono text-2xl font-bold tracking-widest ${step.color}`}>
                    {step.value}
                  </span>
                </div>
                {idx < currentStep && <span className="text-gray-600 text-xl">↓</span>}
              </div>
            ))}
          </div>
          {/* progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i <= currentStep ? 'bg-cyan-400' : 'bg-gray-700'}`} />
            ))}
          </div>
        </>
      )}

      {/* AFTER ANIMATION — auto show full flow diagram */}
      {isFinished && (
        <>
          <p className="text-center text-gray-400 text-xs uppercase tracking-widest mb-6 font-semibold">
            Full Encryption Flow
          </p>
          <div className="flex flex-col items-center gap-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center w-full gap-1">
                <span className="text-gray-500 text-xs uppercase tracking-widest">{step.label}</span>
                <div className={`bg-gray-800 rounded-lg px-6 py-3 w-full text-center border ${step.bg}`}>
                  <span className={`font-mono text-2xl font-bold tracking-widest ${step.color}`}>
                    {step.value}
                  </span>
                </div>
                {idx < steps.length - 1 && <span className="text-gray-600 text-xl">↓</span>}
              </div>
            ))}
          </div>

          {/* Final cipher text box */}
          <div className="mt-6 rounded-xl border-2 border-green-500 bg-gray-950 p-5 text-center">
            <p className="text-green-400 text-xs uppercase tracking-widest font-semibold mb-2">
              ✅ Final Cipher Text
            </p>
            <p className="text-green-300 font-mono text-4xl font-bold tracking-widest break-all">
              {finalStep?.value}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default StepAnimation;
