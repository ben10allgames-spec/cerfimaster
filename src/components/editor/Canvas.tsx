import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useEditor } from '@/contexts/EditorContext';
import { CertificateElement } from '@/types/certificate';

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { 
    template, 
    zoom, 
    selectElement, 
    selectedElementId,
    updateElement,
  } = useEditor();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: template.width,
      height: template.height,
      backgroundColor: template.backgroundColor,
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;
    setIsInitialized(true);

    // Event handlers
    canvas.on('selection:created', (e) => {
      const selected = e.selected;
      const obj = selected?.[0];
      if (obj) {
        const data = (obj as any).data;
        if (data?.id) {
          selectElement(data.id);
        }
      }
    });

    canvas.on('selection:updated', (e) => {
      const selected = e.selected;
      const obj = selected?.[0];
      if (obj) {
        const data = (obj as any).data;
        if (data?.id) {
          selectElement(data.id);
        }
      }
    });

    canvas.on('selection:cleared', () => {
      selectElement(null);
    });

    canvas.on('object:modified', (e) => {
      const obj = e.target;
      if (obj) {
        const data = (obj as any).data;
        if (data?.id) {
          const updates: Partial<CertificateElement> = {
            x: obj.left || 0,
            y: obj.top || 0,
            rotation: obj.angle || 0,
          };
          
          if (obj.type === 'i-text' || obj.type === 'text') {
            const textObj = obj as fabric.IText;
            updates.width = textObj.width;
            updates.fontSize = textObj.fontSize;
          } else {
            updates.width = (obj.width || 0) * (obj.scaleX || 1);
            updates.height = (obj.height || 0) * (obj.scaleY || 1);
          }
          
          updateElement(data.id, updates);
        }
      }
    });

    canvas.on('text:changed', (e) => {
      const obj = e.target as fabric.IText;
      if (obj) {
        const data = (obj as any).data;
        if (data?.id) {
          updateElement(data.id, { text: obj.text || '' });
        }
      }
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Sync elements to canvas
  useEffect(() => {
    if (!fabricRef.current || !isInitialized) return;

    const canvas = fabricRef.current;
    canvas.clear();
    canvas.backgroundColor = template.backgroundColor;

    if (template.backgroundImage) {
      fabric.FabricImage.fromURL(template.backgroundImage).then((img) => {
        img.scaleToWidth(template.width);
        img.scaleToHeight(template.height);
        canvas.backgroundImage = img;
        canvas.renderAll();
      });
    }

    // Sort elements by zIndex
    const sortedElements = [...template.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    sortedElements.forEach((element) => {
      let fabricObj: fabric.FabricObject | null = null;

      switch (element.type) {
        case 'text':
        case 'placeholder':
          fabricObj = new fabric.IText(element.text || '', {
            left: element.x,
            top: element.y,
            fontFamily: element.fontFamily || 'Inter',
            fontSize: element.fontSize || 24,
            fontWeight: element.fontWeight as string || 'normal',
            fontStyle: element.fontStyle as 'normal' | 'italic' | 'oblique' || 'normal',
            fill: element.fill || '#000000',
            textAlign: element.textAlign as 'left' | 'center' | 'right' || 'left',
            underline: element.textDecoration === 'underline',
            angle: element.rotation || 0,
            opacity: element.opacity ?? 1,
            charSpacing: (element.letterSpacing || 0) * 10,
          });
          (fabricObj as any).data = { id: element.id };
          canvas.add(fabricObj);
          break;

        case 'image':
          if (element.src) {
            fabric.FabricImage.fromURL(element.src, { crossOrigin: 'anonymous' }).then((img) => {
              img.set({
                left: element.x,
                top: element.y,
                angle: element.rotation || 0,
                opacity: element.opacity ?? 1,
              });
              (img as any).data = { id: element.id };
              img.scaleToWidth(element.width || 200);
              canvas.add(img);
              canvas.renderAll();
            });
          }
          return;

        case 'shape':
          if (element.shapeType === 'circle') {
            const radius = Math.min(element.width || 100, element.height || 100) / 2;
            fabricObj = new fabric.Circle({
              left: element.x,
              top: element.y,
              radius,
              fill: element.fill || '#e2e8f0',
              stroke: element.stroke || '#94a3b8',
              strokeWidth: element.strokeWidth || 1,
              angle: element.rotation || 0,
              opacity: element.opacity ?? 1,
            });
          } else {
            fabricObj = new fabric.Rect({
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
          }
          (fabricObj as any).data = { id: element.id };
          canvas.add(fabricObj);
          break;

        case 'line':
          fabricObj = new fabric.Line([0, 0, element.width || 200, 0], {
            left: element.x,
            top: element.y,
            stroke: element.fill || '#000000',
            strokeWidth: element.strokeWidth || 2,
            angle: element.rotation || 0,
            opacity: element.opacity ?? 1,
          });
          (fabricObj as any).data = { id: element.id };
          canvas.add(fabricObj);
          break;
      }
    });

    canvas.renderAll();
  }, [template, isInitialized]);

  // Handle zoom
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.setZoom(zoom);
    fabricRef.current.setWidth(template.width * zoom);
    fabricRef.current.setHeight(template.height * zoom);
  }, [zoom, template.width, template.height]);

  // Handle selection from context
  useEffect(() => {
    if (!fabricRef.current) return;
    
    if (selectedElementId) {
      const objects = fabricRef.current.getObjects();
      const target = objects.find((obj) => (obj as any).data?.id === selectedElementId);
      if (target) {
        fabricRef.current.setActiveObject(target);
        fabricRef.current.renderAll();
      }
    } else {
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
    }
  }, [selectedElementId]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-editor-canvas-bg overflow-auto flex items-center justify-center p-8"
    >
      <div 
        className="canvas-container bg-white"
        style={{
          width: template.width * zoom,
          height: template.height * zoom,
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
