// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {DocumentRegistry} from "../src/DocumentRegistry.sol";

contract DocumentRegistryTest is Test {
    DocumentRegistry public registry;
    
    // Test data
    bytes32 public constant TEST_HASH = keccak256("test document");
    bytes32 public constant TEST_HASH_2 = keccak256("test document 2");
    uint256 public constant TEST_TIMESTAMP = 1234567890;
    bytes public constant TEST_SIGNATURE = hex"1234";
    bytes public constant TEST_SIGNATURE_2 = hex"5678";
    
    address public signer1;
    address public signer2;
    
    event DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp);
    event DocumentVerified(bytes32 indexed hash, address signer, bool isValid);

    function setUp() public {
        registry = new DocumentRegistry();
        signer1 = address(0x1111);
        signer2 = address(0x2222);
    }

    // Test 1: Almacenar documento correctamente
    function test_StoreDocumentHash_Success() public {
        vm.expectEmit(true, true, false, true);
        emit DocumentStored(TEST_HASH, signer1, TEST_TIMESTAMP);
        
        registry.storeDocumentHash(
            TEST_HASH,
            TEST_TIMESTAMP,
            TEST_SIGNATURE,
            signer1
        );
        
        // Verificar que se almacenó correctamente
        assertTrue(registry.isDocumentStored(TEST_HASH));
        DocumentRegistry.Document memory doc = registry.getDocumentInfo(TEST_HASH);
        assertEq(doc.hash, TEST_HASH);
        assertEq(doc.timestamp, TEST_TIMESTAMP);
        assertEq(doc.signer, signer1);
        assertEq(doc.signature, TEST_SIGNATURE);
    }

    // Test 2: Verificar documento existente
    function test_VerifyDocument_ValidDocument() public {
        // Primero almacenar el documento récord
        registry.storeDocumentHash(TEST_HASH, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        
        // Verificar el documento
        vm.expectEmit(true, false, false, true);
        emit DocumentVerified(TEST_HASH, signer1, true);
        
        bool isValid = registry.verifyDocument(TEST_HASH, signer1, TEST_SIGNATURE);
        assertTrue(isValid);
    }

    // Test 3: Verificar documento con firma incorrecta
    function test_VerifyDocument_InvalidSignature() public {
        // Almacenar documento
        registry.storeDocumentHash(TEST_HASH, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        
        // Verificar con firma incorrecta
        vm.expectEmit(true, false, false, true);
        emit DocumentVerified(TEST_HASH, signer1, false);
        
        bool isValid = registry.verifyDocument(TEST_HASH, signer1, TEST_SIGNATURE_2);
        assertFalse(isValid);
    }

    // Test 4: Verificar documento con firmante incorrecto
    function test_VerifyDocument_InvalidSigner() public {
        // Almacenar documento con signer1
        registry.storeDocumentHash(TEST_HASH, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        
        // Verificar con signer2
        vm.expectEmit(true, false, false, true);
        emit DocumentVerified(TEST_HASH, signer1, false);
        
        bool isValid = registry.verifyDocument(TEST_HASH, signer2, TEST_SIGNATURE);
        assertFalse(isValid);
    }

    // Test 5: Rechazar documentos duplicados
    function test_StoreDocumentHash_DuplicateFails() public {
        // Almacenar documento por primera vez
        registry.storeDocumentHash(TEST_HASH, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        
        // Intentar almacenar el mismo hash debe fallar
        vm.expectRevert("Document already exists");
        registry.storeDocumentHash(TEST_HASH, TEST_TIMESTAMP + 1, TEST_SIGNATURE_2, signer2);
    }

    // Test 6: Obtener información correcta
    function test_GetDocumentInfo_Success() public {
        registry.storeDocumentHash(TEST_HASH, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        
        DocumentRegistry.Document memory doc = registry.getDocumentInfo(TEST_HASH);
        
        assertEq(doc.hash, TEST_HASH);
        assertEq(doc.timestamp, TEST_TIMESTAMP);
        assertEq(doc.signer, signer1);
        assertEq(doc.signature, TEST_SIGNATURE);
    }

    // Test 7: Obtener información de documento inexistente debe fallar
    function test_GetDocumentInfo_NonExistentFails() public {
        vm.expectRevert("Document does not exist");
        registry.getDocumentInfo(TEST_HASH);
    }

    // Test 8: Contar documentos
    function test_GetDocumentCount() public {
        assertEq(registry.getDocumentCount(), 0);
        
        registry.storeDocumentHash(TEST_HASH, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        assertEq(registry.getDocumentCount(), 1);
        
        registry.storeDocumentHash(TEST_HASH_2, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        assertEq(registry.getDocumentCount(), 2);
    }

    // Test 9: Obtener por índice
    function test_GetDocumentHashByIndex() public {
        registry.storeDocumentHash(TEST_HASH, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        registry.storeDocumentHash(TEST_HASH_2, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        
        assertEq(registry.getDocumentHashByIndex(0), TEST_HASH);
        assertEq(registry.getDocumentHashByIndex(1), TEST_HASH_2);
    }

    // Test 10: Obtener por índice fuera de rango debe fallar
    function test_GetDocumentHashByIndex_OutOfBounds() public {
        registry.storeDocumentHash(TEST_HASH, TEST_TIMESTAMP, TEST_SIGNATURE, signer1);
        
        vm.expectRevert("Index out of bounds");
        registry.getDocumentHashByIndex(1);
    }

    // Test 11: Verificar documento inexistente
    function test_VerifyDocument_NonExistent() public {
        vm.expectEmit(true, false, false, true);
        emit DocumentVerified(TEST_HASH, address(0), false);
        
        bool isValid = registry.verifyDocument(TEST_HASH, signer1, TEST_SIGNATURE);
        assertFalse(isValid);
        assertFalse(registry.isDocumentStored(TEST_HASH));
    }
}

