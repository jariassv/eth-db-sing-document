'use client';

import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { ethers } from 'ethers';
import { useContract } from '@/hooks/useContract';
import FileUploader from './FileUploader';

interface VerificationResult {
  isValid: boolean;
  document: {
    hash: string;
    timestamp: number;
    signer: string;
    signature: string;
  } | null;
  error?: string;
}

export default function DocumentVerifier() {
  const { verifyDocument, getDocumentInfo, isDocumentStored } = useContract();
  
  const [fileHash, setFileHash] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [signerAddress, setSignerAddress] = useState<string>('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Manejar hash del archivo
  const handleFileHash = (hash: string, file: File) => {
    setFileHash(hash);
    setFileName(file.name);
    setResult(null);
  };

  // Verificar documento
  const handleVerifyDocument = async () => {
    if (!fileHash) {
      alert('Por favor selecciona un archivo primero');
      return;
    }

    if (!signerAddress) {
      alert('Por favor ingresa la dirección del firmante');
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      // Verificar si el documento está almacenado
      const isStored = await isDocumentStored(fileHash);
      
      if (!isStored) {
        setResult({
          isValid: false,
          document: null,
          error: 'Documento no encontrado en la blockchain'
        });
        return;
      }

      // Obtener información del documento
      const documentInfo = await getDocumentInfo(fileHash);
      
      // Verificar si el firmante coincide
      const signerMatches = documentInfo.signer.toLowerCase() === signerAddress.toLowerCase();
      
      if (!signerMatches) {
        setResult({
          isValid: false,
          document: documentInfo,
          error: 'El firmante no coincide con la dirección proporcionada'
        });
        return;
      }

      // Verificar la firma (opcional - el contrato ya lo hace)
      const isValid = await verifyDocument(fileHash, signerAddress, documentInfo.signature);
      
      setResult({
        isValid,
        document: documentInfo,
        error: isValid ? undefined : 'La verificación de la firma falló'
      });

    } catch (error) {
      console.error('Error verificando documento:', error);
      setResult({
        isValid: false,
        document: null,
        error: 'Error al verificar el documento'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Formatear timestamp
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Formatear dirección
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificar Documento</h2>
        <p className="text-gray-600">Sube un archivo y verifica su autenticidad en la blockchain</p>
      </div>

      {/* Subir archivo */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-medium text-gray-900 mb-4">1. Seleccionar archivo</h3>
        <FileUploader onFileHash={handleFileHash} disabled={isVerifying} />
      </div>

      {/* Dirección del firmante */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-medium text-gray-900 mb-4">2. Dirección del firmante</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={signerAddress}
            onChange={(e) => setSignerAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isVerifying}
          />
          <p className="text-sm text-gray-500">
            Ingresa la dirección Ethereum del firmante original del documento
          </p>
        </div>
      </div>

      {/* Botón de verificación */}
      <div className="text-center">
        <button
          onClick={handleVerifyDocument}
          disabled={!fileHash || !signerAddress || isVerifying}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
        >
          {isVerifying ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Verificando...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Verificar Documento</span>
            </>
          )}
        </button>
      </div>

      {/* Resultado de verificación */}
      {result && (
        <div className={`rounded-lg p-6 ${
          result.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            {result.isValid ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-lg font-medium text-green-900">✅ Documento VÁLIDO</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                <span className="text-lg font-medium text-red-900">❌ Documento INVÁLIDO</span>
              </>
            )}
          </div>

          {result.error && (
            <div className="mb-4 p-3 bg-red-100 rounded border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-800">{result.error}</span>
              </div>
            </div>
          )}

          {result.document && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Información del documento:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Hash:</span>
                  <code className="block mt-1 text-xs bg-gray-100 px-2 py-1 rounded break-all">
                    {result.document.hash}
                  </code>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Firmante:</span>
                  <code className="block mt-1 text-xs bg-gray-100 px-2 py-1 rounded">
                    {formatAddress(result.document.signer)}
                  </code>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Fecha de firma:</span>
                  <span className="block mt-1">{formatTimestamp(result.document.timestamp)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Firma:</span>
                  <code className="block mt-1 text-xs bg-gray-100 px-2 py-1 rounded break-all">
                    {result.document.signature.slice(0, 20)}...
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
