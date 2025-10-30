'use client';

import React, { useState } from 'react';
import { MetaMaskProvider, useMetaMask } from '@/contexts/MetaMaskContext';
import FileUploader from '@/components/FileUploader';
import DocumentSigner from '@/components/DocumentSigner';
import DocumentVerifier from '@/components/DocumentVerifier';
import DocumentHistory from '@/components/DocumentHistory';
import { Shield, Wallet, Upload, Search, History, ChevronDown, LogOut, RefreshCw, CheckCircle } from 'lucide-react';

// Tabs disponibles
const tabs = [
  { id: 'upload', label: 'Upload & Sign', icon: Upload, description: 'Upload and sign documents' },
  { id: 'verify', label: 'Verify', icon: Search, description: 'Verify document authenticity' },
  { id: 'history', label: 'History', icon: History, description: 'View document history' },
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Título */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ETH Document Registry
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Blockchain Document Authentication
                </p>
              </div>
            </div>

            {/* Wallet Controls */}
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  {/* Wallet Info Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 min-w-0 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-xl">
                        <Wallet className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                          Wallet {currentWalletIndex}
                        </p>
                        <p className="text-sm font-mono text-gray-900 truncate max-w-32">
                          {currentWallet?.address}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowWalletSelector(!showWalletSelector)}
                      className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 p-3"
                      title="Cambiar Wallet"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={disconnect}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 p-3"
                      title="Desconectar"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowWalletSelector(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                >
                  <Wallet className="h-5 w-5" />
                  <span>Conectar Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Wallet Selector Dropdown */}
      {showWalletSelector && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setShowWalletSelector(false)}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {isConnected ? 'Cambiar Wallet' : 'Seleccionar Wallet'}
                </h3>
                <button
                  onClick={() => setShowWalletSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {wallets.map((wallet, index) => (
                  <button
                    key={index}
                    onClick={() => isConnected ? handleSwitchWallet(index) : handleConnectWallet(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      currentWalletIndex === index
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          currentWalletIndex === index ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Wallet className={`h-4 w-4 ${
                            currentWalletIndex === index ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Wallet {index}</p>
                          <p className="text-sm text-gray-500 font-mono">
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                          </p>
                        </div>
                      </div>
                      {currentWalletIndex === index && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl w-fit mx-auto mb-6">
                <Upload className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Upload & Sign Document
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Upload your document, generate its cryptographic hash, and sign it digitally to store on the blockchain for permanent verification and authenticity.
              </p>
            </div>

            {/* Upload and Sign Process */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Step 1: File Upload */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <span className="text-blue-600 font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Select File</h3>
                </div>
                <FileUploader onFileHash={handleFileHash} />
              </div>

              {/* Step 2: Sign Document */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <span className="text-purple-600 font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Sign & Store</h3>
                </div>
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
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl w-fit mx-auto mb-6">
                <Search className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Verify Document
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Verify the authenticity of a document by comparing its hash and signature with the blockchain records to ensure it hasn't been tampered with.
              </p>
            </div>
            <DocumentVerifier />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl w-fit mx-auto mb-6">
                <History className="h-12 w-12 text-purple-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Document History
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                View all documents stored on the blockchain with their details, verification status, and complete audit trail.
              </p>
            </div>
            <DocumentHistory />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">ETH Document Registry</span>
            </div>
            <p className="text-gray-600 mb-2">
              Secure blockchain document authentication and verification
            </p>
            <p className="text-sm text-gray-500">
              Built with Solidity, Foundry, Next.js, and Ethers.js
            </p>
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