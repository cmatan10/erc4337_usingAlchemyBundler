const hre = require("hardhat");
const { entryPointAddress } = require('../erc4337Config');
const { updateErc4337Config } = require('./helpers/updateErc4337Config');

async function main() {

  const AccountFactory = await hre.ethers.deployContract("AccountFactory",[entryPointAddress]);
  
  await AccountFactory.waitForDeployment();

  console.log(
    `AccountFactory deployed to ${AccountFactory.target}` 
  );

  updateErc4337Config('accountFactoryAddress', AccountFactory.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
