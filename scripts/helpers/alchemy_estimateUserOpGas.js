const hre = require("hardhat");
const { eoaPublicKey, 
        eoaPrivateKey, 
        simpleAccountAddress, 
        entryPointAddress, 
        exampleContractAddress, 
        accountFactoryAddress, 
        paymasterAddress } = require('../../erc4337Config');
const { FeePerGas } = require('./gasEstimator');

async function estimateUserOpGas() {

    const wallet = new ethers.Wallet(eoaPrivateKey);
    const signer = wallet.connect(hre.ethers.provider);

    const AccountFactory = await hre.ethers.getContractAt("AccountFactory", accountFactoryAddress, signer);
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", entryPointAddress, signer);
    const simpleAccount = await hre.ethers.getContractAt("SimpleAccount", simpleAccountAddress, signer);
    const exampleContract = await hre.ethers.getContractAt("exampleContract", exampleContractAddress, signer);

    const funcTargetData = exampleContract.interface.encodeFunctionData('safeMint');

    const data = simpleAccount.interface.encodeFunctionData('execute', [exampleContractAddress, 0, funcTargetData]);

    let initCode = accountFactoryAddress + AccountFactory.interface.encodeFunctionData('createAccount', [eoaPublicKey, 0]).slice(2);

    const code = await hre.ethers.provider.getCode(simpleAccountAddress);

    if (code !== '0x') {
        initCode = '0x'
    }
    
    const userOp = {
        sender: simpleAccountAddress,
        nonce: '0x' + (await entryPoint.getNonce(simpleAccountAddress, 0)).toString(16),
        initCode: initCode,
        callData: data,
        paymasterAndData: paymasterAddress,
        signature: '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c'
    };

    const UserOpGas = await hre.ethers.provider.send('eth_estimateUserOperationGas',[userOp, entryPointAddress])

    const preVerificationGas = UserOpGas.preVerificationGas;
    const verificationGasLimit = UserOpGas.verificationGasLimit;
    const callGasLimit = UserOpGas.callGasLimit;

    const maxGasFee = await FeePerGas();

    const maxPriorityFeePerGas = '0x' + (maxGasFee[0]).toString(16)
    

    function addHex(c1, c2) {
        var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
        while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
        return hexStr;
      }
    const maxFeePerGas = '0x' + addHex(maxGasFee[1], maxPriorityFeePerGas);

    return [callGasLimit, verificationGasLimit, preVerificationGas, maxFeePerGas, maxPriorityFeePerGas]
}
module.exports = { estimateUserOpGas };
