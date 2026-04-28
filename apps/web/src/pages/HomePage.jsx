import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Eye, Zap, Shield, Sliders, BookOpen, Sparkles } from 'lucide-react';
import cybersecurityBg from '@/assets/cybersecurity-bg.jpg';

const HomePage = () => {
  const features = [
    { icon: Eye, title: 'Step-by-Step Visualization', description: 'Watch each encryption round unfold with detailed character-by-character animations showing substitution and transposition steps.' },
    { icon: Zap, title: 'Avalanche Effect', description: 'See how changing a single character in plaintext dramatically alters the entire ciphertext, demonstrating cryptographic strength.' },
    { icon: Shield, title: 'Strength Analysis', description: 'Real-time security metrics including entropy calculations, key space analysis, and cipher strength ratings.' },
    { icon: Sliders, title: 'Interactive Controls', description: 'Customize encryption parameters including rounds, substitution keys, transposition patterns, and animation speed.' },
    { icon: BookOpen, title: 'Educational Explanations', description: 'Learn cryptography concepts with clear explanations at each step, perfect for students and enthusiasts.' },
    { icon: Sparkles, title: 'Beautiful UI', description: 'Modern light theme with smooth animations, color-coded visualizations, and responsive design for all devices.' },
  ];

  return (
    <>
      <Helmet>
        <title>Product Cipher Visualizer - Learn Cryptography Through Interactive Visualization</title>
        <meta name="description" content="An interactive educational tool for learning cryptography." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden" style={{
          backgroundImage: `url(${cybersecurityBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                Product Cipher Visualizer
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto drop-shadow-lg">
                Learn Cryptography Through Interactive Visualization
              </p>
              <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white text-lg px-8 py-6 gap-2">
                <Link to="/visualizer">
                  Start Learning
                  <ArrowRight size={20} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="core-features" className="py-20" style={{background: 'transparent'}}>
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Core Features</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Everything you need to understand and visualize product cipher encryption
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <Card className="glass-card hover:shadow-lg hover:border-cyan-300 transition-all duration-300 h-full border-0">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center mb-4">
                        <feature.icon className="text-cyan-600" size={24} />
                      </div>
                      <CardTitle className="text-gray-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-500 leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to Explore?</h2>
              <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
                Start visualizing cryptographic concepts and deepen your understanding of encryption algorithms
              </p>
              <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white text-lg px-8 py-6 gap-2">
                <Link to="/visualizer">
                  Launch Visualizer
                  <ArrowRight size={20} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
