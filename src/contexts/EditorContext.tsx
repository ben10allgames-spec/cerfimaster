import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CertificateTemplate, CertificateElement, PAGE_SIZES, RecipientData, ColumnMapping, GenerationProgress, ExportSettings } from '@/types/certificate';
import { v4 as uuidv4 } from 'uuid';

interface EditorState {
  template: CertificateTemplate;
  selectedElementId: string | null;
  history: CertificateTemplate[];
  historyIndex: number;
  zoom: number;
  recipientData: RecipientData[];
  columnMappings: ColumnMapping[];
  generationProgress: GenerationProgress;
  exportSettings: ExportSettings;
}

interface EditorContextType extends EditorState {
  setTemplate: (template: CertificateTemplate) => void;
  updateTemplate: (updates: Partial<CertificateTemplate>) => void;
  addElement: (element: Omit<CertificateElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<CertificateElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  getSelectedElement: () => CertificateElement | undefined;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setZoom: (zoom: number) => void;
  setRecipientData: (data: RecipientData[]) => void;
  setColumnMappings: (mappings: ColumnMapping[]) => void;
  setGenerationProgress: (progress: GenerationProgress) => void;
  setExportSettings: (settings: ExportSettings) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  resetEditor: () => void;
}

const defaultTemplate: CertificateTemplate = {
  id: uuidv4(),
  name: 'Untitled Certificate',
  width: PAGE_SIZES[0].width,
  height: PAGE_SIZES[0].height,
  backgroundColor: '#ffffff',
  elements: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultState: EditorState = {
  template: defaultTemplate,
  selectedElementId: null,
  history: [defaultTemplate],
  historyIndex: 0,
  zoom: 1,
  recipientData: [],
  columnMappings: [],
  generationProgress: { current: 0, total: 0, status: 'idle' },
  exportSettings: { format: 'pdf', quality: 100, namingPattern: '{{Name}}' },
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditorState>(defaultState);

  const pushToHistory = useCallback((template: CertificateTemplate) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(template);
      return {
        ...prev,
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49),
      };
    });
  }, []);

  const setTemplate = useCallback((template: CertificateTemplate) => {
    setState(prev => ({ ...prev, template }));
    pushToHistory(template);
  }, [pushToHistory]);

  const updateTemplate = useCallback((updates: Partial<CertificateTemplate>) => {
    setState(prev => {
      const newTemplate = { ...prev.template, ...updates, updatedAt: new Date() };
      return { ...prev, template: newTemplate };
    });
  }, []);

  const addElement = useCallback((element: Omit<CertificateElement, 'id'>) => {
    const newElement: CertificateElement = {
      ...element,
      id: uuidv4(),
      zIndex: state.template.elements.length,
    };
    setState(prev => {
      const newTemplate = {
        ...prev.template,
        elements: [...prev.template.elements, newElement],
        updatedAt: new Date(),
      };
      pushToHistory(newTemplate);
      return { ...prev, template: newTemplate, selectedElementId: newElement.id };
    });
  }, [state.template.elements.length, pushToHistory]);

  const updateElement = useCallback((id: string, updates: Partial<CertificateElement>) => {
    setState(prev => {
      const newElements = prev.template.elements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      );
      const newTemplate = { ...prev.template, elements: newElements, updatedAt: new Date() };
      return { ...prev, template: newTemplate };
    });
  }, []);

  const removeElement = useCallback((id: string) => {
    setState(prev => {
      const newElements = prev.template.elements.filter(el => el.id !== id);
      const newTemplate = { ...prev.template, elements: newElements, updatedAt: new Date() };
      pushToHistory(newTemplate);
      return {
        ...prev,
        template: newTemplate,
        selectedElementId: prev.selectedElementId === id ? null : prev.selectedElementId,
      };
    });
  }, [pushToHistory]);

  const duplicateElement = useCallback((id: string) => {
    const element = state.template.elements.find(el => el.id === id);
    if (element) {
      const newElement: CertificateElement = {
        ...element,
        id: uuidv4(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: state.template.elements.length,
      };
      setState(prev => {
        const newTemplate = {
          ...prev.template,
          elements: [...prev.template.elements, newElement],
          updatedAt: new Date(),
        };
        pushToHistory(newTemplate);
        return { ...prev, template: newTemplate, selectedElementId: newElement.id };
      });
    }
  }, [state.template.elements, pushToHistory]);

  const selectElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedElementId: id }));
  }, []);

  const getSelectedElement = useCallback(() => {
    return state.template.elements.find(el => el.id === state.selectedElementId);
  }, [state.template.elements, state.selectedElementId]);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          template: prev.history[newIndex],
          historyIndex: newIndex,
          selectedElementId: null,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          template: prev.history[newIndex],
          historyIndex: newIndex,
          selectedElementId: null,
        };
      }
      return prev;
    });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.25, Math.min(2, zoom)) }));
  }, []);

  const setRecipientData = useCallback((data: RecipientData[]) => {
    setState(prev => ({ ...prev, recipientData: data }));
  }, []);

  const setColumnMappings = useCallback((mappings: ColumnMapping[]) => {
    setState(prev => ({ ...prev, columnMappings: mappings }));
  }, []);

  const setGenerationProgress = useCallback((progress: GenerationProgress) => {
    setState(prev => ({ ...prev, generationProgress: progress }));
  }, []);

  const setExportSettings = useCallback((settings: ExportSettings) => {
    setState(prev => ({ ...prev, exportSettings: settings }));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setState(prev => {
      const maxZ = Math.max(...prev.template.elements.map(el => el.zIndex || 0));
      const newElements = prev.template.elements.map(el =>
        el.id === id ? { ...el, zIndex: maxZ + 1 } : el
      );
      const newTemplate = { ...prev.template, elements: newElements };
      return { ...prev, template: newTemplate };
    });
  }, []);

  const sendToBack = useCallback((id: string) => {
    setState(prev => {
      const minZ = Math.min(...prev.template.elements.map(el => el.zIndex || 0));
      const newElements = prev.template.elements.map(el =>
        el.id === id ? { ...el, zIndex: minZ - 1 } : el
      );
      const newTemplate = { ...prev.template, elements: newElements };
      return { ...prev, template: newTemplate };
    });
  }, []);

  const bringForward = useCallback((id: string) => {
    setState(prev => {
      const element = prev.template.elements.find(el => el.id === id);
      if (!element) return prev;
      const newElements = prev.template.elements.map(el =>
        el.id === id ? { ...el, zIndex: (el.zIndex || 0) + 1 } : el
      );
      const newTemplate = { ...prev.template, elements: newElements };
      return { ...prev, template: newTemplate };
    });
  }, []);

  const sendBackward = useCallback((id: string) => {
    setState(prev => {
      const element = prev.template.elements.find(el => el.id === id);
      if (!element) return prev;
      const newElements = prev.template.elements.map(el =>
        el.id === id ? { ...el, zIndex: Math.max(0, (el.zIndex || 0) - 1) } : el
      );
      const newTemplate = { ...prev.template, elements: newElements };
      return { ...prev, template: newTemplate };
    });
  }, []);

  const resetEditor = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        ...state,
        setTemplate,
        updateTemplate,
        addElement,
        updateElement,
        removeElement,
        duplicateElement,
        selectElement,
        getSelectedElement,
        undo,
        redo,
        canUndo: state.historyIndex > 0,
        canRedo: state.historyIndex < state.history.length - 1,
        setZoom,
        setRecipientData,
        setColumnMappings,
        setGenerationProgress,
        setExportSettings,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward,
        resetEditor,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
