// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;
import "@account-abstraction/contracts/core/BasePaymaster.sol";


contract Paymaster is BasePaymaster {

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {
    }

    function _validatePaymasterUserOp(UserOperation calldata /*userOp*/, bytes32 /*userOpHash*/, uint256 /*maxCost*/)
        internal
        override
        pure
        returns (bytes memory context, uint256 validationData)
    {
        return ("", 0);
    }
}