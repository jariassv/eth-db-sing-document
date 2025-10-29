// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title DocumentRegistry
 * @notice Contrato para almacenar y verificar la autenticidad de documentos usando blockchain
 * @dev Utiliza hash criptográfico + firma digital para garantizar integridad y autenticidad
 */
contract DocumentRegistry {
    /**
     * @notice Estructura para almacenar información de un documento
     * @dev Optimizado: NO incluye campo 'exists' redundante
     *      Se verifica existencia con signer != address(0)
     */
    struct Document {
        bytes32 hash;          // Hash criptográfico del documento (keccak256)
        uint256 timestamp;     // Timestamp de cuando se almacenó
        address signer;        // Dirección que firmó el documento
        bytes signature;       // Firma digital del hash
    }

    /// @notice Mapping de hash a información del documento
    mapping(bytes32 => Document) public documents;

    /// @notice Array para mantener orden de documentos almacenados
    bytes32[] public documentHashes;

    /// @notice Evento emitido cuando se almacena un nuevo documento
    event DocumentStored(
        bytes32 indexed hash,
        address indexed signer,
        uint256 timestamp
    );

    /// @notice Evento emitido cuando se verifica un documento
    event DocumentVerified(
        bytes32 indexed hash,
        address signer,
        bool isValid
    );

    /**
     * @notice Modifier para verificar que un documento NO existe
     * @param _hash Hash del documento a verificar
     */
    modifier documentNotExists(bytes32 _hash) {
        require(documents[_hash].signer == address(0), "Document already exists");
        _;
    }

    /**
     * @notice Modifier para verificar que un documento existe
     * @param _hash Hash del documento a verificar
     */
    modifier documentExists(bytes32 _hash) {
        require(documents[_hash].signer != address(0), "Document does not exist");
        _;
    }

    /**
     * @notice Almacena el hash y firma de un documento en la blockchain
     * @param _hash Hash criptográfico del documento
     * @param _timestamp Timestamp de cuando se firmó
     * @param _signature Firma digital del hash
     * @param _signer Dirección que firmó el documento
     */
    function storeDocumentHash(
        bytes32 _hash,
        uint256 _timestamp,
        bytes memory _signature,
        address _signer
    ) external documentNotExists(_hash) {
        // Crear el documento
        documents[_hash] = Document({
            hash: _hash,
            timestamp: _timestamp,
            signer: _signer,
            signature: _signature
        });

        // Agregar hash al array para poder iterar
        documentHashes.push(_hash);

        // Emitir evento
        emit DocumentStored(_hash, _signer, _timestamp);
    }

    /**
     * @notice Verifica la autenticidad de un documento
     * @param _hash Hash del documento a verificar
     * @param _signer Dirección del firmante esperado
     * @param _signature Firma a verificar
     * @return bool true si el documento existe y la firma coincide
     */
    function verifyDocument(
        bytes32 _hash,
        address _signer,
        bytes memory _signature
    ) external returns (bool) {
        // Verificar que el documento existe
        if (documents[_hash].signer == address(0)) {
            emit DocumentVerified(_hash, address(0), false);
            return false;
        }

        // Verificar que el firmante coincide
        bool isValid = documents[_hash].signer == _signer &&
                       keccak256(documents[_hash].signature) == keccak256(_signature);

        emit DocumentVerified(_hash, documents[_hash].signer, isValid);
        return isValid;
    }

    /**
     * @notice Obtiene la información completa de un documento
     * @param _hash Hash del documento
     * @return Document estructura con toda la información
     */
    function getDocumentInfo(bytes32 _hash) external view returns (Document memory) {
        require(documents[_hash].signer != address(0), "Document does not exist");
        return documents[_hash];
    }

    /**
     * @notice Verifica si un documento está almacenado en la blockchain
     * @param _hash Hash del documento
     * @return bool true si el documento existe
     */
    function isDocumentStored(bytes32 _hash) external view returns (bool) {
        return documents[_hash].signer != address(0);
    }

    /**
     * @notice Obtiene el número total de documentos almacenados
     * @return uint256 cantidad de documentos
     */
    function getDocumentCount() external view returns (uint256) {
        return documentHashes.length;
    }

    /**
     * @notice Obtiene el hash de un documento por su índice en el array
     * @param _index Índice del documento (0-based)
     * @return bytes32 hash del documento
     */
    function getDocumentHashByIndex(uint256 _index) external view returns (bytes32) {
        require(_index < documentHashes.length, "Index out of bounds");
        return documentHashes[_index];
    }
}

