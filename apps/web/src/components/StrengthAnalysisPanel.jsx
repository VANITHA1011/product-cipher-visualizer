import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateEntropy, getCipherStrength } from '@/lib/cipherUtils';
import { Shield, Key, Info } from 'lucide-react';

const StrengthAnalysisPanel = ({ plaintext, shift, rails, cipherMode, onShowAvalanche }) => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!plaintext) return;
    let cancelled = false;
    async function fetchAnalysis() {
      let keySpace = cipherMode === 'caesar' ? 25 : cipherMode === 'railFence' ? rails - 1 : 25 * (rails - 1);
      const [entropy, strength] = await Promise.all([
        calculateEntropy(plaintext),
        getCipherStrength(cipherMode, keySpace),
      ]);
      const chartData = [
        { name: 'Caesar', keys: 25, fill: '#eab308' },
        { name: 'Rail Fence', keys: Math.max(1, rails - 1), fill: '#a855f7' },
        { name: 'Product', keys: 25 * Math.max(1, rails - 1), fill: '#06b6d4' },
      ];
      if (!cancelled) setAnalysis({ entropy, keySpace, strength, chartData });
    }
    fetchAnalysis();
    return () => { cancelled = true; };
  }, [plaintext, shift, rails, cipherMode]);

  if (!analysis) {
    return (
      <Card className="glass-card h-full border-0">
        <CardHeader><CardTitle className="text-gray-900">Strength Analysis</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-8">
            <Shield className="mx-auto mb-2 text-gray-300" size={32} />
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const strengthColors = {
    'Very Weak': { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-300',    icon: '🔴' },
    'Weak':      { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-300', icon: '🟠' },
    'Moderate':  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', icon: '🟡' },
    'Strong':    { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-300',  icon: '🟢' },
  };
  const sc = strengthColors[analysis.strength] || strengthColors['Very Weak'];

  return (
    <Card className="glass-card h-full flex flex-col border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900">Strength Analysis</CardTitle>
        <CardDescription className="text-gray-500">Security metrics for current configuration</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">

        <div className={`flex items-center justify-between p-3 ${sc.bg} rounded-lg border ${sc.border}`}>
          <div className="flex items-center gap-2">
            <Shield className={sc.text} size={20} />
            <span className="font-medium text-gray-800">Assessment</span>
          </div>
          <Badge className={`${sc.bg} ${sc.text} ${sc.border} border`}>{sc.icon} {analysis.strength.toUpperCase()}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="text-blue-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Key Space</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{analysis.keySpace} keys</span>
          </div>
          <p className="text-xs text-gray-400">Total possible combinations an attacker must try.</p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-500">Key Space Comparison</div>
          <div className="h-32 bg-gray-50 rounded-lg p-2 border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" tick={{ fontSize: 10 }} width={60} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '12px' }} />
                <Bar dataKey="keys" radius={[0, 4, 4, 0]}>
                  {analysis.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <Info size={16} />Educational Note
          </div>
          <div className="text-xs text-gray-600 leading-relaxed">
            {cipherMode === 'caesar' && <p>The Caesar cipher is extremely weak — only 25 possible keys. An attacker can brute-force all combinations in seconds.</p>}
            {cipherMode === 'railFence' && <p>The Rail Fence cipher is weak. The number of practical keys is limited by plaintext length and only rearranges letters without hiding frequencies.</p>}
            {cipherMode === 'product' && <p>Combining substitution (Caesar) and transposition (Rail Fence) creates a Product Cipher — larger key space and disrupts both letter frequencies and positions.</p>}
          </div>
        </div>

        <Button onClick={onShowAvalanche} className="w-full gap-3 py-4 px-6 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          🎆 Show Avalanche Effect
        </Button>

      </CardContent>
    </Card>
  );
};

export default StrengthAnalysisPanel;
