import { motion } from 'framer-motion';
import { Paintbrush, Upload, Sparkles, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Paintbrush,
    title: 'Design Your Certificate',
    description: 'Use our intuitive drag-and-drop editor to create stunning certificate designs. Add text, images, shapes, and dynamic placeholders.',
  },
  {
    number: '02',
    icon: Upload,
    title: 'Upload Recipient Data',
    description: 'Import your recipient list via CSV, Excel, or Google Sheets. Map spreadsheet columns to your certificate placeholders.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Generate Certificates',
    description: 'Click generate and watch as your certificates are created in real-time. Each certificate is personalized with recipient data.',
  },
  {
    number: '04',
    icon: Download,
    title: 'Download & Distribute',
    description: 'Download all certificates as a ZIP file with automatic naming. Export as PDF, PNG, or JPG in high quality.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 gradient-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Generate professional certificates in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Number badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white z-10">
                  {step.number}
                </div>

                {/* Icon container */}
                <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative">
                  <step.icon className="w-10 h-10 text-primary" />
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
