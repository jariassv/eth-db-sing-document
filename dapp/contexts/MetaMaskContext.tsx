'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Tipos para el contexto
interface Wallet {
  address: string;
  privateKey: string;
}

interface MetaMaskContextType {
  // Estado de conexión
  isConnected: boolean;
  currentWallet: Wallet | null;
  currentWalletIndex: number;
  
  // Wallets disponibles
  wallets: Wallet[];
  
  // Funciones
  connect: (walletIndex: number) => void;
  disconnect: () => void;
  switchWallet: (walletIndex: number) => void;
  signMessage: (message: string) => Promise<string>;
  getSigner: () => ethers.Signer | null;
}

// Crear el contexto
const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

// Mnemonic de Anvil (por defecto)
const ANVIL_MNEMONIC = process.env.NEXT_PUBLIC_MNEMONIC || 
  "test test test test test test test test test test test junk";

// Provider del contexto
export function MetaMaskProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [currentWalletIndex, setCurrentWalletIndex] = useState(0);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);

  // Derivar wallets desde el mnemonic de Anvil
  useEffect(() => {
    try {
      const derivedWallets: Wallet[] = [];
      
      // Derivar 10 wallets desde el mnemonic
      for (let i = 0; i < 10; i++) {
        const path = `m/44'/60'/0'/0/${i}`;
        const wallet = ethers.HDNodeWallet.fromPhrase(ANVIL_MNEMONIC, undefined, path);
        derivedWallets.push({
          address: wallet.address,
          privateKey: wallet.privateKey
        });
      }
      
      setWallets(derivedWallets);
      
      // Crear provider para Anvil
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
      const rpcProvider = new ethers.JsonRpcProvider(rpcUrl);
      setProvider(rpcProvider);
      
      console.log('Wallets derivadas:', derivedWallets.map(w => w.address));
    } catch (error) {
      console.error('Error derivando wallets:', error);
    }
  }, []);

  // Conectar a una wallet específica
  const connect = (walletIndex: number) => {
    if (walletIndex >= 0 && walletIndex < wallets.length) {
      const wallet = wallets[walletIndex];
      setCurrentWallet(wallet);
      setCurrentWalletIndex(walletIndex);
      setIsConnected(true);
      console.log(`Conectado a wallet ${walletIndex}:`, wallet.address);
    } else {
      throw new Error('Índice de wallet inválido');
    }
  };

  // Desconectar
  const disconnect = () => {
    setCurrentWallet(null);
    setCurrentWalletIndex(0);
    setIsConnected(false);
    console.log('Desconectado');
  };

  // Cambiar de wallet
  const switchWallet = (walletIndex: number) => {
    if (isConnected) {
      connect(walletIndex);
    }
  };

  // Firmar mensaje
  const signMessage = async (message: string): Promise<string> => {
    if (!currentWallet || !provider) {
      throw new Error('Wallet no conectada');
    }

    try {
      // Crear wallet con la clave privada
      const wallet = new ethers.Wallet(currentWallet.privateKey, provider);
      
      // Firmar el mensaje
      const signature = await wallet.signMessage(message);
      console.log('Mensaje firmado:', signature);
      return signature;
    } catch (error) {
      console.error('Error firmando mensaje:', error);
      throw error;
    }
  };

  // Obtener signer
  const getSigner = (): ethers.Signer | null => {
    if (!currentWallet || !provider) {
      return null;
    }

    try {
      return new ethers.Wallet(currentWallet.privateKey, provider);
    } catch (error) {
      console.error('Error creando signer:', error);
      return null;
    }
  };

  const value: MetaMaskContextType = {
    isConnected,
    currentWallet,
    currentWalletIndex,
    wallets,
    connect,
    disconnect,
    switchWallet,
    signMessage,
    getSigner,
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
}

// Hook para usar el contexto
export function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask debe ser usado dentro de MetaMaskProvider');
  }
  return context;
}
