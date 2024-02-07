
const hre = require("hardhat");
const { entryPointAddress } = require('../erc4337Config');
const { updateErc4337Config } = require('./helpers/updateErc4337Config');

async function main() {

  const Paymaster = await hre.ethers.deployContract("Paymaster",[entryPointAddress]);

  await Paymaster.waitForDeployment();

  console.log(
    `Paymaster deployed to ${Paymaster.target}`
  );

  updateErc4337Config('paymasterAddress', Paymaster.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
