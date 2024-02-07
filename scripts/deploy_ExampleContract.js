
const hre = require("hardhat");
const { updateErc4337Config } = require('./helpers/updateErc4337Config');

async function main() {

  const exampleContract = await hre.ethers.deployContract("exampleContract");

  await exampleContract.waitForDeployment();

  console.log(
    `example contract deployed to ${exampleContract.target}`
  );

  updateErc4337Config('exampleContractAddress', exampleContract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
