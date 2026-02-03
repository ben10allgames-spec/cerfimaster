import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  ChevronsDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="w-72 bg-editor-sidebar border-l border-border/20 p-4 flex items-center justify-center">
        <p className="text-editor-sidebar-muted text-sm text-center">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  const isTextElement = element.type === 'text' || element.type === 'placeholder';
  const isShapeElement = element.type === 'shape';

  return (
    <div className="w-72 bg-editor-sidebar border-l border-border/20 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/20">
        <h3 className="text-sm font-semibold text-editor-sidebar-foreground capitalize">
          {element.type} Properties
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
        {/* Actions */}
        <div className="space-y-2">
          <Label className="text-xs text-editor-sidebar-muted">Actions</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => duplicateElement(element.id)}
              className="flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10"
            >
              <Copy className="w-3 h-3 mr-1" />
              Duplicate
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeElement(element.id)}
              className="flex-1"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="space-y-2">
          <Label className="text-xs text-editor-sidebar-muted">Layer Order</Label>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => sendToBack(element.id)}
              className="flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 px-2"
            >
              <ChevronsDown className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => sendBackward(element.id)}
              className="flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 px-2"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => bringForward(element.id)}
              className="flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 px-2"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => bringToFront(element.id)}
              className="flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10 px-2"
            >
              <ChevronsUp className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Position */}
        <div className="space-y-3">
          <Label className="text-xs text-editor-sidebar-muted">Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-editor-sidebar-muted">X</Label>
              <Input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => updateElement(element.id, { x: Number(e.target.value) })}
                className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm"
              />
            </div>
            <div>
              <Label className="text-[10px] text-editor-sidebar-muted">Y</Label>
              <Input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => updateElement(element.id, { y: Number(e.target.value) })}
                className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm"
              />
            </div>
          </div>
        </div>

        {/* Size (for shapes and images) */}
        {(element.type === 'shape' || element.type === 'image') && (
          <div className="space-y-3">
            <Label className="text-xs text-editor-sidebar-muted">Size</Label>
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
              <div>
                <Label className="text-[10px] text-editor-sidebar-muted">Height</Label>
                <Input
                  type="number"
                  value={Math.round(element.height || 100)}
                  onChange={(e) => updateElement(element.id, { height: Number(e.target.value) })}
                  className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Text Properties */}
        {isTextElement && (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-editor-sidebar-muted">Font Family</Label>
              <Select
                value={element.fontFamily || 'Inter'}
                onValueChange={(value) => updateElement(element.id, { fontFamily: value })}
              >
                <SelectTrigger className="h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-editor-sidebar-muted">Font Size</Label>
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

            <div className="space-y-2">
              <Label className="text-xs text-editor-sidebar-muted">Style</Label>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateElement(element.id, { 
                    fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' 
                  })}
                  className={cn(
                    "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10",
                    element.fontWeight === 'bold' && "bg-primary/20 border-primary/30"
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
                    "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10",
                    element.fontStyle === 'italic' && "bg-primary/20 border-primary/30"
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
                    "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10",
                    element.textDecoration === 'underline' && "bg-primary/20 border-primary/30"
                  )}
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-editor-sidebar-muted">Alignment</Label>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateElement(element.id, { textAlign: 'left' })}
                  className={cn(
                    "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10",
                    element.textAlign === 'left' && "bg-primary/20 border-primary/30"
                  )}
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateElement(element.id, { textAlign: 'center' })}
                  className={cn(
                    "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10",
                    element.textAlign === 'center' && "bg-primary/20 border-primary/30"
                  )}
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateElement(element.id, { textAlign: 'right' })}
                  className={cn(
                    "flex-1 bg-white/5 border-white/10 text-editor-sidebar-foreground hover:bg-white/10",
                    element.textAlign === 'right' && "bg-primary/20 border-primary/30"
                  )}
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Color */}
        <div className="space-y-2">
          <Label className="text-xs text-editor-sidebar-muted">
            {isTextElement ? 'Text Color' : 'Fill Color'}
          </Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={element.fill || '#000000'}
              onChange={(e) => updateElement(element.id, { fill: e.target.value })}
              className="w-10 h-8 rounded cursor-pointer bg-transparent"
            />
            <Input
              type="text"
              value={element.fill || '#000000'}
              onChange={(e) => updateElement(element.id, { fill: e.target.value })}
              className="flex-1 h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm font-mono"
            />
          </div>
        </div>

        {/* Stroke (for shapes) */}
        {isShapeElement && (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-editor-sidebar-muted">Stroke Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.stroke || '#000000'}
                  onChange={(e) => updateElement(element.id, { stroke: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer bg-transparent"
                />
                <Input
                  type="text"
                  value={element.stroke || '#000000'}
                  onChange={(e) => updateElement(element.id, { stroke: e.target.value })}
                  className="flex-1 h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-editor-sidebar-muted">Stroke Width</Label>
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
        <div className="space-y-2">
          <Label className="text-xs text-editor-sidebar-muted">Opacity</Label>
          <Slider
            value={[(element.opacity ?? 1) * 100]}
            onValueChange={([value]) => updateElement(element.id, { opacity: value / 100 })}
            min={0}
            max={100}
            step={1}
          />
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <Label className="text-xs text-editor-sidebar-muted">Rotation</Label>
          <div className="flex gap-2 items-center">
            <Slider
              value={[element.rotation || 0]}
              onValueChange={([value]) => updateElement(element.id, { rotation: value })}
              min={0}
              max={360}
              step={1}
              className="flex-1"
            />
            <Input
              type="number"
              value={Math.round(element.rotation || 0)}
              onChange={(e) => updateElement(element.id, { rotation: Number(e.target.value) })}
              className="w-16 h-8 bg-white/5 border-white/10 text-editor-sidebar-foreground text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
