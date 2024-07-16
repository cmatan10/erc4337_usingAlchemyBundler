require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

module.exports = {
  solidity: {
    version: "0.8.23"
    ,
    settings: {
      evmVersion: 'shanghai',
      optimizer: {
        enabled: true,
        runs: 200 
      }
    }
  },
  networks: {
      hardhat: {
          chainId: 31337
      },
      amoy: {
          url: `${process.env.PROVIDER}`,
          accounts: [process.env.PRI_KEY],
          chainId: 80002,
      },    
  },

  etherscan: {
      apiKey: process.env.POLYGONSCAN_API_KEY,
  },

};
