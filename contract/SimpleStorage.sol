// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleStorage
 * @dev Oddiy saqlash kontrakti - Web3.js misoli uchun
 */
contract SimpleStorage {
    uint256 private storedValue;
    address private owner;

    // Event - qiymat o'zgarganda chiqariladi
    event ValueChanged(address indexed user, uint256 oldValue, uint256 newValue);

    constructor() {
        owner = msg.sender;
        storedValue = 0;
    }

    // VIEW funksiya - 5-topshiriq uchun (gas sarflamaydi)
    function getValue() public view returns (uint256) {
        return storedValue;
    }

    // VIEW funksiya - egasini qaytaradi
    function getOwner() public view returns (address) {
        return owner;
    }

    // SEND tranzaksiya - 6-topshiriq uchun (gas sarflaydi)
    function setValue(uint256 _newValue) public {
        uint256 oldValue = storedValue;
        storedValue = _newValue;
        emit ValueChanged(msg.sender, oldValue, _newValue);
    }

    // Reset funksiya
    function reset() public {
        uint256 oldValue = storedValue;
        storedValue = 0;
        emit ValueChanged(msg.sender, oldValue, 0);
    }
}
