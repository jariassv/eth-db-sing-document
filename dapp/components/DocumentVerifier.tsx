'use client';

import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, Loader2, Shield, User, Clock, Hash, FileText } from 'lucide-react';
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
      setResult({
        isValid: false,
        document: null,
        error: 'Por favor selecciona un archivo primero'
      });
      return;
    }

    if (!signerAddress) {
      setResult({
        isValid: false,
        document: null,
        error: 'Por favor ingresa la dirección del firmante'
      });
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
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  return (
    <div className="space-y-8">
      {/* File Upload Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">1. Select File to Verify</h3>
        </div>
        <FileUploader onFileHash={handleFileHash} disabled={isVerifying} />
      </div>

      {/* Signer Address Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <User className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">2. Enter Signer Address</h3>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            value={signerAddress}
            onChange={(e) => setSignerAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-400"
            disabled={isVerifying}
          />
          <p className="text-sm text-gray-500">
            Enter the Ethereum address of the original signer of the document
          </p>
        </div>
      </div>

      {/* Verify Button */}
      <div className="text-center">
        <button
          onClick={handleVerifyDocument}
          disabled={!fileHash || !signerAddress || isVerifying}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 mx-auto"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Verify Document</span>
            </>
          )}
        </button>
      </div>

      {/* Verification Result */}
      {result && (
        <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 ${
          result.isValid ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-3 rounded-xl shadow-md ${
              result.isValid ? 'bg-emerald-500' : 'bg-rose-500'
            }`}>
              {result.isValid ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : (
                <XCircle className="h-6 w-6 text-white" />
              )}
            </div>
            <h3 className={`text-xl font-bold ${
              result.isValid ? 'text-emerald-900' : 'text-rose-900'
            }`}>
              {result.isValid ? '✅ Document VALID' : '❌ Document INVALID'}
            </h3>
          </div>

          {result.error && (
            <div className="bg-rose-100 border-2 border-rose-300 p-4 rounded-xl mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-rose-700" />
                <p className="text-sm font-semibold text-rose-900">{result.error}</p>
              </div>
            </div>
          )}

          {result.document && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Document Information</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">Document Hash</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <code className="text-xs font-mono text-gray-700 break-all">
                        {result.document.hash}
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">Signer Address</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <code className="text-sm font-mono text-gray-700 break-all">
                        {formatAddress(result.document.signer)}
                      </code>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">Signed Date</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        {formatTimestamp(result.document.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">Digital Signature</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <code className="text-xs font-mono text-gray-700 break-all">
                        {result.document.signature.slice(0, 40)}...
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}