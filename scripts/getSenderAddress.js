const hre = require("hardhat");
const { accountFactoryAddress, entryPointAddress } = require('../erc4337Config');
const { createEOA } = require('./helpers/createEoaWallet');
const { updateErc4337Config } = require('./helpers/updateErc4337Config');

async function main() {

  const AccountFactory = await hre.ethers.getContractAt("AccountFactory", accountFactoryAddress);

  const EOA = createEOA()

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", entryPointAddress);

  const initCode = accountFactoryAddress + AccountFactory.interface.encodeFunctionData('createAccount', [EOA[0], 0]).slice(2);

  let simpleAccountAddress
  try {
    await entryPoint.getSenderAddress(initCode)
  } catch (transaction) {
    simpleAccountAddress = '0x' + transaction.data.slice(-40);
  }
  console.log('simpleAccountAddress:', simpleAccountAddress);

  updateErc4337Config('eoaPublicKey', EOA[0]);
  updateErc4337Config('eoaPrivateKey', EOA[1]);
  updateErc4337Config('simpleAccountAddress', simpleAccountAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
