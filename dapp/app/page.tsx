'use client';

import React, { useState } from 'react';
import { MetaMaskProvider, useMetaMask } from '@/contexts/MetaMaskContext';
import FileUploader from '@/components/FileUploader';
import DocumentSigner from '@/components/DocumentSigner';
import DocumentVerifier from '@/components/DocumentVerifier';
import DocumentHistory from '@/components/DocumentHistory';
import { Wallet, Upload, Search, History, ChevronDown } from 'lucide-react';

// Tabs disponibles
const tabs = [
  { id: 'upload', label: 'Upload & Sign', icon: Upload },
  { id: 'verify', label: 'Verify', icon: Search },
  { id: 'history', label: 'History', icon: History },
];

// Componente principal de la aplicación
function AppContent() {
  const { 
    isConnected, 
    currentWallet, 
    currentWalletIndex, 
    wallets, 
    connect, 
    disconnect, 
    switchWallet 
  } = useMetaMask();
  
  const [activeTab, setActiveTab] = useState('upload');
  const [fileHash, setFileHash] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  // Manejar hash del archivo
  const handleFileHash = (hash: string, file: File) => {
    setFileHash(hash);
    setFileName(file.name);
  };

  // Manejar documento almacenado
  const handleDocumentStored = (txHash: string) => {
    console.log('Documento almacenado:', txHash);
    // Aquí podrías mostrar una notificación o actualizar el estado
  };

  // Conectar a wallet
  const handleConnectWallet = (walletIndex: number) => {
    connect(walletIndex);
    setShowWalletSelector(false);
  };

  // Cambiar de wallet
  const handleSwitchWallet = (walletIndex: number) => {
    switchWallet(walletIndex);
    setShowWalletSelector(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Título */}
            <div className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900">ETH Document Registry</h1>
            </div>

            {/* Selector de Wallet */}
            <div className="relative">
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  {/* Información de la wallet actual */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Wallet {currentWalletIndex}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentWallet?.address.slice(0, 6)}...{currentWallet?.address.slice(-4)}
                    </p>
                  </div>

                  {/* Botón para cambiar wallet */}
                  <button
                    onClick={() => setShowWalletSelector(!showWalletSelector)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1"
                  >
                    <span>Cambiar</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Botón desconectar */}
                  <button
                    onClick={disconnect}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Desconectar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowWalletSelector(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Conectar Wallet
                </button>
              )}

              {/* Dropdown de wallets */}
              {showWalletSelector && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      {isConnected ? 'Cambiar Wallet' : 'Seleccionar Wallet'}
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {wallets.map((wallet, index) => (
                        <button
                          key={index}
                          onClick={() => isConnected ? handleSwitchWallet(index) : handleConnectWallet(index)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            currentWalletIndex === index
                              ? 'bg-blue-50 border-blue-200'
                              : 'hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Wallet {index}</p>
                              <p className="text-sm text-gray-500">
                                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                              </p>
                            </div>
                            {currentWalletIndex === index && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navegación por tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Firmar Documento</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Sube un archivo, calcúlale su hash criptográfico y fírmalo digitalmente para almacenarlo en la blockchain
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subir archivo */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">1. Seleccionar Archivo</h3>
                <FileUploader onFileHash={handleFileHash} />
              </div>

              {/* Firmar documento */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">2. Firmar y Almacenar</h3>
                <DocumentSigner
                  fileHash={fileHash}
                  fileName={fileName}
                  onDocumentStored={handleDocumentStored}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verify' && (
          <DocumentVerifier />
        )}

        {activeTab === 'history' && (
          <DocumentHistory />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>ETH Document Registry - Almacenamiento seguro de documentos en blockchain</p>
            <p className="mt-1">Desarrollado con Solidity, Foundry, Next.js y Ethers.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente principal con provider
export default function Home() {
  return (
    <MetaMaskProvider>
      <AppContent />
    </MetaMaskProvider>
  );
}