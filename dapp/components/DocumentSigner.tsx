'use client';

import React, { useState } from 'react';
import { PenTool, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useMetaMask } from '@/contexts/MetaMaskContext';
import { useContract } from '@/hooks/useContract';

interface DocumentSignerProps {
  fileHash: string;
  fileName: string;
  onDocumentStored: (txHash: string) => void;
}

export default function DocumentSigner({ fileHash, fileName, onDocumentStored }: DocumentSignerProps) {
  const { signMessage, currentWallet, isConnected } = useMetaMask();
  const { storeDocumentHash } = useContract();
  
  const [signature, setSignature] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  const [isStoring, setIsStoring] = useState(false);
  const [error, setError] = useState<string>('');

  // Firmar el documento
  const handleSignDocument = async () => {
    if (!isConnected || !currentWallet) {
      alert('Por favor conecta tu wallet primero');
      return;
    }

    if (!fileHash) {
      alert('No hay hash de archivo para firmar');
      return;
    }

    setIsSigning(true);
    setError('');

    try {
      // Crear mensaje a firmar (hash del documento)
      const messageToSign = `Firmando documento: ${fileHash}`;
      
      // Mostrar confirmación
      const confirmed = window.confirm(
        `¿Estás seguro de que quieres firmar este documento?\n\n` +
        `Archivo: ${fileName}\n` +
        `Hash: ${fileHash}\n` +
        `Wallet: ${currentWallet.address}`
      );

      if (!confirmed) {
        setIsSigning(false);
        return;
      }

      // Firmar el mensaje
      const sig = await signMessage(messageToSign);
      setSignature(sig);
      
      alert('Documento firmado exitosamente!');
    } catch (error) {
      console.error('Error firmando documento:', error);
      setError('Error al firmar el documento');
      alert('Error al firmar el documento');
    } finally {
      setIsSigning(false);
    }
  };

  // Almacenar en blockchain
  const handleStoreOnBlockchain = async () => {
    if (!signature || !currentWallet) {
      alert('Por favor firma el documento primero');
      return;
    }

    setIsStoring(true);
    setError('');

    try {
      // Mostrar confirmación
      const confirmed = window.confirm(
        `¿Estás seguro de que quieres almacenar este documento en la blockchain?\n\n` +
        `Esto costará gas y no se puede deshacer.\n\n` +
        `Hash: ${fileHash}\n` +
        `Firmante: ${currentWallet.address}`
      );

      if (!confirmed) {
        setIsStoring(false);
        return;
      }

      // Obtener timestamp actual
      const timestamp = Math.floor(Date.now() / 1000);

      // Almacenar en blockchain
      const result = await storeDocumentHash(
        fileHash,
        timestamp,
        signature,
        currentWallet.address
      );

      alert(`Documento almacenado exitosamente!\n\nHash de transacción: ${result.txHash}`);
      onDocumentStored(result.txHash);
      
      // Limpiar estado
      setSignature('');
    } catch (error) {
      console.error('Error almacenando documento:', error);
      setError('Error al almacenar el documento en blockchain');
      alert('Error al almacenar el documento en blockchain');
    } finally {
      setIsStoring(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">Por favor conecta tu wallet para firmar documentos</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Información del documento */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Documento a firmar</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Archivo:</strong> {fileName}</p>
          <p><strong>Hash:</strong> <code className="text-xs bg-gray-200 px-1 rounded">{fileHash}</code></p>
          <p><strong>Wallet:</strong> {currentWallet?.address}</p>
        </div>
      </div>

      {/* Botón de firma */}
      <div className="text-center">
        <button
          onClick={handleSignDocument}
          disabled={isSigning || !fileHash}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
        >
          {isSigning ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Firmando...</span>
            </>
          ) : (
            <>
              <PenTool className="h-5 w-5" />
              <span>Firmar Documento</span>
            </>
          )}
        </button>
      </div>

      {/* Firma generada */}
      {signature && (
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-900">Documento firmado exitosamente</span>
          </div>
          
          <div className="text-sm text-green-800">
            <p className="mb-2"><strong>Firma generada:</strong></p>
            <code className="text-xs bg-green-100 px-2 py-1 rounded break-all block">
              {signature}
            </code>
          </div>

          {/* Botón para almacenar en blockchain */}
          <div className="mt-4 text-center">
            <button
              onClick={handleStoreOnBlockchain}
              disabled={isStoring}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              {isStoring ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Almacenando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Almacenar en Blockchain</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
