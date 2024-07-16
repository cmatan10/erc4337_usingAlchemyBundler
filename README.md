# Full implementation of ERC 4337 using Alchemy bundler

## Overview
This repository showcases a practical implementation of ERC4337, a standard for smart contract-based accounts, by demonstrating a complete workflow for minting an ERC721 token. The project involves setting up a smart contract environment on the amoy test network and executing user operations. Key components include:
- **EntryPoint**: Manages user operations - created by Alchemy (0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789).
- **AccountFactory**: Responsible for creating new accounts.
- **Paymaster**: Transactions sponsor for SimpleAccounts.
- **SimpleAccount**: A basic account structure for users.
- **ExampleContract**: A simple ERC721 token contract for minting tokens.

## Requisites
- Install the dependence with the command `npm install`.
- Ensure the `.env` file is updated based on the provided `.env.example`. It should include:
  - A private key with sufficient amoy MATIC to deploy the contracts and fund the wallet for user operations.
  - A amoy RPC URL- must used Alchemy rpc for this exam.

## Deployment and Execution Steps
Follow these steps in order to deploy contracts and execute transactions:

### 1. Deploy the AccountFactory
This script deploys the AccountFactory contract. The AccountFactory is responsible for creating new smart contract-based accounts. It takes the address of the previously deployed Alchemy EntryPoint as a parameter.

`npx hardhat run --network amoy ./scripts/deploy_AccountFactory.js`

### 2. Deploy the Paymaster
This script deploys the Paymaster contract, which covers transaction fees for SimpleAccounts. The Alchemy EntryPoint address is passed as a parameter to the Paymaster.

`npx hardhat run --network amoy ./scripts/deploy_Paymaster.js`

### 3. Get Sender Address 
This script creates an Externally Owned Account (EOA) wallet. The EOA wallet is critical because it signs the SimpleAccount transactions on the network and providing a layer of control and security for the user's operations. Additionally, this script determines the deployment address of the SimpleAccount contract, which embodies a fundamental account framework for users within the ERC4337 protocol.

`npx hardhat run --network amoy ./scripts/getSenderAddress.js`

### 4. Deploy ExampleContract
This script deploys the ExampleContract, a simple ERC721 token contract. This contract is used for minting tokens in this demonstration.

`npx hardhat run --network amoy ./scripts/deploy_ExampleContract.js`

### 5. Deposit Funds
This script ensures that the Paymaster has sufficient balance to cover transaction fees for wallets created from the AccountFactory.

`npx hardhat run --network amoy ./scripts/depositFunds.js`

### 6. Send User Operation
This script executes a user operation by interacting with the following contracts: EntryPoint, Paymaster, SimpleAccount, and ExampleContract. It prepares and sends a transaction to the EntryPoint contract, which typically involves a function call like safeMint from the ExampleContract, using the user's SimpleAccount.
The transaction is sponsored by the Paymaster, which covers the transaction fees, using the funds deposited earlier.

`npx hardhat run --network amoy ./scripts/sendUserOp.js`

### 7. Test Script
 This script checks the results of the previous operation. It queries the ExampleContract for the latest tokenId and the token balance of the SimpleAccount, verifying the success of the minting operation.

`npx hardhat run --network amoy ./scripts/test.js`

## Configuration
- `hardhat.config.js`: [View File](https://github.com/cmatan10/erc4337-example/blob/main/hardhat.config.js)
- `erc4337Config.js`: [View File](https://github.com/cmatan10/erc4337_usingAlchemyBundler/blob/main/erc4337Config.js)

### NOTE: 
If you encounter this err:
"maxPriorityFeePerGas is 'x' but must be at least 1575000000"
Increase the `priorityFee` value in the `erc4337Config` file.
