// Audited: Strict React Hook rules enforced. Hooks called at top level.
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { caesarCipher, railFenceCipher, productCipher, compareTexts } from '@/lib/cipherUtils';
import { AlertCircle } from 'lucide-react';

const AvalancheEffect = ({ plaintext, shift, rails, cipherMode }) => {
  // Hook called at the top level
  const avalancheData = useMemo(() => {
    if (!plaintext || plaintext.length < 2) {
      return null;
    }

    // Create modified version (change middle character)
    const midIndex = Math.floor(plaintext.length / 2);
    const originalChar = plaintext[midIndex];
    // Change to next letter, wrap around if Z
    const newChar = originalChar === 'Z' ? 'A' : String.fromCharCode(originalChar.charCodeAt(0) + 1);
    
    const modifiedPlaintext = 
      plaintext.substring(0, midIndex) + 
      newChar + 
      plaintext.substring(midIndex + 1);

    // Helper to encrypt based on mode
    const encrypt = (text) => {
      if (cipherMode === 'caesar') return caesarCipher(text, shift).ciphertext;
      if (cipherMode === 'railFence') return railFenceCipher(text, rails).ciphertext;
      return productCipher(text, shift, rails).ciphertext;
    };

    const originalCiphertext = encrypt(plaintext);
    const modifiedCiphertext = encrypt(modifiedPlaintext);

    // Compare
    const comparison = compareTexts(originalCiphertext, modifiedCiphertext);

    return {
      originalPlaintext: plaintext,
      modifiedPlaintext,
      originalCiphertext,
      modifiedCiphertext,
      comparison,
      changedPosition: midIndex
    };
  }, [plaintext, shift, rails, cipherMode]);

  // Early return AFTER hooks
  if (!avalancheData) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Avalanche Effect</CardTitle>
          <CardDescription>Enter at least 2 characters to see the avalanche effect</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <AlertCircle className="mx-auto mb-2" size={32} />
            <p>Not enough data to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Avalanche Effect Demonstration</CardTitle>
        <CardDescription>
          Observe how changing a single character in the plaintext affects the ciphertext.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500">Original</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Plaintext</div>
              <div className="p-3 bg-gray-950 border border-gray-800 rounded font-mono text-sm text-gray-300 break-all">
                {avalancheData.originalPlaintext.split('').map((char, i) => (
                  <span key={i} className={i === avalancheData.changedPosition ? 'text-green-400 font-bold bg-green-900/30 px-0.5 rounded' : ''}>
                    {char}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Ciphertext</div>
              <div className="p-3 bg-gray-950 border border-gray-800 rounded font-mono text-sm text-gray-300 break-all">
                {avalancheData.originalCiphertext.split('').map((char, i) => (
                  <span key={i} className={avalancheData.comparison.diffPositions.includes(i) ? 'text-red-400 font-bold bg-red-900/30 px-0.5 rounded' : ''}>
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Modified */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">Modified (1 char changed)</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Plaintext</div>
              <div className="p-3 bg-gray-950 border border-gray-800 rounded font-mono text-sm text-gray-300 break-all">
                {avalancheData.modifiedPlaintext.split('').map((char, i) => (
                  <span key={i} className={i === avalancheData.changedPosition ? 'text-blue-400 font-bold bg-blue-900/30 px-0.5 rounded' : ''}>
                    {char}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Ciphertext</div>
              <div className="p-3 bg-gray-950 border border-gray-800 rounded font-mono text-sm text-gray-300 break-all">
                {avalancheData.modifiedCiphertext.split('').map((char, i) => (
                  <span key={i} className={avalancheData.comparison.diffPositions.includes(i) ? 'text-red-400 font-bold bg-red-900/30 px-0.5 rounded' : ''}>
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex gap-8">
            <div>
              <div className="text-sm text-muted-foreground">Characters Changed</div>
              <div className="text-2xl font-bold text-red-400">
                {avalancheData.comparison.differences} <span className="text-sm font-normal text-gray-500">/ {avalancheData.originalCiphertext.length}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Difference</div>
              <div className="text-2xl font-bold text-red-400">
                {avalancheData.comparison.percentage}%
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 max-w-md text-right">
            {cipherMode === 'caesar' && "Caesar cipher has NO avalanche effect. Changing 1 letter only changes 1 letter in the output."}
            {cipherMode === 'railFence' && "Rail Fence cipher has minimal avalanche effect. Changing 1 letter only changes that same letter's value in the output, though its position was already shifted."}
            {cipherMode === 'product' && "Simple product ciphers still struggle with the avalanche effect compared to modern algorithms like AES, which aim for ~50% difference."}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default AvalancheEffect;