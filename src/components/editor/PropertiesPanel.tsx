import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { FONT_FAMILIES } from '@/types/certificate';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  ChevronDown,
  RotateCcw,
  Move,
  Maximize2,
  Type,
  Paintbrush,
  Layers,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted hover:text-editor-sidebar-foreground transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3" />
          {title}
        </div>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PropertiesPanel() {
  const { 
    getSelectedElement, 
    updateElement, 
    removeElement,
    duplicateElement,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    selectedElementId 
  } = useEditor();

  const element = getSelectedElement();

  if (!element) {
    return (
      <div className="w-80 bg-editor-sidebar border-l border-border/20 p-6 flex flex-col items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
            <Settings2 className="w-8 h-8 text-editor-sidebar-muted" />
          </div>
          <div>
            <p className="text-editor-sidebar-foreground font-medium">No Element Selected</p>
            <p className="text-editor-sidebar-muted text-sm mt-1">
              Click on an element in the canvas to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isTextElement = element.type === 'text' || element.type === 'placeholder';
  const isShapeElement = element.type === 'shape';
  const isLineElement = element.type === 'line';
  const isImageElement = element.type === 'image';

  const fontWeights = [
    { value: 'normal', label: 'Regular' },
    { value: 'bold', label: 'Bold' },
    { value: '100', label: 'Thin' },
    { value: '200', label: 'Extra Light' },
    { value: '300', label: 'Light' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semi Bold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extra Bold' },
    { value: '900', label: 'Black' },
  ];

  return (
    <div className="w-80 bg-editor-sidebar border-l border-border/20 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              element.type === 'text' && "bg-blue-500/20 text-blue-400",
              element.type === 'placeholder' && "bg-purple-500/20 text-purple-400",
              element.type === 'shape' && "bg-green-500/20 text-green-400",
              element.type === 'line' && "bg-orange-500/20 text-orange-400",
              element.type === 'image' && "bg-pink-500/20 text-pink-400",
            )}>
              {element.type === 'text' && <Type className="w-4 h-4" />}
              {element.type === 'placeholder' && <span className="text-xs font-bold">{'{}'}</span>}
              {element.type === 'shape' && <Maximize2 className="w-4 h-4" />}
              {element.type === 'line' && <div className="w-4 h-0.5 bg-current" />}
              {element.type === 'image' && <Paintbrush className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-editor-sidebar-foreground capitalize">
                {element.type === 'placeholder' ? 'Dynamic Field' : element.type}
              </h3>
              {element.type === 'placeholder' && element.placeholderKey && (
                <p className="text-[10px] text-purple-400 font-mono">{`{{${element.placeholderKey}}}`}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => duplicateElement(element.id)}
            className="flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 h-9"
          >
            <Copy className="w-3 h-3 mr-1" />
            Duplicate
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => removeElement(element.id)}
            className="h-9 px-3"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        <Separator className="bg-border/20" />

        {/* Layer Controls */}
        <CollapsibleSection title="Layer Order" icon={Layers}>
          <div className="grid grid-cols-4 gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => sendToBack(element.id)}
              className="bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 px-2"
              title="Send to Back"
            >
              <ChevronsDown className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => sendBackward(element.id)}
              className="bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 px-2"
              title="Send Backward"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => bringForward(element.id)}
              className="bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 px-2"
              title="Bring Forward"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => bringToFront(element.id)}
              className="bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 px-2"
              title="Bring to Front"
            >
              <ChevronsUp className="w-4 h-4" />
            </Button>
          </div>
        </CollapsibleSection>

        {/* Position & Size */}
        <CollapsibleSection title="Position & Size" icon={Move}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-editor-sidebar-muted">X Position</Label>
              <Input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => updateElement(element.id, { x: Number(e.target.value) })}
                className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm"
              />
            </div>
            <div>
              <Label className="text-[10px] text-editor-sidebar-muted">Y Position</Label>
              <Input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => updateElement(element.id, { y: Number(e.target.value) })}
                className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm"
              />
            </div>
          </div>
          
          {(isShapeElement || isImageElement || isLineElement) && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-editor-sidebar-muted">Width</Label>
                <Input
                  type="number"
                  value={Math.round(element.width || 100)}
                  onChange={(e) => updateElement(element.id, { width: Number(e.target.value) })}
                  className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm"
                />
              </div>
              {!isLineElement && (
                <div>
                  <Label className="text-[10px] text-editor-sidebar-muted">Height</Label>
                  <Input
                    type="number"
                    value={Math.round(element.height || 100)}
                    onChange={(e) => updateElement(element.id, { height: Number(e.target.value) })}
                    className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm"
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-editor-sidebar-muted">Rotation</Label>
              <span className="text-[10px] text-editor-sidebar-muted">{Math.round(element.rotation || 0)}°</span>
            </div>
            <div className="flex gap-2 items-center">
              <Slider
                value={[element.rotation || 0]}
                onValueChange={([value]) => updateElement(element.id, { rotation: value })}
                min={0}
                max={360}
                step={1}
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateElement(element.id, { rotation: 0 })}
                className="h-8 w-8 p-0 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10"
                title="Reset Rotation"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        {/* Typography (for text elements) */}
        {isTextElement && (
          <CollapsibleSection title="Typography" icon={Type}>
            <div className="space-y-3">
              {/* Font Family */}
              <div>
                <Label className="text-[10px] text-editor-sidebar-muted">Font Family</Label>
                <Select
                  value={element.fontFamily || 'Inter'}
                  onValueChange={(value) => updateElement(element.id, { fontFamily: value })}
                >
                  <SelectTrigger className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-editor-sidebar-muted">Font Size</Label>
                  <span className="text-[10px] text-editor-sidebar-muted">{element.fontSize || 24}px</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Slider
                    value={[element.fontSize || 24]}
                    onValueChange={([value]) => updateElement(element.id, { fontSize: value })}
                    min={8}
                    max={120}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={element.fontSize || 24}
                    onChange={(e) => updateElement(element.id, { fontSize: Number(e.target.value) })}
                    className="w-16 h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm"
                  />
                </div>
              </div>

              {/* Font Weight */}
              <div>
                <Label className="text-[10px] text-editor-sidebar-muted">Font Weight</Label>
                <Select
                  value={element.fontWeight || 'normal'}
                  onValueChange={(value) => updateElement(element.id, { fontWeight: value })}
                >
                  <SelectTrigger className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Text Style Buttons */}
              <div>
                <Label className="text-[10px] text-editor-sidebar-muted">Text Style</Label>
                <div className="flex gap-1 mt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateElement(element.id, { 
                      fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' 
                    })}
                    className={cn(
                      "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 h-8",
                      element.fontWeight === 'bold' && "bg-primary/20 border-primary/30 text-primary"
                    )}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateElement(element.id, { 
                      fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' 
                    })}
                    className={cn(
                      "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 h-8",
                      element.fontStyle === 'italic' && "bg-primary/20 border-primary/30 text-primary"
                    )}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateElement(element.id, { 
                      textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' 
                    })}
                    className={cn(
                      "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 h-8",
                      element.textDecoration === 'underline' && "bg-primary/20 border-primary/30 text-primary"
                    )}
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <Label className="text-[10px] text-editor-sidebar-muted">Alignment</Label>
                <div className="flex gap-1 mt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateElement(element.id, { textAlign: 'left' })}
                    className={cn(
                      "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 h-8",
                      element.textAlign === 'left' && "bg-primary/20 border-primary/30 text-primary"
                    )}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateElement(element.id, { textAlign: 'center' })}
                    className={cn(
                      "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 h-8",
                      (element.textAlign === 'center' || !element.textAlign) && "bg-primary/20 border-primary/30 text-primary"
                    )}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateElement(element.id, { textAlign: 'right' })}
                    className={cn(
                      "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 h-8",
                      element.textAlign === 'right' && "bg-primary/20 border-primary/30 text-primary"
                    )}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-editor-sidebar-muted">Letter Spacing</Label>
                  <span className="text-[10px] text-editor-sidebar-muted">{element.letterSpacing || 0}px</span>
                </div>
                <Slider
                  value={[element.letterSpacing || 0]}
                  onValueChange={([value]) => updateElement(element.id, { letterSpacing: value })}
                  min={-5}
                  max={20}
                  step={0.5}
                />
              </div>

              {/* Line Height */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-editor-sidebar-muted">Line Height</Label>
                  <span className="text-[10px] text-editor-sidebar-muted">{(element.lineHeight || 1.2).toFixed(1)}</span>
                </div>
                <Slider
                  value={[(element.lineHeight || 1.2) * 10]}
                  onValueChange={([value]) => updateElement(element.id, { lineHeight: value / 10 })}
                  min={8}
                  max={30}
                  step={1}
                />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Appearance */}
        <CollapsibleSection title="Appearance" icon={Paintbrush}>
          {/* Fill Color */}
          <div>
            <Label className="text-[10px] text-editor-sidebar-muted">
              {isTextElement ? 'Text Color' : 'Fill Color'}
            </Label>
            <div className="flex gap-2 mt-1">
              <div className="relative">
                <input
                  type="color"
                  value={element.fill || '#000000'}
                  onChange={(e) => updateElement(element.id, { fill: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer bg-transparent border border-white/10"
                />
              </div>
              <Input
                type="text"
                value={element.fill || '#000000'}
                onChange={(e) => updateElement(element.id, { fill: e.target.value })}
                className="flex-1 h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm font-mono"
              />
            </div>
          </div>

          {/* Quick Colors */}
          <div>
            <Label className="text-[10px] text-editor-sidebar-muted">Quick Colors</Label>
            <div className="flex gap-1 mt-1 flex-wrap">
              {['#000000', '#ffffff', '#1e293b', '#6366f1', '#c9a227', '#0ea5e9', '#d97706', '#ef4444', '#22c55e'].map((color) => (
                <button
                  key={color}
                  onClick={() => updateElement(element.id, { fill: color })}
                  className={cn(
                    "w-6 h-6 rounded border",
                    color === '#ffffff' ? 'border-gray-300' : 'border-white/20',
                    element.fill === color && 'ring-2 ring-primary ring-offset-1 ring-offset-background'
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Stroke (for shapes and lines) */}
          {(isShapeElement || isLineElement) && (
            <>
              <div>
                <Label className="text-[10px] text-editor-sidebar-muted">Stroke Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={element.stroke || '#000000'}
                    onChange={(e) => updateElement(element.id, { stroke: e.target.value })}
                    className="w-10 h-8 rounded cursor-pointer bg-transparent border border-white/10"
                  />
                  <Input
                    type="text"
                    value={element.stroke || '#000000'}
                    onChange={(e) => updateElement(element.id, { stroke: e.target.value })}
                    className="flex-1 h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-editor-sidebar-muted">Stroke Width</Label>
                  <span className="text-[10px] text-editor-sidebar-muted">{element.strokeWidth || 1}px</span>
                </div>
                <Slider
                  value={[element.strokeWidth || 1]}
                  onValueChange={([value]) => updateElement(element.id, { strokeWidth: value })}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>
            </>
          )}

          {/* Opacity */}
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-editor-sidebar-muted">Opacity</Label>
              <span className="text-[10px] text-editor-sidebar-muted">{Math.round((element.opacity ?? 1) * 100)}%</span>
            </div>
            <Slider
              value={[(element.opacity ?? 1) * 100]}
              onValueChange={([value]) => updateElement(element.id, { opacity: value / 100 })}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
