const config = {
  title: 'Hallowin',
  description: 'Hallowin',
  contractAddress: '0xDBE1e78F84f611D7EBFf499d40F75d14c066497C',
  maxMintAmount: 3, //change to 1 when Public Sale
  price: 0.003 //change to 0.01 when public sale
}

const onboardOptions = {
  dappId: process.env.NEXT_PUBLIC_DAPP_ID,
  networkId: 1, // Goerli, use 1 for Mainnet 5 is Goerli
  darkMode: true,
  walletSelect: {
    description: 'Available wallets',
    wallets: [
      { walletName: 'metamask', preferred: true }
    ]
  },
  walletCheck: [
    { checkName: 'derivationPath' },
    { checkName: 'accounts' },
    { checkName: 'connect' },
    { checkName: 'network' }
  ]
}

export { config, onboardOptions }
