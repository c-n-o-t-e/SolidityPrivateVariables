//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

error PrivateVariables_Invalid_Address();

contract PrivateVariables {
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
    mapping(uint => address) private mappedValues;

    constructor() {
        u80 = 3;
        u256 = 6;

        flag = true;
        addr = msg.sender;

        dynamicArray.push(4);
        staticArray[0] = address(1);

        staticArray[1] = address(2);
        staticArray[2] = address(3);

        mappedValues[0] = address(4);
        b32 = keccak256("_greeting");
    }

    function updateFlag(bool _value) external {
        flag = _value;
    }

    function updateU80(uint80 _value) external {
        u80 = _value;
    }

    function updateU256(uint256 _value) external {
        u256 = _value;
    }

    function updateBytes32(bytes32 _value) external {
        b32 = _value;
    }

    function updateAddress(address _value) external {
        if (_value == address(0)) revert PrivateVariables_Invalid_Address();
        addr = _value;
    }

    function updateDynamicArray(uint _value) external {
        dynamicArray.push(_value);
    }

    function updateStaticArray(uint[3] calldata _value) external {
        dynamicArray[0] = _value[0];
        dynamicArray[1] = _value[1];
        dynamicArray[2] = _value[2];
    }

    function updateMapping(uint _key, address _value) external {
        mappedValues[_key] = _value;
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
