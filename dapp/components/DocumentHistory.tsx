'use client';

import React, { useState, useEffect } from 'react';
import { History, RefreshCw, FileText, Calendar, User, Hash, Shield, AlertCircle, Loader2, Database } from 'lucide-react';
import { useContract, Document } from '@/hooks/useContract';

export default function DocumentHistory() {
  const { getAllDocuments, getDocumentCount, isConnected } = useContract();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Cargar documentos
  const loadDocuments = async () => {
    if (!isConnected) {
      setError('Conecta tu wallet para ver el historial');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const docs = await getAllDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error cargando documentos:', error);
      setError('Error al cargar el historial de documentos');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar documentos al montar el componente
  useEffect(() => {
    loadDocuments();
  }, [isConnected]);

  // Formatear timestamp
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Formatear dirección
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  // Formatear hash
  const formatHash = (hash: string): string => {
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  // Formatear firma
  const formatSignature = (signature: string): string => {
    return `${signature.slice(0, 10)}...${signature.slice(-10)}`;
  };

  if (!isConnected) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl text-center py-12">
        <div className="p-4 bg-yellow-100 rounded-2xl w-fit mx-auto mb-6">
          <AlertCircle className="h-12 w-12 text-yellow-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Wallet Required</h3>
        <p className="text-gray-600">Conecta tu wallet para ver el historial de documentos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Document History</h2>
          <p className="text-gray-600">All documents stored on the blockchain</p>
        </div>
        
        <button
          onClick={loadDocuments}
          disabled={isLoading}
          className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-100 border-2 border-rose-400 p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-rose-700" />
          <p className="text-sm font-semibold text-rose-900">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <p className="text-lg font-medium text-gray-900">Loading documents...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
          </div>
        </div>
      )}

      {/* Documents List */}
      {!isLoading && !error && (
        <>
          {documents.length === 0 ? (
            <div className="card text-center py-16">
              <div className="p-4 bg-gray-100 rounded-2xl w-fit mx-auto mb-6">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Documents Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No documents have been stored on the blockchain yet. Upload and sign a document to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Total Documents</h3>
                    <p className="text-3xl font-bold text-blue-600">{documents.length}</p>
                  </div>
                </div>
              </div>

              {/* Documents Table */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Document Hash
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Signer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Signed Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Signature
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((doc, index) => (
                        <tr key={doc.hash} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <span className="text-sm font-semibold text-gray-700">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-1 bg-blue-100 rounded">
                                <Hash className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="min-w-0">
                                <code className="text-sm font-mono text-gray-900 break-all">
                                  {formatHash(doc.hash)}
                                </code>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-1 bg-purple-100 rounded">
                                <User className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="min-w-0">
                                <code className="text-sm font-mono text-gray-900">
                                  {formatAddress(doc.signer)}
                                </code>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-1 bg-green-100 rounded">
                                <Calendar className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm text-gray-900">
                                  {formatTimestamp(doc.timestamp)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-1 bg-orange-100 rounded">
                                <Shield className="h-4 w-4 text-orange-600" />
                              </div>
                              <div className="min-w-0">
                                <code className="text-sm font-mono text-gray-900">
                                  {formatSignature(doc.signature)}
                                </code>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Info */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Showing {documents.length} document{documents.length !== 1 ? 's' : ''} stored on the blockchain
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}