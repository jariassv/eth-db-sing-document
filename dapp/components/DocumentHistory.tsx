'use client';

import React, { useState, useEffect } from 'react';
import { History, RefreshCw, FileText, Calendar, User, Hash } from 'lucide-react';
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
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
      <div className="text-center py-8">
        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Conecta tu wallet para ver el historial de documentos</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Historial de Documentos</h2>
          <p className="text-gray-600">Documentos almacenados en la blockchain</p>
        </div>
        
        <button
          onClick={loadDocuments}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-red-500" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando documentos...</p>
        </div>
      )}

      {/* Lista de documentos */}
      {!isLoading && !error && (
        <>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay documentos</h3>
              <p className="text-gray-600">Aún no se han almacenado documentos en la blockchain</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Resumen */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-blue-900">
                    Total de documentos: {documents.length}
                  </span>
                </div>
              </div>

              {/* Tabla de documentos */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hash
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Firmante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Firma
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((doc, index) => (
                        <tr key={doc.hash} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Hash className="h-4 w-4 text-gray-400" />
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {formatHash(doc.hash)}
                              </code>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {formatAddress(doc.signer)}
                              </code>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {formatTimestamp(doc.timestamp)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {formatSignature(doc.signature)}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
