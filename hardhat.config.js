require('dotenv').config()
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.22',
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000
      }
    }
  },
  defaultNetwork: 'mainnet', //change when run on mainnet to mainnet s goerli!
  networks: {
    hardhat: {},
    //goerli: {  
    mainnet: {                      
      url: `${process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL}`, //our Node for deployment
      accounts: [`0x${process.env.METAMASK_PRIVATE_KEY}`] //use your metamask wallet for deployment
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`    //Need this for verification!
  }
}
