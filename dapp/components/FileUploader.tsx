'use client';

import React, { useState, useRef } from 'react';
import { Upload, File, Hash, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { ethers } from 'ethers';

interface FileUploaderProps {
  onFileHash: (hash: string, file: File) => void;
  disabled?: boolean;
}

export default function FileUploader({ onFileHash, disabled = false }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [calculatedHash, setCalculatedHash] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calcular hash del archivo
  const calculateFileHash = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Convertir a string para calcular keccak256
          const fileContent = Array.from(uint8Array)
            .map(byte => String.fromCharCode(byte))
            .join('');
          
          // Calcular hash keccak256
          const hash = ethers.keccak256(ethers.toUtf8Bytes(fileContent));
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Manejar selección de archivo
  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setSelectedFile(file);
    setIsCalculating(true);
    setError('');

    try {
      const hash = await calculateFileHash(file);
      setCalculatedHash(hash);
      onFileHash(hash, file);
    } catch (error) {
      console.error('Error calculando hash:', error);
      setError('Error calculando el hash del archivo. Por favor, inténtalo de nuevo.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Manejar input de archivo
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Manejar drag and drop
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Limpiar selección
  const clearFile = () => {
    setSelectedFile(null);
    setCalculatedHash('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          isCalculating
            ? "border-blue-300 bg-blue-50"
            : selectedFile
            ? "border-green-300 bg-green-50"
            : isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          disabled={disabled || isCalculating}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="*/*"
        />
        
        <div className="space-y-4">
          {isCalculating ? (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <p className="text-lg font-medium text-blue-600">Calculating hash...</p>
              <p className="text-sm text-blue-500">Please wait while we process your file</p>
            </div>
          ) : selectedFile ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-600">File uploaded successfully!</p>
              <p className="text-sm text-green-500">Hash calculated and ready for signing</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-gray-100 rounded-full">
                <Upload className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Drop your file here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isCalculating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Select File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-100 border-2 border-rose-400 p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-rose-700" />
          <p className="text-sm font-semibold text-rose-900">{error}</p>
        </div>
      )}

      {/* File Information */}
      {selectedFile && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <File className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">File Information</h3>
            </div>
            <button
              onClick={clearFile}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900 truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Size</p>
              <p className="text-sm text-gray-900">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-sm text-gray-900">
                {selectedFile.type || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hash Display */}
      {calculatedHash && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Hash className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Document Hash</h3>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-mono text-gray-700 break-all leading-relaxed">
              {calculatedHash}
            </p>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            This is the Keccak256 hash of your file. It will be used to verify the document's integrity and authenticity on the blockchain.
          </p>
        </div>
      )}
    </div>
  );
}