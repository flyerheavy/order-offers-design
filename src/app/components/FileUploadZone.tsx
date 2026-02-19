import { useState, useRef } from 'react';
import { CloudUpload, File, X, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  uploadStatus?: 'pending' | 'uploaded' | 'none';
}

export function FileUploadZone({ uploadStatus = 'none' }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusMessage = () => {
    if (uploadStatus === 'pending') {
      return (
        <div className="flex items-center space-x-2 text-amber-600 mt-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Upload ausstehend</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-cyan-500 bg-cyan-50'
            : 'border-gray-300 bg-gray-50 hover:border-cyan-400 hover:bg-cyan-50/50'
        }`}
      >
        <CloudUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-700 mb-1">
          Dateien hier ablegen oder klicken zum Hochladen
        </p>
        <p className="text-sm text-gray-500">PDF, AI, INDD, PSD (max. 50MB)</p>
        {getStatusMessage()}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.ai,.indd,.psd"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
