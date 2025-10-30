'use client';

import React, { useState } from 'react';
import { PenTool, CheckCircle, AlertCircle, Loader2, Shield, Database, Wallet } from 'lucide-react';
import { useMetaMask } from '@/contexts/MetaMaskContext';
import { useContract } from '@/hooks/useContract';
import ConfirmDialog from '@/components/ConfirmDialog';

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
  const [success, setSuccess] = useState<string>('');
  const [confirmSignOpen, setConfirmSignOpen] = useState(false);
  const [confirmStoreOpen, setConfirmStoreOpen] = useState(false);

  // Firmar el documento
  const handleSignDocument = async () => {
    if (!isConnected || !currentWallet) {
      setError('Por favor conecta tu wallet primero');
      return;
    }

    if (!fileHash) {
      setError('No hay hash de archivo para firmar');
      return;
    }

    setError('');
    setSuccess('');
    setConfirmSignOpen(true);
  };

  const confirmSign = async () => {
    if (!currentWallet || !fileHash) return;
    setConfirmSignOpen(false);
    setIsSigning(true);
    try {
      const messageToSign = `Firmando documento: ${fileHash}`;
      const sig = await signMessage(messageToSign);
      setSignature(sig);
      setSuccess('Documento firmado exitosamente!');
    } catch (error) {
      console.error('Error firmando documento:', error);
      setError('Error al firmar el documento');
    } finally {
      setIsSigning(false);
    }
  };

  // Almacenar en blockchain
  const handleStoreOnBlockchain = async () => {
    if (!signature || !currentWallet) {
      setError('Por favor firma el documento primero');
      return;
    }

    setError('');
    setSuccess('');
    setConfirmStoreOpen(true);
  };

  const confirmStore = async () => {
    if (!currentWallet || !signature) return;
    setConfirmStoreOpen(false);
    setIsStoring(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const result = await storeDocumentHash(
        fileHash,
        timestamp,
        signature,
        currentWallet.address
      );
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setSuccess(`Documento almacenado exitosamente!\n\nHash de transacción: ${result.txHash}`);
      onDocumentStored(result.txHash);
      setSignature('');
    } catch (error) {
      const err = error as any;
      const reason = err?.message || err?.shortMessage || err?.reason || 'Error al almacenar el documento en blockchain';
      setError(reason);
    } finally {
      setIsStoring(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="card text-center py-12">
        <div className="p-4 bg-yellow-100 rounded-2xl w-fit mx-auto mb-6">
          <AlertCircle className="h-12 w-12 text-yellow-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Wallet Required</h3>
        <p className="text-gray-600">Por favor conecta tu wallet para firmar documentos</p>
      </div>
    );
  }

  if (!fileHash) {
    return (
      <div className="card text-center py-12">
        <div className="p-4 bg-blue-100 rounded-2xl w-fit mx-auto mb-6">
          <Shield className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No File Selected</h3>
        <p className="text-gray-600">Por favor selecciona un archivo para firmar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Information */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Document Information</h3>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">File Name</p>
              <p className="text-sm text-gray-900 truncate" title={fileName}>
                {fileName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Wallet</p>
              <p className="text-sm font-mono text-gray-900 break-all">
                {currentWallet?.address ? `${currentWallet.address.slice(0, 5)}...${currentWallet.address.slice(-5)}` : ''}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Document Hash</p>
            <div className="bg-gray-50 rounded-lg p-3 mt-1">
              <p className="text-xs font-mono text-gray-700 break-all">
                {fileHash}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Document */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <PenTool className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Sign Document</h3>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleSignDocument}
            disabled={isSigning || !fileHash}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            {isSigning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing...</span>
              </>
            ) : (
              <>
                <PenTool className="h-5 w-5" />
                <span>Sign Document</span>
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-500 mt-3">
            This will create a digital signature using your wallet's private key
          </p>
        </div>
      </div>

      {/* Signature Generated */}
      {signature && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Signature Generated</h3>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 mb-4">
            <p className="text-sm font-mono text-green-800 break-all leading-relaxed">
              {signature}
            </p>
          </div>

          {/* Store on Blockchain */}
          <div className="text-center">
            <button
              onClick={handleStoreOnBlockchain}
              disabled={isStoring}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 mx-auto"
            >
              {isStoring ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Storing on Blockchain...</span>
                </>
              ) : (
                <>
                  <Database className="h-5 w-5" />
                  <span>Store on Blockchain</span>
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-500 mt-3">
              This will permanently store the document on the Ethereum blockchain
            </p>
          </div>
        </div>
      )}

      {/* Confirmar firma */}
      <ConfirmDialog
        open={confirmSignOpen}
        title="Confirmar firma del documento"
        description={
          `${fileName ? `Archivo: ${fileName}\n` : ''}` +
          `Hash: ${fileHash}\n` +
          `Wallet: ${currentWallet?.address ? `${currentWallet.address.slice(0, 5)}...${currentWallet.address.slice(-5)}` : ''}`
        }
        confirmText="Firmar"
        cancelText="Cancelar"
        confirmStyle="success"
        onConfirm={confirmSign}
        onCancel={() => setConfirmSignOpen(false)}
      />

      {/* Confirmar almacenamiento */}
      <ConfirmDialog
        open={confirmStoreOpen}
        title="Confirmar almacenamiento en blockchain"
        description={
          `Este proceso costará gas y no se puede deshacer.\n\n` +
          `Hash: ${fileHash}\n` +
          `Firmante: ${currentWallet?.address ? `${currentWallet.address.slice(0, 5)}...${currentWallet.address.slice(-5)}` : ''}`
        }
        confirmText="Almacenar"
        cancelText="Cancelar"
        confirmStyle="primary"
        onConfirm={confirmStore}
        onCancel={() => setConfirmStoreOpen(false)}
      />
      {/* Success Message */}
      {success && (
        <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-xl flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-emerald-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Success!</p>
            <p className="text-sm text-emerald-800 whitespace-pre-line">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-rose-100 border-2 border-rose-400 p-4 rounded-xl flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-rose-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-900">Error</p>
            <p className="text-sm text-rose-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}