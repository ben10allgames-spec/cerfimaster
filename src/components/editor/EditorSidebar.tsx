import React, { useCallback } from 'react';
import { 
  Type, 
  Square, 
  Circle, 
  Image, 
  Minus, 
  Star, 
  Sparkles,
  FileText,
  Shapes,
  Upload
} from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ToolbarItem {
  id: string;
  icon: React.ElementType;
  label: string;
  action: () => void;
}

export function EditorSidebar() {
  const { addElement, template } = useEditor();

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

  const handleAddShape = useCallback((shapeType: 'rectangle' | 'circle') => {
    addElement({
      type: 'shape',
      x: template.width / 2 - 50,
      y: template.height / 2 - 50,
      width: 100,
      height: 100,
      shapeType,
      fill: '#e2e8f0',
      stroke: '#94a3b8',
      strokeWidth: 2,
    });
  }, [addElement, template]);

  const handleAddLine = useCallback(() => {
    addElement({
      type: 'line',
      x: template.width / 2 - 100,
      y: template.height / 2,
      width: 200,
      height: 2,
      fill: '#000000',
      strokeWidth: 2,
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

  const tools: ToolbarItem[] = [
    { id: 'text', icon: Type, label: 'Add Text', action: handleAddText },
    { id: 'image', icon: Image, label: 'Upload Image', action: handleImageUpload },
    { id: 'rectangle', icon: Square, label: 'Add Rectangle', action: () => handleAddShape('rectangle') },
    { id: 'circle', icon: Circle, label: 'Add Circle', action: () => handleAddShape('circle') },
    { id: 'line', icon: Minus, label: 'Add Line', action: handleAddLine },
  ];

  const placeholders = [
    { key: 'Name', label: 'Recipient Name' },
    { key: 'Course_Name', label: 'Course Name' },
    { key: 'Date', label: 'Date' },
    { key: 'Organization_Name', label: 'Organization' },
    { key: 'Certificate_ID', label: 'Certificate ID' },
  ];

  return (
    <div className="w-72 bg-editor-sidebar border-r border-border/20 flex flex-col h-full overflow-hidden">
      {/* Elements Section */}
      <div className="p-4 border-b border-border/20">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted mb-3">
          Elements
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={tool.action}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg",
                    "bg-white/5 hover:bg-white/10 transition-colors",
                    "text-editor-sidebar-foreground hover:text-white"
                  )}
                >
                  <tool.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] opacity-70">{tool.label.split(' ')[1] || tool.label.split(' ')[0]}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Placeholders Section */}
      <div className="p-4 border-b border-border/20">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-editor-sidebar-muted mb-3 flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          Dynamic Fields
        </h3>
        <div className="space-y-2">
          {placeholders.map((placeholder) => (
            <button
              key={placeholder.key}
              onClick={() => handleAddPlaceholder(placeholder.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                "bg-primary/10 hover:bg-primary/20 transition-colors",
                "text-left text-sm"
              )}
            >
              <span className="text-primary font-mono text-xs">{`{{${placeholder.key}}}`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="p-4 mt-auto">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <h4 className="text-xs font-semibold text-editor-sidebar-foreground mb-1">Quick Tips</h4>
          <ul className="text-[10px] text-editor-sidebar-muted space-y-1">
            <li>• Click canvas to deselect</li>
            <li>• Drag to move elements</li>
            <li>• Ctrl+Z to undo</li>
            <li>• Double-click text to edit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
