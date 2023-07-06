//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

error PrivateVariables_Invalid_Address();

contract PrivateVariables {
    struct StructValues {
        // one slot
        uint96 u96;
        address structAddr;
        // one slot
        address structAddr0;
        bytes4 b4;
        bytes8 b8;
        // one slot
        uint256 id;
    }

    // slot 0
    address public addr; // 20 bytes
    uint80 private u80; // 10 bytes
    bool flag; // 1  bytes
    // slot 1
    bytes32 private b32;
    // slot 2
    uint256 private u256;
    // slot 3 4 5
    address[3] private staticArray;
    // slot 6
    uint256[] private dynamicArray;
    // slot 7
    StructValues[] private structArrayValues;
    // slot 8
    mapping(uint => address) private mappedValues;
    // slot 9
    mapping(uint => StructValues) private structMappedValues;

    constructor() {}

    function updateFlag(bool value) external {
        flag = value;
    }

    function updateU80(uint80 value) external {
        u80 = value;
    }

    function updateU256(uint256 value) external {
        u256 = value;
    }

    function updateBytes32(bytes32 value) external {
        b32 = value;
    }

    function updateAddress(address value) external {
        if (value == address(0)) revert PrivateVariables_Invalid_Address();
        addr = value;
    }

    function updateDynamicArray(uint value) external {
        dynamicArray.push(value);
    }

    function updateStaticArray(address[3] calldata value) external {
        staticArray[0] = value[0];
        staticArray[1] = value[1];
        staticArray[2] = value[2];
    }

    function updateMapping(uint key, address value) external {
        mappedValues[key] = value;
    }

    function updateStructValues(
        uint96 u96,
        address structAddr,
        address structAddr0,
        bytes4 b4,
        bytes8 b8,
        uint256 ui256
    ) public {
        StructValues memory structValues = StructValues({
            u96: u96,
            structAddr: structAddr,
            structAddr0: structAddr0,
            b4: b4,
            b8: b8,
            id: ui256
        });

        structArrayValues.push(structValues);
        structMappedValues[u96] = structValues;
    }

    function getArrayLocation(
        uint slot,
        uint index,
        uint elementSize
    ) public pure returns (uint) {
        return uint(keccak256(abi.encodePacked(slot))) + (index * elementSize);
    }

    function getMapLocation(uint slot, uint key) public pure returns (uint) {
        return uint(keccak256(abi.encodePacked(key, slot)));
    }
}
