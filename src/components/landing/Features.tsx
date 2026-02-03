import { motion } from 'framer-motion';
import { 
  Palette, 
  FileSpreadsheet, 
  Zap, 
  Download, 
  Layout, 
  Type,
  Image,
  Layers,
  QrCode,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Drag & Drop Editor',
    description: 'Intuitive Canva-like interface to design beautiful certificates with ease.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Type,
    title: 'Dynamic Placeholders',
    description: 'Insert {{Name}}, {{Date}}, and custom fields that auto-fill from your data.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: FileSpreadsheet,
    title: 'CSV/Excel Import',
    description: 'Upload recipient data via spreadsheet and map columns to placeholders.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Zap,
    title: 'Bulk Generation',
    description: 'Generate hundreds of personalized certificates in seconds.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Download,
    title: 'ZIP Export',
    description: 'Download all certificates as PDF/PNG with automatic file naming.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Layout,
    title: 'Templates Library',
    description: 'Choose from pre-designed templates or create your own from scratch.',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    icon: Image,
    title: 'Asset Management',
    description: 'Upload logos, signatures, and images to use across your certificates.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Layers,
    title: 'Layer Control',
    description: 'Arrange elements with precision using layer management tools.',
    color: 'from-fuchsia-500 to-purple-600',
  },
  {
    icon: QrCode,
    title: 'QR Verification',
    description: 'Add unique QR codes for certificate authenticity verification.',
    color: 'from-green-500 to-emerald-600',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to{' '}
            <span className="text-gradient">Create & Distribute</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete certificate solution for organizations, educators, and event managers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-medium h-full">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
