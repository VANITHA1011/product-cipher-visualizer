// Audited: Strict React Hook rules enforced. No hooks present.
import React from 'react';
import { BookOpen, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/40 mt-auto" style={{background: 'rgba(241,245,249,0.8)', backdropFilter: 'blur(8px)'}}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-gray-900 font-semibold mb-3">About Product Cipher</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              An interactive educational tool for learning cryptography through visualization. 
              Explore how substitution and transposition ciphers combine to create secure encryption.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-3">Educational Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://en.wikipedia.org/wiki/Product_cipher" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <BookOpen size={14} />
                  Product Cipher Theory
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://en.wikipedia.org/wiki/Avalanche_effect" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <BookOpen size={14} />
                  Avalanche Effect
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://en.wikipedia.org/wiki/Entropy_(information_theory)" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <BookOpen size={14} />
                  Information Entropy
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-3">Credits</h3>
            <p className="text-sm text-gray-500 mb-2">
              Built with React, TailwindCSS, and Framer Motion
            </p>
            <p className="text-xs text-gray-400">
              © 2026 Product Cipher Visualizer. Educational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;