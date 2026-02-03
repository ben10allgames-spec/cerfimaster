import React from 'react';
import { Link } from 'react-router-dom';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Home,
  Award,
  FileSpreadsheet
} from 'lucide-react';
import { PAGE_SIZES } from '@/types/certificate';

interface EditorToolbarProps {
  onOpenDataPanel: () => void;
}

export function EditorToolbar({ onOpenDataPanel }: EditorToolbarProps) {
  const { 
    template, 
    updateTemplate, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    zoom,
    setZoom 
  } = useEditor();

  const handlePageSizeChange = (value: string) => {
    const pageSize = PAGE_SIZES.find(p => p.name === value);
    if (pageSize) {
      updateTemplate({
        width: pageSize.width,
        height: pageSize.height,
      });
    }
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTemplate({ backgroundColor: e.target.value });
  };

  const handleBackgroundImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updateTemplate({ backgroundImage: event.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-14 bg-editor-toolbar border-b border-border flex items-center px-4 gap-4">
      {/* Logo/Home */}
      <Link to="/" className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Award className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-foreground hidden sm:inline">CertiMaster</span>
      </Link>

      <div className="h-6 w-px bg-border" />

      {/* Template Name */}
      <Input
        value={template.name}
        onChange={(e) => updateTemplate({ name: e.target.value })}
        className="w-40 h-8 text-sm bg-muted border-none"
        placeholder="Template name"
      />

      <div className="h-6 w-px bg-border" />

      {/* Page Size */}
      <Select
        value={PAGE_SIZES.find(p => p.width === template.width && p.height === template.height)?.name || 'Custom'}
        onValueChange={handlePageSizeChange}
      >
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZES.map((size) => (
            <SelectItem key={size.name} value={size.name}>
              {size.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Background Color */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">BG:</span>
        <input
          type="color"
          value={template.backgroundColor}
          onChange={handleBackgroundColorChange}
          className="w-8 h-8 rounded cursor-pointer"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleBackgroundImageUpload}
          className="h-8 text-xs"
        >
          Upload BG
        </Button>
      </div>

      <div className="h-6 w-px bg-border" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={undo}
          disabled={!canUndo}
          className="h-8 w-8"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={redo}
          disabled={!canRedo}
          className="h-8 w-8"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-border" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setZoom(zoom - 0.1)}
          disabled={zoom <= 0.25}
          className="h-8 w-8"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm w-14 text-center text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setZoom(zoom + 0.1)}
          disabled={zoom >= 2}
          className="h-8 w-8"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1" />

      {/* Data & Export */}
      <Button
        variant="outline"
        onClick={onOpenDataPanel}
        className="h-8"
      >
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Import Data
      </Button>
      <Button className="h-8 gradient-primary text-white">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </div>
  );
}
