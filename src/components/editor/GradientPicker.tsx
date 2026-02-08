import React from 'react';
import { cn } from '@/lib/utils';

interface GradientPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const GRADIENT_PRESETS = [
  // Warm
  { name: 'Sunset', colors: ['#f97316', '#ef4444'], css: 'linear-gradient(135deg, #f97316, #ef4444)' },
  { name: 'Peach', colors: ['#f59e0b', '#ec4899'], css: 'linear-gradient(135deg, #f59e0b, #ec4899)' },
  { name: 'Rose Gold', colors: ['#e11d48', '#f59e0b'], css: 'linear-gradient(135deg, #e11d48, #f59e0b)' },
  // Cool
  { name: 'Ocean', colors: ['#0ea5e9', '#6366f1'], css: 'linear-gradient(135deg, #0ea5e9, #6366f1)' },
  { name: 'Aurora', colors: ['#06b6d4', '#8b5cf6'], css: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' },
  { name: 'Mint', colors: ['#10b981', '#06b6d4'], css: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  // Dark
  { name: 'Midnight', colors: ['#1e293b', '#6366f1'], css: 'linear-gradient(135deg, #1e293b, #6366f1)' },
  { name: 'Deep Space', colors: ['#0f172a', '#7c3aed'], css: 'linear-gradient(135deg, #0f172a, #7c3aed)' },
  { name: 'Charcoal', colors: ['#1e293b', '#334155'], css: 'linear-gradient(135deg, #1e293b, #334155)' },
  // Light
  { name: 'Cream', colors: ['#fef3c7', '#fde68a'], css: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
  { name: 'Lavender', colors: ['#ede9fe', '#c4b5fd'], css: 'linear-gradient(135deg, #ede9fe, #c4b5fd)' },
  { name: 'Sky', colors: ['#e0f2fe', '#bae6fd'], css: 'linear-gradient(135deg, #e0f2fe, #bae6fd)' },
  // Premium
  { name: 'Gold', colors: ['#c9a227', '#f0d78c'], css: 'linear-gradient(135deg, #c9a227, #f0d78c)' },
  { name: 'Royal', colors: ['#4c1d95', '#7c3aed'], css: 'linear-gradient(135deg, #4c1d95, #7c3aed)' },
  { name: 'Emerald', colors: ['#065f46', '#10b981'], css: 'linear-gradient(135deg, #065f46, #10b981)' },
];

const SOLID_COLORS = [
  '#000000', '#ffffff', '#1e293b', '#475569', '#94a3b8',
  '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#c9a227',
];

export function GradientPicker({ value, onChange, label }: GradientPickerProps) {
  return (
    <div className="space-y-2">
      {label && (
        <p className="text-[10px] text-editor-sidebar-muted font-medium uppercase tracking-wider">{label}</p>
      )}
      
      {/* Solid colors */}
      <div>
        <p className="text-[10px] text-editor-sidebar-muted mb-1">Solid</p>
        <div className="flex gap-1 flex-wrap">
          {SOLID_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className={cn(
                "w-6 h-6 rounded border transition-transform hover:scale-110",
                color === '#ffffff' ? 'border-gray-300' : 'border-white/20',
                value === color && 'ring-2 ring-primary ring-offset-1 ring-offset-background'
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Gradient presets */}
      <div>
        <p className="text-[10px] text-editor-sidebar-muted mb-1">Gradients</p>
        <div className="grid grid-cols-5 gap-1">
          {GRADIENT_PRESETS.map((gradient) => (
            <button
              key={gradient.name}
              onClick={() => onChange(gradient.colors[0])}
              className={cn(
                "w-full aspect-square rounded border border-white/20 transition-transform hover:scale-110"
              )}
              style={{ background: gradient.css }}
              title={gradient.name}
            />
          ))}
        </div>
      </div>

      {/* Custom color picker */}
      <div className="flex gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 rounded cursor-pointer bg-transparent border border-white/10"
        />
        <input
          type="text"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-8 rounded-md bg-white/5 border border-white/10 text-editor-sidebar-foreground text-sm font-mono px-2"
        />
      </div>
    </div>
  );
}

export { GRADIENT_PRESETS, SOLID_COLORS };
