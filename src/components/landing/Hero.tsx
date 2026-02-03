import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-dark" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">The #1 Certificate Generator</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Design & Generate{' '}
            <span className="text-gradient">Certificates</span>{' '}
            in Seconds
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto"
          >
            Create stunning certificates with our Canva-like editor. 
            Upload recipient data, and generate hundreds of personalized certificates with one click.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/editor">
              <Button size="lg" className="gradient-primary text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-glow hover:shadow-strong transition-all duration-300 group">
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-600 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl"
            >
              View Templates
            </Button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {[
              { icon: Zap, text: 'Instant Generation' },
              { icon: Download, text: 'ZIP Export' },
              { icon: Sparkles, text: 'Beautiful Templates' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
              >
                <item.icon className="w-4 h-4 text-accent" />
                <span className="text-sm text-gray-300">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 max-w-6xl mx-auto"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 gradient-primary rounded-2xl opacity-20 blur-2xl" />
            
            {/* Editor preview mock */}
            <div className="relative bg-editor-sidebar rounded-2xl border border-white/10 overflow-hidden shadow-strong">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-400">CertiMaster Editor</span>
                </div>
              </div>
              <div className="flex h-[400px]">
                {/* Sidebar mock */}
                <div className="w-16 border-r border-white/10 flex flex-col items-center py-4 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-lg bg-white/5" />
                  ))}
                </div>
                {/* Canvas area mock */}
                <div className="flex-1 bg-editor-canvas-bg flex items-center justify-center p-8">
                  <div className="w-full max-w-2xl aspect-[1.4/1] bg-white rounded-lg shadow-strong flex flex-col items-center justify-center p-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4" />
                    <div className="text-2xl font-display text-gray-800 mb-2">Certificate of Achievement</div>
                    <div className="text-gray-500 mb-4">This is to certify that</div>
                    <div className="text-3xl font-dancing text-primary mb-2">{"{{Name}}"}</div>
                    <div className="text-gray-500">has successfully completed</div>
                    <div className="text-lg font-semibold text-gray-700 mt-2">{"{{Course_Name}}"}</div>
                  </div>
                </div>
                {/* Properties panel mock */}
                <div className="w-64 border-l border-white/10 p-4">
                  <div className="space-y-4">
                    <div className="h-4 w-20 bg-white/10 rounded" />
                    <div className="h-10 bg-white/5 rounded" />
                    <div className="h-10 bg-white/5 rounded" />
                    <div className="h-4 w-16 bg-white/10 rounded mt-6" />
                    <div className="h-10 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
