import React, { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import fabricModule from 'fabric';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
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
  Sparkles,
  FileImage,
  FileText,
  Archive
} from 'lucide-react';
import { RecipientData, ColumnMapping } from '@/types/certificate';

// Normalize Fabric.js import
const fabric = ((fabricModule as any)?.fabric ?? fabricModule) as any;

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
  const [exportBothFormats, setExportBothFormats] = useState(false);

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

  // Generate clean filename from recipient data
  const generateFilename = (recipient: RecipientData, pattern: string): string => {
    let filename = pattern;
    columnMappings.forEach(mapping => {
      if (mapping.column) {
        const value = String(recipient[mapping.column] || '').trim();
        filename = filename.replace(
          new RegExp(`\\{\\{${mapping.placeholder}\\}\\}`, 'g'),
          value
        );
      }
    });
    // Clean filename - remove invalid characters
    return filename.replace(/[<>:"/\\|?*]/g, '_').trim() || 'certificate';
  };

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

  const generateCertificates = async () => {
    setStep('generate');
    setGenerationProgress({ current: 0, total: recipientData.length, status: 'generating' });

    const zip = new JSZip();
    const formats = exportBothFormats ? ['pdf', 'png'] : [exportSettings.format];

    for (let i = 0; i < recipientData.length; i++) {
      const recipient = recipientData[i];
      
      // Create a temporary canvas for generation
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

      // Add elements with replaced placeholders
      for (const element of sortedElements) {
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
            const textObj = new fabric.IText(text, {
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

      // Generate filename using recipient name
      const filename = generateFilename(recipient, exportSettings.namingPattern);

      // Export in each format
      for (const format of formats) {
        if (format === 'pdf') {
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
          
          if (exportBothFormats) {
            zip.folder('PDF')?.file(`${filename}.pdf`, pdfBlob);
          } else {
            zip.file(`${filename}.pdf`, pdfBlob);
          }
        } else {
          const dataUrl = canvas.toDataURL({
            format: format as 'png' | 'jpeg',
            quality: exportSettings.quality / 100,
            multiplier: 2,
          });
          const base64Data = dataUrl.split(',')[1];
          
          if (exportBothFormats) {
            zip.folder('Images')?.file(`${filename}.${format}`, base64Data, { base64: true });
          } else {
            zip.file(`${filename}.${format}`, base64Data, { base64: true });
          }
        }
      }

      setGenerationProgress({ 
        current: i + 1, 
        total: recipientData.length, 
        status: 'generating',
        message: `Processing: ${filename}` 
      });
    }

    // Download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipName = `${template.name.replace(/[<>:"/\\|?*]/g, '_')}-certificates.zip`;
    saveAs(zipBlob, zipName);

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
        <div className="flex items-center gap-2 p-4 bg-warning/10 border border-warning/30 rounded-lg text-warning-foreground">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">No Dynamic Fields Found</p>
            <p className="text-sm">Add placeholders like {'{{Name}}'} to your certificate first.</p>
          </div>
        </div>
      )}

      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          File Format Tips
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• First row should contain column headers</li>
          <li>• Include columns for: Name, Email, Course Name, Date, etc.</li>
          <li>• Supports .csv, .xlsx, and .xls formats</li>
          <li>• Files named using the "Name" column by default</li>
        </ul>
      </div>
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
        {mapping.column && <Check className="w-4 h-4 text-emerald-500" />}
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
        <h4 className="font-medium flex items-center gap-2">
          <Archive className="w-4 h-4" />
          Export Settings
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm flex items-center gap-2">
              {exportSettings.format === 'pdf' ? <FileText className="w-4 h-4" /> : <FileImage className="w-4 h-4" />}
              Format
            </Label>
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
                <SelectItem value="pdf">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF Document
                  </span>
                </SelectItem>
                <SelectItem value="png">
                  <span className="flex items-center gap-2">
                    <FileImage className="w-4 h-4" />
                    PNG Image
                  </span>
                </SelectItem>
                <SelectItem value="jpg">
                  <span className="flex items-center gap-2">
                    <FileImage className="w-4 h-4" />
                    JPG Image
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Quality</Label>
            <Select
              value={String(exportSettings.quality)}
              onValueChange={(value) => 
                setExportSettings({ ...exportSettings, quality: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">High (100%)</SelectItem>
                <SelectItem value="90">Medium (90%)</SelectItem>
                <SelectItem value="80">Standard (80%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
          <Checkbox 
            id="bothFormats" 
            checked={exportBothFormats}
            onCheckedChange={(checked) => setExportBothFormats(checked as boolean)}
          />
          <Label htmlFor="bothFormats" className="text-sm cursor-pointer">
            Export as both PDF and PNG (organized in folders)
          </Label>
        </div>

        <div>
          <Label className="text-sm">Filename Pattern</Label>
          <Input
            value={exportSettings.namingPattern}
            onChange={(e) => setExportSettings({ ...exportSettings, namingPattern: e.target.value })}
            placeholder="{{Name}}"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use placeholders like {'{{Name}}'} to name files after recipients
          </p>
        </div>

        {/* Preview filename */}
        {recipientData.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Preview: </span>
            <span className="font-mono bg-white px-2 py-1 rounded border">
              {generateFilename(recipientData[0], exportSettings.namingPattern)}.{exportSettings.format}
            </span>
          </div>
        )}
      </div>

      <Button 
        className="w-full gradient-primary text-primary-foreground" 
        size="lg"
        disabled={!isAllMapped}
        onClick={generateCertificates}
      >
        <Download className="w-4 h-4 mr-2" />
        Generate {recipientData.length} Certificates
        {exportBothFormats && ' (PDF + PNG)'}
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
          {generationProgress.message && (
            <p className="text-sm text-muted-foreground font-mono">
              {generationProgress.message}
            </p>
          )}
        </>
      ) : (
        <>
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-10 h-10 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Certificates Generated!</h3>
          <p className="text-muted-foreground">
            Your ZIP file with {generationProgress.total} certificates has been downloaded.
          </p>
          {exportBothFormats && (
            <p className="text-sm text-muted-foreground">
              Files are organized in PDF and Images folders.
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => {
              setStep('upload');
              setRecipientData([]);
              setColumnMappings([]);
              setExportBothFormats(false);
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
            Upload recipient data and generate personalized certificates named after each recipient
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && renderUploadStep()}
        {step === 'mapping' && renderMappingStep()}
        {step === 'generate' && renderGenerateStep()}
      </DialogContent>
    </Dialog>
  );
}
