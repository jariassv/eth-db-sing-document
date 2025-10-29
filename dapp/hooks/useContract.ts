'use client';

import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from '@/contexts/MetaMaskContext';
import { DOCUMENT_REGISTRY_ABI } from '@/lib/abi';

// Dirección del contrato (se actualizará después del despliegue)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

// Tipos para el contrato
export interface Document {
  hash: string;
  timestamp: number;
  signer: string;
  signature: string;
}

export function useContract() {
  const { getSigner, isConnected } = useMetaMask();

  // Crear instancia del contrato
  const contract = useMemo(() => {
    if (!CONTRACT_ADDRESS) {
      console.warn('CONTRACT_ADDRESS no definida');
      return null;
    }

    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'
      );
      
      return new ethers.Contract(
        CONTRACT_ADDRESS,
        DOCUMENT_REGISTRY_ABI,
        provider
      );
    } catch (error) {
      console.error('Error creando contrato:', error);
      return null;
    }
  }, []);

  // Almacenar documento en la blockchain
  const storeDocumentHash = async (
    hash: string,
    timestamp: number,
    signature: string,
    signer: string
  ) => {
    if (!contract || !isConnected) {
      throw new Error('Contrato no disponible o wallet no conectada');
    }

    try {
      const signerInstance = getSigner();
      if (!signerInstance) {
        throw new Error('No se pudo obtener el signer');
      }

      const contractWithSigner = contract.connect(signerInstance);
      
      console.log('Enviando transacción...', {
        hash,
        timestamp,
        signature,
        signer
      });

      const tx = await (contractWithSigner as any).storeDocumentHash(
        hash,
        timestamp,
        signature,
        signer
      );

      console.log('Transacción enviada:', tx.hash);
      
      // Esperar confirmación
      const receipt = await tx.wait();
      console.log('Transacción confirmada:', receipt);
      
      return {
        txHash: tx.hash,
        receipt
      };
    } catch (error) {
      console.error('Error almacenando documento:', error);
      throw error;
    }
  };

  // Verificar documento
  const verifyDocument = async (
    hash: string,
    signer: string,
    signature: string
  ): Promise<boolean> => {
    if (!contract) {
      throw new Error('Contrato no disponible');
    }

    try {
      const isValid = await (contract as any).verifyDocument(hash, signer, signature);
      console.log('Verificación resultado:', isValid);
      return isValid;
    } catch (error) {
      console.error('Error verificando documento:', error);
      throw error;
    }
  };

  // Obtener información del documento
  const getDocumentInfo = async (hash: string): Promise<Document> => {
    if (!contract) {
      throw new Error('Contrato no disponible');
    }

    try {
      const document = await (contract as any).getDocumentInfo(hash);
      
      return {
        hash: document.hash,
        timestamp: Number(document.timestamp),
        signer: document.signer,
        signature: document.signature
      };
    } catch (error) {
      console.error('Error obteniendo información del documento:', error);
      throw error;
    }
  };

  // Verificar si un documento está almacenado
  const isDocumentStored = async (hash: string): Promise<boolean> => {
    if (!contract) {
      throw new Error('Contrato no disponible');
    }

    try {
      return await (contract as any).isDocumentStored(hash);
    } catch (error) {
      console.error('Error verificando si documento está almacenado:', error);
      throw error;
    }
  };

  // Obtener número total de documentos
  const getDocumentCount = async (): Promise<number> => {
    if (!contract) {
      throw new Error('Contrato no disponible');
    }

    try {
      const count = await (contract as any).getDocumentCount();
      return Number(count);
    } catch (error) {
      console.error('Error obteniendo conteo de documentos:', error);
      throw error;
    }
  };

  // Obtener hash por índice
  const getDocumentHashByIndex = async (index: number): Promise<string> => {
    if (!contract) {
      throw new Error('Contrato no disponible');
    }

    try {
      return await (contract as any).getDocumentHashByIndex(index);
    } catch (error) {
      console.error('Error obteniendo hash por índice:', error);
      throw error;
    }
  };

  // Obtener todos los documentos (historial)
  const getAllDocuments = async (): Promise<Document[]> => {
    if (!contract) {
      throw new Error('Contrato no disponible');
    }

    try {
      const count = await getDocumentCount();
      const documents: Document[] = [];

      for (let i = 0; i < count; i++) {
        const hash = await getDocumentHashByIndex(i);
        const document = await getDocumentInfo(hash);
        documents.push(document);
      }

      return documents;
    } catch (error) {
      console.error('Error obteniendo todos los documentos:', error);
      throw error;
    }
  };

  return {
    contract,
    storeDocumentHash,
    verifyDocument,
    getDocumentInfo,
    isDocumentStored,
    getDocumentCount,
    getDocumentHashByIndex,
    getAllDocuments,
    isConnected
  };
}
