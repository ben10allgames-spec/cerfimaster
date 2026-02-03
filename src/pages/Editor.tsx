import React, { useState, useEffect } from 'react';
import { EditorProvider, useEditor } from '@/contexts/EditorContext';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { Canvas } from '@/components/editor/Canvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { DataPanel } from '@/components/editor/DataPanel';

function EditorContent() {
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(false);
  const { undo, redo } = useEditor();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
        if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

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
