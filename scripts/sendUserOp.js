const hre = require("hardhat");
const { estimateUserOpGas } = require('./helpers/alchemy_estimateUserOpGas');

const { eoaPublicKey, 
        eoaPrivateKey, 
        simpleAccountAddress, 
        entryPointAddress, 
        exampleContractAddress, 
        accountFactoryAddress, 
        paymasterAddress } = require('../addressesConfig');

async function main() {

    const wallet = new ethers.Wallet(eoaPrivateKey);
    const signer = wallet.connect(hre.ethers.provider);

    const AccountFactory = await hre.ethers.getContractAt("AccountFactory", accountFactoryAddress, signer);
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", entryPointAddress, signer);
    const simpleAccount = await hre.ethers.getContractAt("SimpleAccount", simpleAccountAddress, signer);
    const exampleContract = await hre.ethers.getContractAt("exampleContract", exampleContractAddress, signer);

    const balanceWei = await hre.ethers.provider.getBalance(signer.address);
    console.log(`The balance of the signer is: ${balanceWei} Wei`);

    const funcTargetData = exampleContract.interface.encodeFunctionData('safeMint');

    const data = simpleAccount.interface.encodeFunctionData('execute', [exampleContractAddress, 0, funcTargetData]);

    let initCode = accountFactoryAddress + AccountFactory.interface.encodeFunctionData('createAccount', [eoaPublicKey, 0]).slice(2);

    const code = await hre.ethers.provider.getCode(simpleAccountAddress);

    if (code !== '0x') {
        initCode = '0x'
    }
    const UserOpGas = await estimateUserOpGas();

    const userOp = {
        sender: simpleAccountAddress,
        nonce: '0x' + (await entryPoint.getNonce(simpleAccountAddress, 0)).toString(16),
        initCode: initCode,
        callData: data,
        callGasLimit: UserOpGas[0],
        verificationGasLimit: UserOpGas[1],
        preVerificationGas: UserOpGas[2],
        maxFeePerGas: UserOpGas[3],
        maxPriorityFeePerGas: UserOpGas[4],
        paymasterAndData: paymasterAddress,
        signature: '0x'
    };

    const hash = await entryPoint.getUserOpHash(userOp);

    userOp.signature = await signer.signMessage(hre.ethers.getBytes(hash));

    const paymasterBalance = await entryPoint.deposits(paymasterAddress);
    console.log('paymasterBalance', paymasterBalance);

    const opHash = await hre.ethers.provider.send('eth_sendUserOperation',[userOp, entryPointAddress])
    console.log(opHash);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
