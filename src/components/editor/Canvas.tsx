import React, { useEffect, useRef, useState, useCallback } from 'react';
import fabricModule from 'fabric';
import { useEditor } from '@/contexts/EditorContext';
import { CertificateElement } from '@/types/certificate';

// Vite wraps Fabric v5 (UMD) as a default export that looks like: { fabric: <actualFabric> }
const fabric = ((fabricModule as any)?.fabric ?? fabricModule) as any;

function loadFabricImage(url: string, options?: Record<string, unknown>) {
  return new Promise<any>((resolve, reject) => {
    try {
      const ImageCtor = fabric?.Image ?? fabric?.FabricImage;
      if (!ImageCtor?.fromURL) {
        reject(new Error('Fabric Image.fromURL is not available'));
        return;
      }
      ImageCtor.fromURL(url, (img: any) => resolve(img), options);
    } catch (err) {
      reject(err);
    }
  });
}

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isUpdatingRef = useRef(false);
  const elementMapRef = useRef<Map<string, any>>(new Map());
  
  const { 
    template, 
    zoom, 
    selectElement, 
    selectedElementId,
    updateElement,
  } = useEditor();

  // Initialize canvas only once
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
    canvas.on('selection:created', (e: any) => {
      if (isUpdatingRef.current) return;
      const selected = e.selected;
      const obj = selected?.[0];
      if (obj?.data?.id) {
        selectElement(obj.data.id);
      }
    });

    canvas.on('selection:updated', (e: any) => {
      if (isUpdatingRef.current) return;
      const selected = e.selected;
      const obj = selected?.[0];
      if (obj?.data?.id) {
        selectElement(obj.data.id);
      }
    });

    canvas.on('selection:cleared', () => {
      if (isUpdatingRef.current) return;
      selectElement(null);
    });

    canvas.on('object:modified', (e: any) => {
      const obj = e.target;
      if (obj?.data?.id) {
        isUpdatingRef.current = true;
        const updates: Partial<CertificateElement> = {
          x: obj.left || 0,
          y: obj.top || 0,
          rotation: obj.angle || 0,
        };
        
        if (obj.type === 'i-text' || obj.type === 'text') {
          updates.width = obj.width;
          updates.fontSize = obj.fontSize;
        } else {
          updates.width = (obj.width || 0) * (obj.scaleX || 1);
          updates.height = (obj.height || 0) * (obj.scaleY || 1);
        }
        
        updateElement(obj.data.id, updates);
        setTimeout(() => { isUpdatingRef.current = false; }, 50);
      }
    });

    canvas.on('object:moving', () => {
      isUpdatingRef.current = true;
    });

    canvas.on('text:changed', (e: any) => {
      const obj = e.target;
      if (obj?.data?.id) {
        isUpdatingRef.current = true;
        updateElement(obj.data.id, { text: obj.text || '' });
        setTimeout(() => { isUpdatingRef.current = false; }, 50);
      }
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
      elementMapRef.current.clear();
    };
  }, []);

  // Create or update fabric object for element
  const createFabricObject = useCallback(async (element: CertificateElement): Promise<any> => {
    let fabricObj: any = null;

    switch (element.type) {
      case 'text':
      case 'placeholder':
        fabricObj = new fabric.IText(element.text || '', {
          left: element.x,
          top: element.y,
          fontFamily: element.fontFamily || 'Inter',
          fontSize: element.fontSize || 24,
          fontWeight: element.fontWeight || 'normal',
          fontStyle: element.fontStyle || 'normal',
          fill: element.fill || '#000000',
          textAlign: element.textAlign || 'left',
          underline: element.textDecoration === 'underline',
          angle: element.rotation || 0,
          opacity: element.opacity ?? 1,
          charSpacing: (element.letterSpacing || 0) * 10,
        });
        fabricObj.data = { id: element.id };
        break;

      case 'image':
        if (element.src) {
          try {
            fabricObj = await loadFabricImage(element.src, { crossOrigin: 'anonymous' });
            fabricObj.set({
              left: element.x,
              top: element.y,
              angle: element.rotation || 0,
              opacity: element.opacity ?? 1,
            });
            fabricObj.data = { id: element.id };
            fabricObj.scaleToWidth(element.width || 200);
          } catch (err) {
            console.error('Failed to load image element:', err);
            return null;
          }
        }
        break;

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
        } else if (element.shapeType === 'triangle') {
          fabricObj = new fabric.Triangle({
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
        fabricObj.data = { id: element.id };
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
        fabricObj.data = { id: element.id };
        break;
    }

    return fabricObj;
  }, []);

  // Update fabric object properties without recreating
  const updateFabricObject = useCallback((fabricObj: any, element: CertificateElement) => {
    if (!fabricObj) return;

    const commonProps: any = {
      left: element.x,
      top: element.y,
      angle: element.rotation || 0,
      opacity: element.opacity ?? 1,
    };

    if (element.type === 'text' || element.type === 'placeholder') {
      Object.assign(commonProps, {
        fontFamily: element.fontFamily || 'Inter',
        fontSize: element.fontSize || 24,
        fontWeight: element.fontWeight || 'normal',
        fontStyle: element.fontStyle || 'normal',
        fill: element.fill || '#000000',
        textAlign: element.textAlign || 'left',
        underline: element.textDecoration === 'underline',
        charSpacing: (element.letterSpacing || 0) * 10,
      });
      
      // Update text content if changed
      if (fabricObj.text !== element.text) {
        fabricObj.set('text', element.text || '');
      }
    } else if (element.type === 'shape') {
      Object.assign(commonProps, {
        fill: element.fill || '#e2e8f0',
        stroke: element.stroke || '#94a3b8',
        strokeWidth: element.strokeWidth || 1,
      });
      
      if (element.shapeType === 'circle') {
        const radius = Math.min(element.width || 100, element.height || 100) / 2;
        commonProps.radius = radius;
      } else {
        commonProps.width = element.width || 100;
        commonProps.height = element.height || 100;
      }
    } else if (element.type === 'line') {
      Object.assign(commonProps, {
        stroke: element.fill || '#000000',
        strokeWidth: element.strokeWidth || 2,
      });
    }

    fabricObj.set(commonProps);
    fabricObj.setCoords();
  }, []);

  // Sync elements to canvas - optimized to prevent deselection
  useEffect(() => {
    if (!fabricRef.current || !isInitialized) return;
    if (isUpdatingRef.current) return;

    const canvas = fabricRef.current;
    const currentElements = new Set(template.elements.map(el => el.id));
    const existingIds = new Set(elementMapRef.current.keys());
    
    // Update canvas size and background
    if (canvas.width !== template.width || canvas.height !== template.height) {
      canvas.setWidth(template.width * zoom);
      canvas.setHeight(template.height * zoom);
    }
    canvas.backgroundColor = template.backgroundColor;

    // Handle background image
    if (template.backgroundImage && (!canvas.backgroundImage || canvas.backgroundImage._element?.src !== template.backgroundImage)) {
      loadFabricImage(template.backgroundImage, { crossOrigin: 'anonymous' })
        .then((img) => {
          img.scaleToWidth(template.width);
          img.scaleToHeight(template.height);
          canvas.backgroundImage = img;
          canvas.renderAll();
        })
        .catch((err) => {
          console.error('Failed to load background image:', err);
        });
    } else if (!template.backgroundImage && canvas.backgroundImage) {
      canvas.backgroundImage = null;
    }

    // Remove elements that no longer exist
    existingIds.forEach(id => {
      if (!currentElements.has(id)) {
        const obj = elementMapRef.current.get(id);
        if (obj) {
          canvas.remove(obj);
          elementMapRef.current.delete(id);
        }
      }
    });

    // Add or update elements
    const sortedElements = [...template.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    sortedElements.forEach(async (element, index) => {
      const existingObj = elementMapRef.current.get(element.id);
      
      if (existingObj) {
        // Update existing object
        updateFabricObject(existingObj, element);
        existingObj.moveTo(index);
      } else {
        // Create new object
        const newObj = await createFabricObject(element);
        if (newObj) {
          elementMapRef.current.set(element.id, newObj);
          canvas.add(newObj);
          newObj.moveTo(index);
        }
      }
    });

    canvas.renderAll();
  }, [template, isInitialized, zoom, updateFabricObject, createFabricObject]);

  // Handle zoom
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.setZoom(zoom);
    fabricRef.current.setWidth(template.width * zoom);
    fabricRef.current.setHeight(template.height * zoom);
    fabricRef.current.renderAll();
  }, [zoom, template.width, template.height]);

  // Handle selection from context
  useEffect(() => {
    if (!fabricRef.current || isUpdatingRef.current) return;
    
    if (selectedElementId) {
      const target = elementMapRef.current.get(selectedElementId);
      if (target && fabricRef.current.getActiveObject() !== target) {
        fabricRef.current.setActiveObject(target);
        fabricRef.current.renderAll();
      }
    } else {
      const currentActive = fabricRef.current.getActiveObject();
      if (currentActive) {
        fabricRef.current.discardActiveObject();
        fabricRef.current.renderAll();
      }
    }
  }, [selectedElementId]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-editor-canvas-bg overflow-auto flex items-center justify-center p-8"
    >
      <div 
        className="canvas-container bg-white shadow-2xl rounded-sm relative"
        style={{
          width: template.width * zoom,
          height: template.height * zoom,
          minWidth: template.width * zoom,
          minHeight: template.height * zoom,
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
