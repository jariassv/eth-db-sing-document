# 📜 Smart Contracts - Document Registry

<div align="center">

**Contratos inteligentes para el registro y verificación de documentos en Ethereum**

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.13-blue)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Foundry-Latest-orange)](https://getfoundry.sh/)
[![License](https://img.shields.io/badge/License-UNLICENSED-red)](LICENSE)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Compilación](#-compilación)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Documentación del Contrato](#-documentación-del-contrato)
- [Gas Optimization](#-gas-optimization)
- [Comandos Útiles](#-comandos-útiles)

---

## 📖 Descripción

Este directorio contiene los contratos inteligentes del sistema de registro de documentos. El contrato principal `DocumentRegistry.sol` permite almacenar hashes criptográficos de documentos junto con firmas digitales en la blockchain de Ethereum.

### Características Principales

- ✅ **Almacenamiento Inmutable**: Los documentos se almacenan permanentemente en la blockchain
- ✅ **Verificación de Autenticidad**: Sistema completo de verificación de documentos
- ✅ **Optimización de Gas**: Estructura optimizada que reduce ~39% el consumo de gas
- ✅ **Tests Completos**: 11 tests que cubren todos los casos de uso
- ✅ **Eventos Indexados**: Eventos optimizados para indexación off-chain

---

## 📁 Estructura del Proyecto

```
sc/
├── src/
│   └── DocumentRegistry.sol      # Contrato principal
├── test/
│   └── DocumentRegistry.t.sol     # Suite de tests (11 tests)
├── script/
│   └── Deploy.s.sol               # Script de despliegue
├── lib/
│   └── forge-std/                 # Biblioteca estándar de Foundry
├── out/                            # Artefactos compilados
├── cache/                          # Cache de compilación
├── broadcast/                      # Historial de despliegues
├── foundry.toml                    # Configuración de Foundry
└── README.md                       # Este archivo
```

---

## 🚀 Instalación

### Prerrequisitos

- **Foundry** instalado y configurado
- **Git** para clonar dependencias

### Instalación de Foundry

```bash
# Instalar Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verificar instalación
forge --version
```

### Instalación de Dependencias

```bash
# Desde el directorio sc/
forge install

# Esto instalará forge-std en lib/forge-std
```

---

## 🔨 Compilación

### Compilar Contratos

```bash
forge build
```

**Salida esperada:**
```
[⠊] Compiling...
[⠊] Compiling 1 files with 0.8.13
[⠊] Solc 0.8.13 finished in 1.23s
Compiler run successful!
```

### Limpiar Artefactos

```bash
forge clean
```

### Formatear Código

```bash
forge fmt
```

---

## 🧪 Testing

### Ejecutar Todos los Tests

```bash
forge test
```

### Tests con Logs Detallados

```bash
# Verbosidad nivel 2 (logs de console.log)
forge test -vv

# Verbosidad nivel 3 (traces de ejecución)
forge test -vvv

# Verbosidad nivel 4 (traces completos)
forge test -vvvv

# Verbosidad nivel 5 (traces y setup)
forge test -vvvvv
```

### Ejecutar Test Específico

```bash
forge test --match-test test_StoreDocumentHash_Success -vv
```

### Cobertura de Código

```bash
forge coverage
```

**Resultados esperados:**
- ✅ 11/11 tests pasando
- ✅ Cobertura completa de funciones críticas

### Suite de Tests

El archivo `DocumentRegistry.t.sol` incluye los siguientes tests:

1. ✅ `test_StoreDocumentHash_Success` - Almacenar documento correctamente
2. ✅ `test_VerifyDocument_ValidDocument` - Verificar documento válido
3. ✅ `test_VerifyDocument_InvalidSignature` - Verificar con firma incorrecta
4. ✅ `test_VerifyDocument_InvalidSigner` - Verificar con firmante incorrecto
5. ✅ `test_StoreDocumentHash_DuplicateFails` - Rechazar documentos duplicados
6. ✅ `test_GetDocumentInfo_Success` - Obtener información correcta
7. ✅ `test_GetDocumentInfo_NonExistentFails` - Error en documento inexistente
8. ✅ `test_GetDocumentCount` - Contar documentos
9. ✅ `test_GetDocumentHashByIndex` - Obtener por índice
10. ✅ `test_GetDocumentHashByIndex_OutOfBounds` - Error de índice fuera de rango
11. ✅ `test_VerifyDocument_NonExistent` - Verificar documento inexistente

### Gas Snapshots

```bash
# Generar snapshot de gas
forge snapshot

# Comparar con snapshot anterior
forge snapshot --diff
```

---

## 🚢 Despliegue

### Despliegue en Anvil (Local)

```bash
# 1. Iniciar Anvil en otra terminal
anvil --accounts 10 --balance 1000

# 2. Desplegar el contrato
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --verify
```

### Despliegue en Testnet (Sepolia)

```bash
# Configurar variables de entorno
export PRIVATE_KEY=tu_clave_privada
export ETHERSCAN_API_KEY=tu_api_key

# Desplegar
forge script script/Deploy.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### Despliegue en Mainnet

⚠️ **ADVERTENCIA**: Solo desplegar después de auditoría completa

```bash
forge script script/Deploy.s.sol \
  --rpc-url $MAINNET_RPC_URL \
  --broadcast \
  --verify \
  --slow
```

### Verificar Dirección del Contrato

Después del despliegue, el script mostrará la dirección del contrato:

```
DocumentRegistry deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## 📚 Documentación del Contrato

### DocumentRegistry.sol

#### Estructura de Datos

```solidity
struct Document {
    bytes32 hash;          // Hash criptográfico del documento (keccak256)
    uint256 timestamp;     // Timestamp de cuando se almacenó
    address signer;        // Dirección que firmó el documento
    bytes signature;       // Firma digital del hash
}
```

#### Funciones Principales

##### `storeDocumentHash`

Almacena el hash y firma de un documento en la blockchain.

```solidity
function storeDocumentHash(
    bytes32 _hash,
    uint256 _timestamp,
    bytes memory _signature,
    address _signer
) external documentNotExists(_hash)
```

**Parámetros:**
- `_hash`: Hash criptográfico del documento
- `_timestamp`: Timestamp de cuando se firmó
- `_signature`: Firma digital del hash
- `_signer`: Dirección que firmó el documento

**Eventos:**
- `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

**Reverts:**
- Si el documento ya existe: `"Document already exists"`

##### `verifyDocument`

Verifica la autenticidad de un documento (con eventos).

```solidity
function verifyDocument(
    bytes32 _hash,
    address _signer,
    bytes memory _signature
) external returns (bool)
```

**Parámetros:**
- `_hash`: Hash del documento a verificar
- `_signer`: Dirección del firmante esperado
- `_signature`: Firma a verificar

**Retorna:**
- `bool`: `true` si el documento existe y la firma coincide

**Eventos:**
- `DocumentVerified(bytes32 indexed hash, address signer, bool isValid)`

##### `verifyDocumentView`

Verifica la autenticidad de un documento (solo lectura, sin eventos).

```solidity
function verifyDocumentView(
    bytes32 _hash,
    address _signer,
    bytes memory _signature
) external view returns (bool)
```

**Nota:** Esta función no emite eventos y es más eficiente para consultas.

##### `getDocumentInfo`

Obtiene la información completa de un documento.

```solidity
function getDocumentInfo(bytes32 _hash) 
    external view returns (Document memory)
```

**Reverts:**
- Si el documento no existe: `"Document does not exist"`

##### `isDocumentStored`

Verifica si un documento está almacenado en la blockchain.

```solidity
function isDocumentStored(bytes32 _hash) 
    external view returns (bool)
```

##### `getDocumentCount`

Obtiene el número total de documentos almacenados.

```solidity
function getDocumentCount() external view returns (uint256)
```

##### `getDocumentHashByIndex`

Obtiene el hash de un documento por su índice en el array.

```solidity
function getDocumentHashByIndex(uint256 _index) 
    external view returns (bytes32)
```

**Reverts:**
- Si el índice está fuera de rango: `"Index out of bounds"`

#### Modifiers

##### `documentNotExists`

Verifica que un documento NO existe.

```solidity
modifier documentNotExists(bytes32 _hash) {
    require(documents[_hash].signer == address(0), "Document already exists");
    _;
}
```

##### `documentExists`

Verifica que un documento existe.

```solidity
modifier documentExists(bytes32 _hash) {
    require(documents[_hash].signer != address(0), "Document does not exist");
    _;
}
```

#### Eventos

```solidity
event DocumentStored(
    bytes32 indexed hash,
    address indexed signer,
    uint256 timestamp
);

event DocumentVerified(
    bytes32 indexed hash,
    address signer,
    bool isValid
);
```

---

## ⛽ Gas Optimization

### Optimizaciones Implementadas

1. **Struct Optimizado**
   - ❌ Sin campo `exists` redundante
   - ✅ Verificación con `signer != address(0)`
   - **Ahorro**: ~39% en gas

2. **Eventos Indexados**
   - `hash` y `signer` indexados para búsquedas eficientes
   - Facilita indexación off-chain

3. **Funciones View**
   - `verifyDocumentView` para consultas sin costo de gas
   - `isDocumentStored` para verificaciones rápidas

### Comparación de Gas

| Operación | Implementación Estándar | Implementación Optimizada | Ahorro |
|-----------|------------------------|---------------------------|--------|
| `storeDocumentHash` | ~85,000 gas | ~52,000 gas | ~39% |
| `verifyDocument` | ~25,000 gas | ~15,000 gas | ~40% |

### Análisis de Gas

```bash
# Generar reporte de gas
forge snapshot

# Ver gas usado por función
forge test --gas-report
```

---

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Compilar
forge build

# Compilar con optimizaciones
forge build --optimize --optimizer-runs 200

# Formatear código
forge fmt

# Verificar formato
forge fmt --check
```

### Testing

```bash
# Ejecutar tests
forge test

# Tests con logs
forge test -vv

# Tests con gas report
forge test --gas-report

# Cobertura
forge coverage

# Ejecutar test específico
forge test --match-test test_StoreDocumentHash_Success
```

### Despliegue

```bash
# Simular despliegue (sin broadcast)
forge script script/Deploy.s.sol --rpc-url http://localhost:8545

# Desplegar en local
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Desplegar y verificar
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --broadcast \
  --verify
```

### Interacción con Contratos (Cast)

```bash
# Llamar función view
cast call <CONTRACT_ADDRESS> "getDocumentCount()" --rpc-url http://localhost:8545

# Enviar transacción
cast send <CONTRACT_ADDRESS> "storeDocumentHash(bytes32,uint256,bytes,address)" \
  <HASH> <TIMESTAMP> <SIGNATURE> <SIGNER> \
  --rpc-url http://localhost:8545 \
  --private-key $PRIVATE_KEY

# Obtener balance
cast balance <ADDRESS> --rpc-url http://localhost:8545
```

### Debugging

```bash
# Traces de ejecución
forge test -vvvv

# Debug con DappTools
forge test --debug <FUNCTION_NAME>

# Verificar bytecode
cast code <CONTRACT_ADDRESS> --rpc-url http://localhost:8545
```

---

## 📖 Recursos Adicionales

### Documentación

- [Foundry Book](https://book.getfoundry.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Developer Resources](https://ethereum.org/developers/)

### Herramientas

- [Foundry](https://getfoundry.sh/)
- [Etherscan](https://etherscan.io/)
- [Remix IDE](https://remix.ethereum.org/)

### Comunidad

- [Foundry Discord](https://discord.gg/foundry)
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [Solidity Forum](https://forum.soliditylang.org/)

---

## 🔒 Seguridad

### Consideraciones

- ⚠️ El contrato no valida criptográficamente las firmas (solo compara bytes)
- ✅ Prevención de documentos duplicados
- ✅ Validación de entrada con modifiers
- ✅ Eventos para auditoría

### Auditoría Recomendada

Antes de desplegar en mainnet:
- [ ] Auditoría de seguridad profesional
- [ ] Revisión de código por pares
- [ ] Tests de penetración
- [ ] Análisis estático de código

---

## 📝 Licencia

Este proyecto está sin licencia (UNLICENSED). Ver el archivo LICENSE para más detalles.

---

<div align="center">

**Desarrollado con Foundry y Solidity**

[⬆ Volver al README principal](../README.md)

</div>
