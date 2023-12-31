/**
 *  This script will calculate the constructor arguments for BoredApe.sol and deploy it.
 *  After deploying, you can access the contract on etherscan.io with the deployed contract address.
 */

// npx hardhat run scripts/deployContract.js --network mainnet
// npx hardhat run scripts/deployContract.js --network rinkeby
//Before Deployment complie contracts by using: npx hardhat compile

const hre = require('hardhat')
//const { MerkleTree } = require('merkletreejs')
//const keccak256 = require('keccak256')
//const whitelist = require('./whitelist.js')

//We dont need this one since our contract has no constructor functions
//const BASE_URI = 'ipfs://Qmb5A1fFECM2iFHgUioii2khT814nCi6VU9aHXHHqNxHCK/'
//const proxyRegistryAddressRinkeby = '0xf57b2c51ded3a29e6891aba85459d600256cf317'
//const proxyRegistryAddressMainnet = '0xa5409ec958c83c3f309868babaca7c86dcb077c1'

async function main() {
  // Calculate merkle root from the whitelist array
  //const leafNodes = whitelist.map((addr) => keccak256(addr))
  //const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  //const root = merkleTree.getRoot()

  // Deploy the contract
  const Project = await hre.ethers.getContractFactory('MihaverseButterfly') //deploying the contract
  const project = await Project.deploy() //specify

  await project.deployed()

  console.log('Contract deployed to:', project.address)
} //Return contract address

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
