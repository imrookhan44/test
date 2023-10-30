const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('../scripts/whitelist.js')

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL)
import { config } from '../dapp.config'

//Get contract ABI
const contract = require('../artifacts/contracts/Hallowin.sol/Hallowin.json')
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)

// Calculate merkle root from the whitelist array
const leafNodes = whitelist.map((addr) => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const root = merkleTree.getRoot()

//Will need this for Minted Counter
export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.totalSupply().call()
  return totalMinted
}
export const getMaxSupply = async () => {
  const maxSupply = await nftContract.methods.maxSupply().call()
  return maxSupply
}

export const isPausedState = async () => {
  const paused = await nftContract.methods.paused().call()
  return paused
}

export const isPublicSaleState = async () => {
  const publicSale = await nftContract.methods.publicM().call()
  return publicSale
}

export const isPreSaleState = async () => {
  const preSale = await nftContract.methods.whitelistM().call()
  return preSale
}

export const isclaimed = async () => {
  const claimed = await nftContract.methods.addressClaimed().call()
  return claimed
}

// Whitelist MINT FUNCTION
export const presaleMint = async (mintAmount) => {

  //Check Wallet Connection
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'Connect your wallet!'
    }
  }

  //If sold OUT!
  const totalMinted = await nftContract.methods.totalSupply().call()
  if (totalMinted == 300) {
    return {
      success: false,
      status: 'Sold out!'
    }
  }

//Already Claimed
const claimed = await nftContract.methods.addressClaimed(window.ethereum.selectedAddress).call()
if (claimed) {
  return {
    success: false,
    status: 'Address Already Claimed!'
  }
}

  const leaf = keccak256(window.ethereum.selectedAddress)
  const proof = merkleTree.getHexProof(leaf)
  // Verify Merkle Proof
  const isValid = merkleTree.verify(proof, leaf, root)
  if (!isValid) {
    return {
      success: false,
      status: 'Not whitelisted!'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction Whitelist
  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String((config.price * mintAmount) - config.price), 'ether')
    ).toString(16), // hex
    gasLimit: null,
    maxFee: null,
    maxPriority: null,
    data: nftContract.methods.whitelistMint(mintAmount, proof).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p>Congrats, you won a golden ticket for some treats!💀</p>
          <p>✨Check out your transaction on Etherscan✨</p>
          <p>{`https://etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: 'Error: ' + error.message
    }
  }
}

// Pubic MINT FUNCTION
export const publicMint = async (mintAmount) => {

  //Check Wallet Connection
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'Connect your wallet!'
    }
  }

  //If sold OUT!
  const totalMinted = await nftContract.methods.totalSupply().call()
  if (totalMinted == 300) {
    return {
      success: false,
      status: 'Sold out!'
    }
  }

//Already Claimed
const claimed = await nftContract.methods.addressClaimed(window.ethereum.selectedAddress).call()
if (claimed) {
  return {
    success: false,
    status: 'Address Already Claimed!'
  }
}

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String((config.price * mintAmount) - config.price), 'ether')
    ).toString(16), // hex
    gasLimit: null,
    maxFee: null,
    maxPriority: null,
    data: nftContract.methods.publicMint(mintAmount).encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p>Congrats, you won a golden ticket for some treats!💀</p>
          <p>✨Check out your transaction on Etherscan✨</p>
          <p>{`https://etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: 'Error: ' + error.message
    }
  }
}