'use client';

import React, { useState, useRef } from 'react';
import { Upload, File, Hash } from 'lucide-react';
import { ethers } from 'ethers';

interface FileUploaderProps {
  onFileHash: (hash: string, file: File) => void;
  disabled?: boolean;
}

export default function FileUploader({ onFileHash, disabled = false }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [calculatedHash, setCalculatedHash] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
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
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsCalculating(true);

    try {
      const hash = await calculateFileHash(file);
      setCalculatedHash(hash);
      onFileHash(hash, file);
    } catch (error) {
      console.error('Error calculando hash:', error);
      alert('Error calculando el hash del archivo');
    } finally {
      setIsCalculating(false);
    }
  };

  // Limpiar selección
  const clearFile = () => {
    setSelectedFile(null);
    setCalculatedHash('');
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
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          disabled={disabled || isCalculating}
          className="hidden"
          accept="*/*"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {isCalculating ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isCalculating}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isCalculating ? 'Calculando...' : 'Seleccionar Archivo'}
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            {isCalculating 
              ? 'Calculando hash del archivo...' 
              : 'Haz clic para seleccionar un archivo'
            }
          </p>
        </div>
      </div>

      {/* Información del archivo seleccionado */}
      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <File className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-gray-900">{selectedFile.name}</span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p>Tamaño: {formatFileSize(selectedFile.size)}</p>
            <p>Tipo: {selectedFile.type || 'Desconocido'}</p>
          </div>

          {/* Hash calculado */}
          {calculatedHash && (
            <div className="mt-3 p-3 bg-blue-50 rounded border">
              <div className="flex items-center space-x-2 mb-2">
                <Hash className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-900">Hash del archivo:</span>
              </div>
              <div className="text-xs font-mono text-blue-800 break-all">
                {calculatedHash}
              </div>
            </div>
          )}

          {/* Botón para limpiar */}
          <button
            onClick={clearFile}
            className="mt-3 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Limpiar selección
          </button>
        </div>
      )}
    </div>
  );
}
