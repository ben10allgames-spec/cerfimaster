import React, { useState, useEffect } from 'react';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { Canvas } from '@/components/editor/Canvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { DataPanel } from '@/components/editor/DataPanel';
import { toast } from 'sonner';

function EditorContent() {
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(false);
  const { 
    undo, 
    redo, 
    selectedElementId, 
    removeElement, 
    duplicateElement,
    updateElement,
    getSelectedElement,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    selectElement
  } = useEditor();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl/Cmd + Z
      if (ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if ((ctrlKey && e.key === 'z' && e.shiftKey) || (ctrlKey && e.key === 'y')) {
        e.preventDefault();
        redo();
        return;
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        removeElement(selectedElementId);
        toast.success('Element deleted');
        return;
      }

      // Duplicate: Ctrl/Cmd + D
      if (ctrlKey && e.key === 'd' && selectedElementId) {
        e.preventDefault();
        duplicateElement(selectedElementId);
        toast.success('Element duplicated');
        return;
      }

      // Copy: Ctrl/Cmd + C (just show toast for now)
      if (ctrlKey && e.key === 'c' && selectedElementId) {
        toast.info('Use Ctrl+D to duplicate elements');
        return;
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        selectElement(null);
        return;
      }

      // Arrow keys: Move selected element
      if (selectedElementId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const element = getSelectedElement();
        if (!element) return;

        const moveAmount = e.shiftKey ? 10 : 1;
        let newX = element.x;
        let newY = element.y;

        switch (e.key) {
          case 'ArrowUp': newY -= moveAmount; break;
          case 'ArrowDown': newY += moveAmount; break;
          case 'ArrowLeft': newX -= moveAmount; break;
          case 'ArrowRight': newX += moveAmount; break;
        }

        updateElement(selectedElementId, { x: newX, y: newY });
        return;
      }

      // Bring to front: Ctrl/Cmd + ]
      if (ctrlKey && e.key === ']' && selectedElementId) {
        e.preventDefault();
        bringForward(selectedElementId);
        return;
      }

      // Send to back: Ctrl/Cmd + [
      if (ctrlKey && e.key === '[' && selectedElementId) {
        e.preventDefault();
        sendBackward(selectedElementId);
        return;
      }

      // Bring to front: Ctrl/Cmd + Shift + ]
      if (ctrlKey && e.shiftKey && e.key === '}' && selectedElementId) {
        e.preventDefault();
        bringToFront(selectedElementId);
        return;
      }

      // Send to back: Ctrl/Cmd + Shift + [
      if (ctrlKey && e.shiftKey && e.key === '{' && selectedElementId) {
        e.preventDefault();
        sendToBack(selectedElementId);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedElementId, removeElement, duplicateElement, updateElement, getSelectedElement, bringToFront, sendToBack, bringForward, sendBackward, selectElement]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <EditorToolbar onOpenDataPanel={() => setIsDataPanelOpen(true)} />
      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
      <DataPanel 
        isOpen={isDataPanelOpen} 
        onClose={() => setIsDataPanelOpen(false)} 
      />
    </div>
  );
}

export default function Editor() {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
}
