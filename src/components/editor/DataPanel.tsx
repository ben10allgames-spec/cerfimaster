import React, { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { StaticCanvas, FabricText, FabricImage, Circle, Rect, Line } from 'fabric';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Upload, 
  FileSpreadsheet, 
  Check, 
  AlertCircle,
  Download,
  Sparkles
} from 'lucide-react';
import { RecipientData, ColumnMapping } from '@/types/certificate';

interface DataPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DataPanel({ isOpen, onClose }: DataPanelProps) {
  const { 
    template, 
    recipientData, 
    setRecipientData,
    columnMappings,
    setColumnMappings,
    generationProgress,
    setGenerationProgress,
    exportSettings,
    setExportSettings
  } = useEditor();

  const [step, setStep] = useState<'upload' | 'mapping' | 'generate'>('upload');
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get placeholders from template
  const placeholders = template.elements
    .filter(el => el.type === 'placeholder' && el.placeholderKey)
    .map(el => el.placeholderKey!);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<RecipientData>(sheet);

        if (jsonData.length === 0) {
          setError('The file appears to be empty');
          return;
        }

        const cols = Object.keys(jsonData[0]);
        setColumns(cols);
        setRecipientData(jsonData);

        // Auto-map columns if names match placeholders
        const autoMappings: ColumnMapping[] = placeholders.map(placeholder => {
          const matchingCol = cols.find(col => 
            col.toLowerCase().replace(/[_\s]/g, '') === 
            placeholder.toLowerCase().replace(/[_\s]/g, '')
          );
          return {
            placeholder,
            column: matchingCol || '',
          };
        });
        setColumnMappings(autoMappings);
        setStep('mapping');
      } catch {
        setError('Failed to parse file. Please upload a valid CSV or Excel file.');
      }
    };

    reader.readAsBinaryString(file);
  }, [placeholders, setRecipientData, setColumnMappings]);

  const handleMappingChange = (placeholder: string, column: string) => {
    setColumnMappings(
      columnMappings.map(m => 
        m.placeholder === placeholder ? { ...m, column } : m
      )
    );
  };

  const isAllMapped = columnMappings.every(m => m.column !== '');

  const generateCertificates = async () => {
    setStep('generate');
    setGenerationProgress({ current: 0, total: recipientData.length, status: 'generating' });

    const zip = new JSZip();

    for (let i = 0; i < recipientData.length; i++) {
      const recipient = recipientData[i];
      
      // Create a temporary canvas for generation
      const canvas = new StaticCanvas(undefined, {
        width: template.width,
        height: template.height,
        backgroundColor: template.backgroundColor,
      });

      // Add background image if exists
      if (template.backgroundImage) {
        try {
          const img = await FabricImage.fromURL(template.backgroundImage);
          img.scaleToWidth(template.width);
          img.scaleToHeight(template.height);
          canvas.backgroundImage = img;
        } catch {
          // Ignore background image errors
        }
      }

      // Add elements with replaced placeholders
      for (const element of template.elements) {
        let text = element.text || '';
        
        // Replace placeholders with actual data
        if (element.type === 'placeholder' && element.placeholderKey) {
          const mapping = columnMappings.find(m => m.placeholder === element.placeholderKey);
          if (mapping && mapping.column) {
            text = String(recipient[mapping.column] || '');
          }
        }

        switch (element.type) {
          case 'text':
          case 'placeholder':
            const textObj = new FabricText(text, {
              left: element.x,
              top: element.y,
              fontFamily: element.fontFamily || 'Inter',
              fontSize: element.fontSize || 24,
              fontWeight: element.fontWeight as string || 'normal',
              fontStyle: element.fontStyle as 'normal' | 'italic' | 'oblique' || 'normal',
              fill: element.fill || '#000000',
              textAlign: element.textAlign as 'left' | 'center' | 'right' || 'left',
            });
            canvas.add(textObj);
            break;

          case 'shape':
            if (element.shapeType === 'circle') {
              const circle = new Circle({
                left: element.x,
                top: element.y,
                radius: Math.min(element.width || 100, element.height || 100) / 2,
                fill: element.fill || '#e2e8f0',
                stroke: element.stroke || '#94a3b8',
                strokeWidth: element.strokeWidth || 1,
              });
              canvas.add(circle);
            } else {
              const rect = new Rect({
                left: element.x,
                top: element.y,
                width: element.width || 100,
                height: element.height || 100,
                fill: element.fill || '#e2e8f0',
                stroke: element.stroke || '#94a3b8',
                strokeWidth: element.strokeWidth || 1,
                rx: 4,
                ry: 4,
              });
              canvas.add(rect);
            }
            break;

          case 'line':
            const line = new Line([0, 0, element.width || 200, 0], {
              left: element.x,
              top: element.y,
              stroke: element.fill || '#000000',
              strokeWidth: element.strokeWidth || 2,
            });
            canvas.add(line);
            break;

          case 'image':
            if (element.src) {
              try {
                const img = await FabricImage.fromURL(element.src, { crossOrigin: 'anonymous' });
                img.set({
                  left: element.x,
                  top: element.y,
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

      // Generate filename from naming pattern
      let filename = exportSettings.namingPattern;
      columnMappings.forEach(mapping => {
        if (mapping.column) {
          filename = filename.replace(
            new RegExp(`\\{\\{${mapping.placeholder}\\}\\}`, 'g'),
            String(recipient[mapping.column] || '')
          );
        }
      });

      // Export based on format
      if (exportSettings.format === 'pdf') {
        const dataUrl = canvas.toDataURL({
          format: 'png',
          quality: exportSettings.quality / 100,
          multiplier: 2,
        });

        const pdf = new jsPDF({
          orientation: template.width > template.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [template.width, template.height],
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, template.width, template.height);
        const pdfBlob = pdf.output('blob');
        zip.file(`${filename}.pdf`, pdfBlob);
      } else {
        const dataUrl = canvas.toDataURL({
          format: exportSettings.format,
          quality: exportSettings.quality / 100,
          multiplier: 2,
        });
        const base64Data = dataUrl.split(',')[1];
        zip.file(`${filename}.${exportSettings.format}`, base64Data, { base64: true });
      }

      setGenerationProgress({ 
        current: i + 1, 
        total: recipientData.length, 
        status: 'generating' 
      });
    }

    // Download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${template.name}-certificates.zip`);

    setGenerationProgress({ 
      current: recipientData.length, 
      total: recipientData.length, 
      status: 'complete' 
    });
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload Recipient Data</h3>
        <p className="text-muted-foreground mb-4">
          Upload a CSV or Excel file with recipient information
        </p>
        <Input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="max-w-xs mx-auto"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {placeholders.length === 0 && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">No Dynamic Fields Found</p>
            <p className="text-sm">Add placeholders like {'{{Name}}'} to your certificate first.</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderMappingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Map Columns to Placeholders</h3>
          <p className="text-sm text-muted-foreground">
            {recipientData.length} recipients found
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setStep('upload')}>
          Change File
        </Button>
      </div>

      {/* Column Mapping */}
      <div className="space-y-3">
        {columnMappings.map((mapping) => (
          <div key={mapping.placeholder} className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm bg-primary/10 px-2 py-1 rounded">
                {`{{${mapping.placeholder}}}`}
              </span>
            </div>
            <span className="text-muted-foreground">→</span>
            <Select
              value={mapping.column}
              onValueChange={(value) => handleMappingChange(mapping.placeholder, value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {mapping.column && <Check className="w-4 h-4 text-green-500" />}
          </div>
        ))}
      </div>

      {/* Preview Table */}
      <div>
        <Label className="text-sm text-muted-foreground mb-2 block">Data Preview (first 5 rows)</Label>
        <div className="border rounded-lg overflow-auto max-h-48">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className="whitespace-nowrap">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipientData.slice(0, 5).map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col} className="whitespace-nowrap">
                      {String(row[col] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Export Settings */}
      <div className="space-y-4 p-4 bg-muted rounded-lg">
        <h4 className="font-medium">Export Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Format</Label>
            <Select
              value={exportSettings.format}
              onValueChange={(value: 'pdf' | 'png' | 'jpg') => 
                setExportSettings({ ...exportSettings, format: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Filename Pattern</Label>
            <Input
              value={exportSettings.namingPattern}
              onChange={(e) => setExportSettings({ ...exportSettings, namingPattern: e.target.value })}
              placeholder="{{Name}}"
            />
          </div>
        </div>
      </div>

      <Button 
        className="w-full gradient-primary text-primary-foreground" 
        size="lg"
        disabled={!isAllMapped}
        onClick={generateCertificates}
      >
        <Download className="w-4 h-4 mr-2" />
        Generate {recipientData.length} Certificates
      </Button>
    </div>
  );

  const renderGenerateStep = () => (
    <div className="space-y-6 text-center py-8">
      {generationProgress.status === 'generating' ? (
        <>
          <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Generating Certificates...</h3>
          <Progress 
            value={(generationProgress.current / generationProgress.total) * 100} 
            className="max-w-md mx-auto"
          />
          <p className="text-muted-foreground">
            {generationProgress.current} of {generationProgress.total} completed
          </p>
        </>
      ) : (
        <>
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-10 h-10 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Certificates Generated!</h3>
          <p className="text-muted-foreground">
            Your ZIP file with {generationProgress.total} certificates has been downloaded.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => {
              setStep('upload');
              setRecipientData([]);
              setColumnMappings([]);
            }}>
              Generate More
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Bulk Certificate Generation
          </DialogTitle>
          <DialogDescription>
            Upload recipient data and generate personalized certificates
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && renderUploadStep()}
        {step === 'mapping' && renderMappingStep()}
        {step === 'generate' && renderGenerateStep()}
      </DialogContent>
    </Dialog>
  );
}
