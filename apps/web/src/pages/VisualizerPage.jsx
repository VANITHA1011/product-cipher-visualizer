import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import ControlPanel from '@/components/ControlPanel.jsx';
import VisualizationPanel from '@/components/VisualizationPanel.jsx';
import StrengthAnalysisPanel from '@/components/StrengthAnalysisPanel.jsx';
import D3AvalancheVisualization from '@/components/D3AvalancheVisualization.jsx';
import FinalOutput from '@/components/FinalOutput.jsx';
import StepAnimation from '@/components/StepAnimation.jsx';
import { caesarCipher, railFenceCipher, productCipher, compareTexts } from '@/lib/cipherUtils';

const VisualizerPage = () => {
  const [plaintext, setPlaintext] = useState('CRYPTOGRAPHY');
  const [shift, setShift] = useState(3);
  const [rails, setRails] = useState(3);
  const [cipherMode, setCipherMode] = useState('product');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [cipherData, setCipherData] = useState(null);
  const [avalancheData, setAvalancheData] = useState(null);
  const [animRunning, setAnimRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('flow');
  const [showAvalanche, setShowAvalanche] = useState(false);

  useEffect(() => {
    if (!plaintext) return;
    let cancelled = false;

    async function fetchCipher() {
      let data;
      if (cipherMode === 'caesar') {
        data = { mode: 'caesar', ...(await caesarCipher(plaintext, shift)) };
      } else if (cipherMode === 'railFence') {
        data = { mode: 'railFence', ...(await railFenceCipher(plaintext, rails)) };
      } else {
        data = { mode: 'product', ...(await productCipher(plaintext, shift, rails)) };
      }
      if (!cancelled) setCipherData(data);
    }

    fetchCipher();
    return () => { cancelled = true; };
  }, [plaintext, shift, rails, cipherMode]);

  useEffect(() => {
    if (!plaintext) return;
    let cancelled = false;

    async function fetchAvalanche() {
      const modified = plaintext.substring(0, plaintext.length - 1) +
        String.fromCharCode((plaintext.charCodeAt(plaintext.length - 1) + 1) % 256);

      let originalCipher, modifiedCipher;
      if (cipherMode === 'caesar') {
        originalCipher = (await caesarCipher(plaintext, shift)).ciphertext;
        modifiedCipher = (await caesarCipher(modified, shift)).ciphertext;
      } else if (cipherMode === 'railFence') {
        originalCipher = (await railFenceCipher(plaintext, rails)).ciphertext;
        modifiedCipher = (await railFenceCipher(modified, rails)).ciphertext;
      } else {
        originalCipher = (await productCipher(plaintext, shift, rails)).ciphertext;
        modifiedCipher = (await productCipher(modified, shift, rails)).ciphertext;
      }

      const comparison = await compareTexts(originalCipher, modifiedCipher);
      if (!cancelled) setAvalancheData({ originalCipher, modifiedCipher, ...comparison });
    }

    fetchAvalanche();
    return () => { cancelled = true; };
  }, [plaintext, shift, rails, cipherMode]);

  // reset tab when mode or input changes
  useEffect(() => {
    if (cipherMode === 'railFence') setActiveTab('railFence');
    else if (cipherMode === 'product') setActiveTab('flow');
    else setActiveTab('caesar');
    setAnimRunning(false);
  }, [cipherMode, plaintext]);

  const handleReset = () => {
    setPlaintext('CRYPTOGRAPHY');
    setShift(3);
    setRails(3);
    setCipherMode('product');
    setAnimationSpeed(1);
    setAnimRunning(false);
    setActiveTab('flow');
  };

  const handleShowAvalanche = () => {
    setShowAvalanche(true);
  };

  return (
    <>
      <Helmet>
        <title>{`Product Cipher Visualizer - ${cipherMode.toUpperCase()}`}</title>
        <meta name="description" content="Interactive product cipher encryption visualizer with D3.js animations." />
      </Helmet>

      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Cipher Visualizer
            </h1>
            <p className="text-lg text-gray-500">
              Interactive demonstration of Caesar and Rail Fence ciphers
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <ControlPanel
                plaintext={plaintext}
                setPlaintext={setPlaintext}
                shift={shift}
                setShift={setShift}
                rails={rails}
                setRails={setRails}
                cipherMode={cipherMode}
                setCipherMode={setCipherMode}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
                onReset={handleReset}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6"
            >
              <VisualizationPanel
                cipherMode={cipherMode}
                cipherData={cipherData}
                speed={animationSpeed}
                plaintext={plaintext}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <StrengthAnalysisPanel
                plaintext={plaintext}
                shift={shift}
                rails={rails}
                cipherMode={cipherMode}
                onShowAvalanche={handleShowAvalanche}
              />
            </motion.div>
          </div>

          {showAvalanche && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 glass-card p-6 border-0"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Avalanche Effect Analysis</h2>
              {avalancheData && (
                <D3AvalancheVisualization
                  text1={avalancheData.originalCipher}
                  text2={avalancheData.modifiedCipher}
                  differences={avalancheData.differences}
                  percentage={avalancheData.percentage}
                  diffPositions={avalancheData.diffPositions}
                />
              )}
            </motion.div>
          )}

          <FinalOutput text={cipherData?.cipher_text} mode={cipherMode} />

          <div className="mt-4 text-center">
            <button
              onClick={() => { setAnimRunning(false); setTimeout(() => setAnimRunning(true), 50); }}
              disabled={!cipherData}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors"
            >
              ▶ Visualize Step-by-Step
            </button>
          </div>

          <StepAnimation
            plaintext={plaintext}
            cipherData={cipherData}
            cipherMode={cipherMode}
            running={animRunning}
            onFinished={() => setActiveTab('flow')}
          />
        </div>
      </div>
    </>
  );
};

export default VisualizerPage;
