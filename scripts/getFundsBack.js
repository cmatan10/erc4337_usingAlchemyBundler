const hre = require("hardhat");
require('dotenv').config();

const { paymasterAddress } = require('../erc4337Config');

async function main() {

    // Create a wallet instance with the private key
    const wallet = new ethers.Wallet(process.env.PRI_KEY);

    // Connect the wallet to the Hardhat network provider
    const signer = wallet.connect(hre.ethers.provider);

    const paymaster = await hre.ethers.getContractAt("Paymaster", paymasterAddress, signer);

    const getDeposit = await paymaster.getDeposit()
   
    console.log(getDeposit);
    console.log(signer.address);

    const getFunds = await paymaster.withdrawTo(signer.address,getDeposit)
    const receipt1 = await getFunds.wait();
    console.log(receipt1);
console.log('deposit successful');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
