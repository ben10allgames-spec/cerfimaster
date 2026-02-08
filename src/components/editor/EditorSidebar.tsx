import React, { useCallback, useState } from 'react';
import { 
  Type, 
  Square, 
  Circle, 
  Image, 
  Minus, 
  Star, 
  Triangle,
  LayoutTemplate,
  Shapes,
  Upload,
  GraduationCap,
  Award,
  Trophy,
  Briefcase,
  Heart,
  Plus,
  ChevronRight,
  Palette,
  Building2
} from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PRESET_TEMPLATES, TEMPLATE_CATEGORIES, PresetTemplate, TemplateCategory } from '@/data/certificateTemplates';
import { CertificateTemplate } from '@/types/certificate';
import { v4 as uuidv4 } from 'uuid';

export function EditorSidebar() {
  const { addElement, template, setTemplate, updateTemplate } = useEditor();
  const [activeTab, setActiveTab] = useState('elements');

  const handleAddText = useCallback(() => {
    addElement({
      type: 'text',
      x: template.width / 2 - 100,
      y: template.height / 2 - 20,
      text: 'Double click to edit',
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 'normal',
      fill: '#000000',
      textAlign: 'center',
    });
  }, [addElement, template]);

  const handleAddHeading = useCallback(() => {
    addElement({
      type: 'text',
      x: template.width / 2 - 150,
      y: template.height / 2 - 30,
      text: 'HEADING',
      fontFamily: 'Playfair Display',
      fontSize: 48,
      fontWeight: 'bold',
      fill: '#1e293b',
      textAlign: 'center',
      letterSpacing: 4,
    });
  }, [addElement, template]);

  const handleAddSubheading = useCallback(() => {
    addElement({
      type: 'text',
      x: template.width / 2 - 100,
      y: template.height / 2 - 15,
      text: 'Subheading Text',
      fontFamily: 'Montserrat',
      fontSize: 20,
      fontWeight: 'normal',
      fill: '#64748b',
      textAlign: 'center',
    });
  }, [addElement, template]);

  const handleAddBodyText = useCallback(() => {
    addElement({
      type: 'text',
      x: template.width / 2 - 150,
      y: template.height / 2 - 10,
      text: 'This is body text. Click to edit.',
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 'normal',
      fill: '#374151',
      textAlign: 'left',
    });
  }, [addElement, template]);

  const handleAddPlaceholder = useCallback((placeholderKey: string) => {
    addElement({
      type: 'placeholder',
      x: template.width / 2 - 80,
      y: template.height / 2 - 20,
      text: `{{${placeholderKey}}}`,
      placeholderKey,
      fontFamily: 'Inter',
      fontSize: 28,
      fontWeight: 'bold',
      fill: '#6366f1',
      textAlign: 'center',
    });
  }, [addElement, template]);

  const handleAddShape = useCallback((shapeType: 'rectangle' | 'circle' | 'triangle') => {
    const baseProps = {
      type: 'shape' as const,
      x: template.width / 2 - 50,
      y: template.height / 2 - 50,
      width: 100,
      height: 100,
      shapeType,
      fill: '#e2e8f0',
      stroke: '#94a3b8',
      strokeWidth: 2,
    };
    addElement(baseProps);
  }, [addElement, template]);

  const handleAddDecoShape = useCallback((fill: string, size: { width: number; height: number }) => {
    addElement({
      type: 'shape',
      x: template.width / 2 - size.width / 2,
      y: template.height / 2 - size.height / 2,
      width: size.width,
      height: size.height,
      shapeType: 'rectangle',
      fill,
      stroke: 'transparent',
      strokeWidth: 0,
    });
  }, [addElement, template]);

  const handleAddLine = useCallback((style?: 'thin' | 'thick' | 'decorative') => {
    const strokeWidth = style === 'thick' ? 4 : style === 'decorative' ? 2 : 1;
    const width = style === 'decorative' ? 400 : 200;
    const fill = style === 'decorative' ? '#c9a227' : '#000000';
    
    addElement({
      type: 'line',
      x: template.width / 2 - width / 2,
      y: template.height / 2,
      width,
      height: 2,
      fill,
      strokeWidth,
    });
  }, [addElement, template]);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new window.Image();
          img.onload = () => {
            const maxWidth = 200;
            const scale = maxWidth / img.width;
            addElement({
              type: 'image',
              x: template.width / 2 - (img.width * scale) / 2,
              y: template.height / 2 - (img.height * scale) / 2,
              width: img.width * scale,
              height: img.height * scale,
              src: event.target?.result as string,
            });
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [addElement, template]);

  const handleApplyTemplate = useCallback((preset: PresetTemplate) => {
    const newTemplate: CertificateTemplate = {
      ...preset.template,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTemplate(newTemplate);
  }, [setTemplate]);

  const [customPlaceholderKey, setCustomPlaceholderKey] = useState('');

  const placeholders = [
    { key: 'Name', label: 'Recipient Name', icon: '👤' },
    { key: 'Course_Name', label: 'Course/Event Name', icon: '📚' },
    { key: 'Date', label: 'Date (Auto)', icon: '📅' },
    { key: 'Organization_Name', label: 'Organization', icon: '🏢' },
    { key: 'Certificate_ID', label: 'Certificate ID (Auto)', icon: '🔢' },
    { key: 'Email', label: 'Email Address', icon: '📧' },
    { key: 'Title', label: 'Title/Position', icon: '🎖️' },
    { key: 'Description', label: 'Description', icon: '📝' },
  ];

  const handleAddCustomPlaceholder = useCallback(() => {
    if (!customPlaceholderKey.trim()) return;
    const key = customPlaceholderKey.trim().replace(/\s+/g, '_');
    handleAddPlaceholder(key);
    setCustomPlaceholderKey('');
  }, [customPlaceholderKey, handleAddPlaceholder]);

  const categoryIcons: Record<string, React.ElementType> = {
    professional: Building2,
    completion: GraduationCap,
    participation: Award,
    achievement: Trophy,
    internship: Briefcase,
    appreciation: Heart,
  };

  const colorPalettes = [
    { name: 'Professional', colors: ['#1e293b', '#334155', '#64748b', '#94a3b8', '#e2e8f0'] },
    { name: 'Gold Accent', colors: ['#c9a227', '#d4af37', '#f0d78c', '#1e3a5f', '#ffffff'] },
    { name: 'Modern Blue', colors: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#0f172a', '#ffffff'] },
    { name: 'Royal Purple', colors: ['#6366f1', '#818cf8', '#a5b4fc', '#1e1b4b', '#ffffff'] },
    { name: 'Warm Earth', colors: ['#d97706', '#f59e0b', '#fcd34d', '#292524', '#fef7f0'] },
    { name: 'Rose Gold', colors: ['#e11d48', '#fb7185', '#fecdd3', '#1c1917', '#fff1f2'] },
    { name: 'Forest', colors: ['#065f46', '#059669', '#34d399', '#022c22', '#f0fdf4'] },
  ];

  const gradientPalettes = [
    { name: 'Sunset', colors: ['#f97316', '#ef4444'], css: 'linear-gradient(135deg, #f97316, #ef4444)' },
    { name: 'Ocean', colors: ['#0ea5e9', '#6366f1'], css: 'linear-gradient(135deg, #0ea5e9, #6366f1)' },
    { name: 'Aurora', colors: ['#06b6d4', '#8b5cf6'], css: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' },
    { name: 'Peach', colors: ['#f59e0b', '#ec4899'], css: 'linear-gradient(135deg, #f59e0b, #ec4899)' },
    { name: 'Mint', colors: ['#10b981', '#06b6d4'], css: 'linear-gradient(135deg, #10b981, #06b6d4)' },
    { name: 'Midnight', colors: ['#1e293b', '#6366f1'], css: 'linear-gradient(135deg, #1e293b, #6366f1)' },
    { name: 'Gold Shine', colors: ['#c9a227', '#f0d78c'], css: 'linear-gradient(135deg, #c9a227, #f0d78c)' },
    { name: 'Royal', colors: ['#4c1d95', '#7c3aed'], css: 'linear-gradient(135deg, #4c1d95, #7c3aed)' },
    { name: 'Emerald', colors: ['#065f46', '#10b981'], css: 'linear-gradient(135deg, #065f46, #10b981)' },
    { name: 'Lavender', colors: ['#ede9fe', '#c4b5fd'], css: 'linear-gradient(135deg, #ede9fe, #c4b5fd)' },
  ];

  return (
    <div className="w-80 bg-editor-sidebar border-r border-border/20 flex flex-col h-full overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-border/20 rounded-none h-12">
          <TabsTrigger 
            value="templates" 
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-none"
          >
            <LayoutTemplate className="w-4 h-4 mr-1" />
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="elements" 
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-none"
          >
            <Shapes className="w-4 h-4 mr-1" />
            Elements
          </TabsTrigger>
          <TabsTrigger 
            value="styles" 
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-none"
          >
            <Palette className="w-4 h-4 mr-1" />
            Styles
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <p className="text-xs text-editor-sidebar-muted">
                Click a template to apply it. This will replace your current design.
              </p>
              
              {TEMPLATE_CATEGORIES.map((category) => {
                const Icon = categoryIcons[category.id] || LayoutTemplate;
                const templates = PRESET_TEMPLATES.filter(t => t.category === category.id);
                
                if (templates.length === 0) return null;
                
                return (
                  <div key={category.id} className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted flex items-center gap-2">
                      <Icon className={cn("w-4 h-4", category.color)} />
                      {category.label}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {templates.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handleApplyTemplate(preset)}
                          className={cn(
                            "w-full p-3 rounded-lg text-left transition-all",
                            "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                            "group"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{preset.preview}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-editor-sidebar-foreground truncate">
                                {preset.name}
                              </p>
                              <p className="text-[10px] text-editor-sidebar-muted truncate">
                                {preset.description}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-editor-sidebar-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Elements Tab */}
        <TabsContent value="elements" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Text Elements */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted">
                  Text
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddHeading}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <Type className="w-5 h-5 mb-1" strokeWidth={3} />
                    <span className="text-[10px]">Heading</span>
                  </button>
                  <button
                    onClick={handleAddSubheading}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <Type className="w-5 h-5 mb-1" strokeWidth={2} />
                    <span className="text-[10px]">Subheading</span>
                  </button>
                  <button
                    onClick={handleAddBodyText}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <Type className="w-5 h-5 mb-1" strokeWidth={1.5} />
                    <span className="text-[10px]">Body Text</span>
                  </button>
                  <button
                    onClick={handleAddText}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <Plus className="w-5 h-5 mb-1" />
                    <span className="text-[10px]">Custom</span>
                  </button>
                </div>
              </div>

              {/* Shapes */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted">
                  Shapes
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleAddShape('rectangle')}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-lg aspect-square",
                          "bg-white/5 hover:bg-white/10 transition-colors",
                          "text-editor-sidebar-foreground hover:text-white"
                        )}
                      >
                        <Square className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Rectangle</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleAddShape('circle')}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-lg aspect-square",
                          "bg-white/5 hover:bg-white/10 transition-colors",
                          "text-editor-sidebar-foreground hover:text-white"
                        )}
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Circle</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleAddShape('triangle')}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-lg aspect-square",
                          "bg-white/5 hover:bg-white/10 transition-colors",
                          "text-editor-sidebar-foreground hover:text-white"
                        )}
                      >
                        <Triangle className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Triangle</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleAddDecoShape('#c9a227', { width: 80, height: 80 })}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-lg aspect-square",
                          "bg-white/5 hover:bg-white/10 transition-colors",
                          "text-editor-sidebar-foreground hover:text-white"
                        )}
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Gold Accent</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Lines */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted">
                  Lines & Dividers
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAddLine('thin')}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <Minus className="w-5 h-1" />
                    <span className="text-[10px] mt-2">Thin</span>
                  </button>
                  <button
                    onClick={() => handleAddLine('thick')}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <Minus className="w-5 h-1" strokeWidth={4} />
                    <span className="text-[10px] mt-2">Thick</span>
                  </button>
                  <button
                    onClick={() => handleAddLine('decorative')}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <Minus className="w-5 h-1 text-yellow-500" strokeWidth={2} />
                    <span className="text-[10px] mt-2">Gold</span>
                  </button>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted">
                  Images
                </h3>
                <button
                  onClick={handleImageUpload}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 p-4 rounded-lg",
                    "bg-white/5 hover:bg-white/10 transition-colors border border-dashed border-white/20",
                    "text-editor-sidebar-foreground hover:text-white"
                  )}
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">Upload Image</span>
                </button>
              </div>

              {/* Placeholders */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted">
                  Dynamic Placeholders
                </h3>
                <p className="text-[10px] text-editor-sidebar-muted mb-2">
                  These fields will be auto-filled from your data
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {placeholders.map((placeholder) => (
                    <button
                      key={placeholder.key}
                      onClick={() => handleAddPlaceholder(placeholder.key)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg text-left",
                        "bg-white/5 hover:bg-white/10 transition-colors",
                        "text-editor-sidebar-foreground hover:text-white"
                      )}
                    >
                      <span className="text-lg">{placeholder.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{placeholder.label}</p>
                        <p className="text-[10px] text-editor-sidebar-muted font-mono">{`{{${placeholder.key}}}`}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {/* Custom placeholder input */}
                <div className="flex gap-1 mt-2">
                  <input
                    type="text"
                    value={customPlaceholderKey}
                    onChange={(e) => setCustomPlaceholderKey(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomPlaceholder()}
                    placeholder="Custom field name..."
                    className="flex-1 h-8 rounded-md bg-white/5 border border-white/10 text-editor-sidebar-foreground text-xs px-2"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddCustomPlaceholder}
                    disabled={!customPlaceholderKey.trim()}
                    className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 px-2"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-[10px] text-editor-sidebar-muted">
                  Certificate_ID and Date are auto-generated
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Styles Tab */}
        <TabsContent value="styles" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Gradient Palettes */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted">
                  Gradient Palettes
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {gradientPalettes.map((gradient) => (
                    <Tooltip key={gradient.name}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            // Apply gradient as background - use first color
                            updateTemplate({ backgroundColor: gradient.colors[0] });
                          }}
                          className="aspect-square rounded-md border border-white/10 hover:scale-110 transition-transform"
                          style={{ background: gradient.css }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">{gradient.name}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <p className="text-[10px] text-editor-sidebar-muted">
                  Click to apply as background color
                </p>
              </div>

              {/* Color Palettes */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted">
                  Color Palettes
                </h3>
                {colorPalettes.map((palette) => (
                  <div key={palette.name} className="space-y-1">
                    <p className="text-xs text-editor-sidebar-foreground">{palette.name}</p>
                    <div className="flex gap-1">
                      {palette.colors.map((color, i) => (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleAddDecoShape(color, { width: 100, height: 100 })}
                              className={cn(
                                "flex-1 aspect-square rounded-md border border-white/10 hover:scale-110 transition-transform",
                                color === '#ffffff' && "border-gray-300"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="bottom">{color}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Background Quick Set */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted">
                  Background Colors
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {['#ffffff', '#f8fafc', '#fef7f0', '#f0f9ff', '#fdf4ff', '#1e293b', '#0f172a', '#fef3c7', '#ecfdf5', '#fce7f3'].map((color) => (
                    <Tooltip key={color}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => updateTemplate({ backgroundColor: color })}
                          className={cn(
                            "aspect-square rounded-md border transition-transform hover:scale-110",
                            color === '#ffffff' ? 'border-gray-300' : 'border-white/20',
                            template.backgroundColor === color && 'ring-2 ring-primary ring-offset-1'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">{color}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Quick Decorations */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted">
                  Quick Decorations
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddDecoShape('#c9a227', { width: 400, height: 8 })}
                    className={cn(
                      "p-3 rounded-lg text-center",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <div className="w-full h-1 bg-yellow-500 rounded mb-2" />
                    <span className="text-[10px]">Gold Bar</span>
                  </button>
                  <button
                    onClick={() => handleAddDecoShape('#6366f1', { width: 60, height: 794 })}
                    className={cn(
                      "p-3 rounded-lg text-center",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <div className="w-2 h-6 bg-indigo-500 rounded mx-auto mb-2" />
                    <span className="text-[10px]">Side Accent</span>
                  </button>
                  <button
                    onClick={() => handleAddDecoShape('#1e293b', { width: 100, height: 100 })}
                    className={cn(
                      "p-3 rounded-lg text-center",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <div className="w-6 h-6 bg-slate-800 rounded mx-auto mb-2" />
                    <span className="text-[10px]">Dark Box</span>
                  </button>
                  <button
                    onClick={() => handleAddDecoShape('#f8fafc', { width: 200, height: 200 })}
                    className={cn(
                      "p-3 rounded-lg text-center",
                      "bg-white/5 hover:bg-white/10 transition-colors",
                      "text-editor-sidebar-foreground hover:text-white"
                    )}
                  >
                    <div className="w-6 h-6 bg-slate-100 border border-slate-300 rounded mx-auto mb-2" />
                    <span className="text-[10px]">Light Box</span>
                  </button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
