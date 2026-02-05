import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import fabricModule from 'fabric';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Award,
  FileSpreadsheet,
  ImageIcon,
  Palette,
  FileDown,
  ChevronDown,
  Trash2,
  FileText,
  FileImage,
  Loader2
} from 'lucide-react';
import { PAGE_SIZES } from '@/types/certificate';
import { cn } from '@/lib/utils';

// Normalize Fabric.js import
const fabric = ((fabricModule as any)?.fabric ?? fabricModule) as any;

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
    setZoom,
    resetEditor
  } = useEditor();

  const [customWidth, setCustomWidth] = useState(template.width);
  const [customHeight, setCustomHeight] = useState(template.height);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'png' | 'jpg'>('pdf');

  const currentPageSize = PAGE_SIZES.find(
    p => p.width === template.width && p.height === template.height
  );

  const loadFabricImage = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        const ImageCtor = fabric?.Image ?? fabric?.FabricImage;
        if (!ImageCtor?.fromURL) {
          reject(new Error('Fabric Image.fromURL is not available'));
          return;
        }
        ImageCtor.fromURL(url, (img: any) => resolve(img), { crossOrigin: 'anonymous' });
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleExportSingle = useCallback(async (format: 'pdf' | 'png' | 'jpg') => {
    setIsExporting(true);
    
    try {
      // Create a static canvas for export
      const canvas = new fabric.StaticCanvas(null, {
        width: template.width,
        height: template.height,
        backgroundColor: template.backgroundColor,
      });

      // Add background image if exists
      if (template.backgroundImage) {
        try {
          const img = await loadFabricImage(template.backgroundImage);
          img.scaleToWidth(template.width);
          img.scaleToHeight(template.height);
          canvas.backgroundImage = img;
        } catch {
          // Ignore background image errors
        }
      }

      // Sort elements by zIndex
      const sortedElements = [...template.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      // Add elements
      for (const element of sortedElements) {
        switch (element.type) {
          case 'text':
          case 'placeholder':
            const textObj = new fabric.IText(element.text || '', {
              left: element.x,
              top: element.y,
              fontFamily: element.fontFamily || 'Inter',
              fontSize: element.fontSize || 24,
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              fill: element.fill || '#000000',
              textAlign: element.textAlign || 'left',
              angle: element.rotation || 0,
              opacity: element.opacity ?? 1,
              charSpacing: (element.letterSpacing || 0) * 10,
            });
            canvas.add(textObj);
            break;

          case 'shape':
            if (element.shapeType === 'circle') {
              const circle = new fabric.Circle({
                left: element.x,
                top: element.y,
                radius: Math.min(element.width || 100, element.height || 100) / 2,
                fill: element.fill || '#e2e8f0',
                stroke: element.stroke || '#94a3b8',
                strokeWidth: element.strokeWidth || 1,
                angle: element.rotation || 0,
                opacity: element.opacity ?? 1,
              });
              canvas.add(circle);
            } else if (element.shapeType === 'triangle') {
              const triangle = new fabric.Triangle({
                left: element.x,
                top: element.y,
                width: element.width || 100,
                height: element.height || 100,
                fill: element.fill || '#e2e8f0',
                stroke: element.stroke || '#94a3b8',
                strokeWidth: element.strokeWidth || 1,
                angle: element.rotation || 0,
                opacity: element.opacity ?? 1,
              });
              canvas.add(triangle);
            } else {
              const rect = new fabric.Rect({
                left: element.x,
                top: element.y,
                width: element.width || 100,
                height: element.height || 100,
                fill: element.fill || '#e2e8f0',
                stroke: element.stroke || '#94a3b8',
                strokeWidth: element.strokeWidth || 1,
                rx: 4,
                ry: 4,
                angle: element.rotation || 0,
                opacity: element.opacity ?? 1,
              });
              canvas.add(rect);
            }
            break;

          case 'line':
            const line = new fabric.Line([0, 0, element.width || 200, 0], {
              left: element.x,
              top: element.y,
              stroke: element.fill || '#000000',
              strokeWidth: element.strokeWidth || 2,
              angle: element.rotation || 0,
              opacity: element.opacity ?? 1,
            });
            canvas.add(line);
            break;

          case 'image':
            if (element.src) {
              try {
                const img = await loadFabricImage(element.src);
                img.set({
                  left: element.x,
                  top: element.y,
                  angle: element.rotation || 0,
                  opacity: element.opacity ?? 1,
                });
                img.scaleToWidth(element.width || 200);
                canvas.add(img);
              } catch {
                // Ignore image loading errors
              }
            }
            break;
        }
      }

      canvas.renderAll();

      const filename = template.name.replace(/[<>:"/\\|?*]/g, '_') || 'certificate';

      if (format === 'pdf') {
        const dataUrl = canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 2,
        });

        const pdf = new jsPDF({
          orientation: template.width > template.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [template.width, template.height],
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, template.width, template.height);
        pdf.save(`${filename}.pdf`);
      } else {
        const dataUrl = canvas.toDataURL({
          format: format === 'jpg' ? 'jpeg' : 'png',
          quality: 1,
          multiplier: 2,
        });
        
        // Convert data URL to blob and save
        const link = document.createElement('a');
        link.download = `${filename}.${format}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [template]);

  const handlePageSizeChange = (value: string) => {
    if (value === 'Custom') {
      // Keep current dimensions for custom
      return;
    }
    const pageSize = PAGE_SIZES.find(p => p.name === value);
    if (pageSize) {
      updateTemplate({
        width: pageSize.width,
        height: pageSize.height,
      });
      setCustomWidth(pageSize.width);
      setCustomHeight(pageSize.height);
    }
  };

  const handleCustomSizeApply = () => {
    updateTemplate({
      width: customWidth,
      height: customHeight,
    });
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

  const handleRemoveBackgroundImage = () => {
    updateTemplate({ backgroundImage: undefined });
  };

  const handleReset = () => {
    resetEditor();
    setShowResetDialog(false);
  };

  const zoomOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="h-14 bg-editor-toolbar border-b border-border flex items-center px-4 gap-3">
      {/* Logo/Home */}
      <Link to="/" className="flex items-center gap-2 mr-2">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Award className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-foreground hidden md:inline">CertiMaster</span>
      </Link>

      <div className="h-6 w-px bg-border" />

      {/* Template Name */}
      <Input
        value={template.name}
        onChange={(e) => updateTemplate({ name: e.target.value })}
        className="w-36 h-8 text-sm bg-muted border-none"
        placeholder="Template name"
      />

      <div className="h-6 w-px bg-border" />

      {/* Page Size Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 min-w-[140px] justify-between">
            <span className="truncate">{currentPageSize?.name || 'Custom'}</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="start">
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium">Page Size</Label>
              <Select
                value={currentPageSize?.name || 'Custom'}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size.name} value={size.name}>
                      <div className="flex items-center justify-between gap-4">
                        <span>{size.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {size.width} × {size.height}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium">Custom Dimensions (px)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Width</Label>
                  <Input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="h-8"
                    min={200}
                    max={3000}
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Height</Label>
                  <Input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="h-8"
                    min={200}
                    max={3000}
                  />
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={handleCustomSizeApply} 
                className="w-full h-8"
                disabled={customWidth === template.width && customHeight === template.height}
              >
                Apply Custom Size
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Background Controls */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <div 
              className="w-4 h-4 rounded border border-border"
              style={{ backgroundColor: template.backgroundColor }}
            />
            <span className="hidden sm:inline">Background</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium flex items-center gap-2">
                <Palette className="w-3 h-3" />
                Background Color
              </Label>
              <div className="flex gap-2 mt-2">
                <input
                  type="color"
                  value={template.backgroundColor}
                  onChange={handleBackgroundColorChange}
                  className="w-10 h-8 rounded cursor-pointer border border-border"
                />
                <Input
                  type="text"
                  value={template.backgroundColor}
                  onChange={(e) => updateTemplate({ backgroundColor: e.target.value })}
                  className="flex-1 h-8 font-mono text-sm"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs font-medium flex items-center gap-2">
                <ImageIcon className="w-3 h-3" />
                Background Image
              </Label>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBackgroundImageUpload}
                  className="flex-1 h-8"
                >
                  {template.backgroundImage ? 'Change Image' : 'Upload Image'}
                </Button>
                {template.backgroundImage && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRemoveBackgroundImage}
                    className="h-8 px-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
              {template.backgroundImage && (
                <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
                  Background image set
                </div>
              )}
            </div>

            {/* Quick Colors */}
            <div>
              <Label className="text-xs font-medium">Quick Colors</Label>
              <div className="flex gap-1 mt-2 flex-wrap">
                {['#ffffff', '#f8fafc', '#fef7f0', '#f0f9ff', '#fdf4ff', '#1e293b', '#0f172a'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateTemplate({ backgroundColor: color })}
                    className={cn(
                      "w-6 h-6 rounded border",
                      color === '#ffffff' ? 'border-border' : 'border-white/20',
                      template.backgroundColor === color && 'ring-2 ring-primary ring-offset-1'
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="h-6 w-px bg-border" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={undo}
          disabled={!canUndo}
          className="h-8 w-8"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={redo}
          disabled={!canRedo}
          className="h-8 w-8"
          title="Redo (Ctrl+Y)"
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
          onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
          disabled={zoom <= 0.25}
          className="h-8 w-8"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-16 text-sm">
              {Math.round(zoom * 100)}%
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32 p-2" align="center">
            <div className="space-y-1">
              {zoomOptions.map((z) => (
                <Button
                  key={z}
                  variant={zoom === z ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-center h-7"
                  onClick={() => setZoom(z)}
                >
                  {Math.round(z * 100)}%
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setZoom(Math.min(2, zoom + 0.25))}
          disabled={zoom >= 2}
          className="h-8 w-8"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1" />

      {/* Reset Button */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
            <Trash2 className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Editor?</DialogTitle>
            <DialogDescription>
              This will clear all elements and reset the canvas to a blank state. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset Editor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data & Export */}
      <Button
        variant="outline"
        onClick={onOpenDataPanel}
        className="h-8"
      >
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Bulk Generate</span>
      </Button>
      
      {/* Single Export */}
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-8 gradient-primary text-white" disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="end">
          <div className="space-y-3">
            <div className="text-sm font-medium">Export Certificate</div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleExportSingle('pdf')}
                disabled={isExporting}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleExportSingle('png')}
                disabled={isExporting}
              >
                <FileImage className="w-4 h-4 mr-2" />
                Download as PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleExportSingle('jpg')}
                disabled={isExporting}
              >
                <FileImage className="w-4 h-4 mr-2" />
                Download as JPG
              </Button>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                For bulk generation with recipient data, use "Bulk Generate"
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
