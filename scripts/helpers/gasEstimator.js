const Web3 = require('web3');
const https = process.env.PROVIDER;
const web3 = new Web3(https);
const { priorityFee } = require('../../erc4337Config');

require('dotenv').config();

async function FeePerGas() {
  function formatFeeHistory(result) {
    let blockNum = Number(result.oldestBlock);
    const blocks = [];
    for (let index = 0; index < result.baseFeePerGas.length; index++) {
      if (result.reward[index]) { 
        blocks.push({
          priorityFeePerGas: result.reward[index].map(x => Number(x)),
        });
      }
      blockNum += 1;
    }
    return blocks;
  }

  function avg(arr) {
    const sum = arr.reduce((a, v) => a + v);
    return Math.round(sum/arr.length);
  }
  
  const feeHistory = await web3.eth.getFeeHistory(20, "pending", [priorityFee]);
 
  const blocks = formatFeeHistory(feeHistory);
  const average = avg(blocks.map(b => b.priorityFeePerGas[0]));
  return [average, feeHistory.baseFeePerGas[0]];
    
}
module.exports = { FeePerGas };
