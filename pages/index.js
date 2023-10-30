import Head from 'next/head'
import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { config } from '../dapp.config'
import {
  getTotalMinted,
  getMaxSupply,
  isPausedState,
  isPublicSaleState,
  isPreSaleState,
  presaleMint,
  publicMint
} from '../utils/interact'

export default function Home() {
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isPublicSale, setIsPublicSale] = useState(false)
  const [isPreSale, setIsPreSale] = useState(false)
  
  const [status, setStatus] = useState(null)
  const [isMinting, setIsMinting] = useState(false)
  const [mintAmount, setMintAmount] = useState(1)
  const [onboard, setOnboard] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  const preview = false //Switch to false when the contract is live

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply())
      setTotalMinted(await getTotalMinted())

      setPaused(await isPausedState())
      setIsPublicSale(await isPublicSaleState())
      const isPreSale = await isPreSaleState()
      setIsPreSale(isPreSale)

     // setMaxMintAmount(
     //   isPreSale ? config.presaleMaxMintAmount : config.maxMintAmount
     // )
     setMaxMintAmount(
      config.maxMintAmount
    )
    }

    init()
  }, [])
  
  /* Wallet Connection Functionality */
  useEffect(() => {
    const onboardData = initOnboard({
      address: (address) => setWalletAddress(address ? address : ''),
      wallet: (wallet) => {
        if (wallet.provider) {
          window.localStorage.setItem('selectedWallet', wallet.name)
        } else {
          window.localStorage.removeItem('selectedWallet')
        }
      }
    })

    setOnboard(onboardData)
  }, [])

  const previouslySelectedWallet =
  typeof window !== 'undefined' &&
  window.localStorage.getItem('selectedWallet')

useEffect(() => {
  if (previouslySelectedWallet !== null && onboard) {
    onboard.walletSelect(previouslySelectedWallet)
  }
}, [onboard, previouslySelectedWallet])

  const connectWalletHandler = async () => {
    const walletSelected = await onboard.walletSelect()
    if (walletSelected) {
      await onboard.walletCheck()
      window.location.reload(true)
    }
  }

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }

  const presaleMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await presaleMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }
  const publicMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await publicMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }

  return (
    <div className="min-h-screen h-full w-full flex flex-col bg-cover bg-gradient-to-r
    from-gray-600 to-indigo-400 overflow-hidden">
    <Head>
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      {/* Favicon */}
      <link rel="icon" href="media/mg.png" />
    </Head>

    <div className="flex h-full w-full items-center container 
                    mx-auto px-1 py-1 justify-between h-ful">
    
    <header className="min-w-full text-pink-400 py-1 px-1 md:px-0">
      <div className="flex items-center container mx-auto max-w-5xl justify-between h-full">
        {/* Logo */}
        <main >
      <img className="cursor-pointer w-30 h-20 "
              src="/media/mg.png">             
      </img>  
      </main>       

        {/* Official Links */}
        <nav aria-label="Contact Menu">
          <ul className="flex items-center space-x-4 md:space-x-6">

     {/* Twitter */}
     <li className="transform cursor-pointer hover:scale-125 transition duration-500">
      <a href="https://twitter.com/MasterGatorz" 
      target="_blank" rel="noreferrer">
      <img className="w-8 h-8"
              src="/media/twttr.png">             
          </img>   
      </a>
      </li>

{/* Discord */}
<li className="transform cursor-pointer hover:scale-125 transition duration-500">
      <a href="https://discord.com/invite/mastergatorz" 
      target="_blank" rel="noreferrer">
      <img className="w-8 h-8"
              src="/media/dc.png">             
          </img>   
      </a>
      </li>

            {/* Opensea */}
    <li className="transform cursor-pointer hover:scale-125 transition duration-500">
      <a
        href="https://opensea.io/collection/mastergatorzofficial"
        target="_blank"
        rel="noreferrer"
      >
        <img className="w-8 h-8"
              src="/media/os.png">             
          </img>   
      </a>
    </li>
          </ul>
        </nav>
      </div>        
    </header>
    </div>

    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <img
          src="/media/bg.png"
          className="animate-pulse-slow absolute inset-auto block w-full min-h-screen object-cover"
        />

        <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
          <div className="relative z-1 md:max-w-3xl w-full bg-green-800 filter border border-purple-200 
                      backdrop-blur-sm py-4 rounded-md px-2 md:px-10 flex flex-col items-center">
            <h1 className="uppercase font-bold text-white text-3xl mt-3">
            {paused ? 'Paused' : isPreSale ? 'Whitelist-Sale' : 'Public Sale'}
          </h1>

          {/* Wallet Address Display */}
          <h3 className="mt-5 text-white tracking-widest">
            {walletAddress
              ? 'CONNECTED: ' +
                walletAddress.slice(0, 8) +
                '...' +
                walletAddress.slice(-4)
              : 'PLEASE CONNECT A WALLET'}
          </h3>

            <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">
              <div className="relative w-full">
                <div className="font-coiny z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                  <p>
                    <span className="text-pink-400">{totalMinted}</span> /{' '}
                    {maxSupply}
                  </p>
                </div>

                <img
                  src="/media/pepe.gif"
                  className="border-4 object-cover w-full sm:h-[280px] md:w-[250px] rounded-md"
                />
              </div>

              <div className="flex flex-col items-center w-full px-4 mt-16">
                <div className="font-coiny flex items-center justify-between w-full">
                  <button
                    className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                    onClick={decrementMintAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 12H6"
                      />
                    </svg>
                  </button>

                  <p className="flex items-center justify-center flex-1 grow text-center font-bold text-yellow-500 text-3xl md:text-4xl">
                    {mintAmount}
                  </p>

                  <button
                    className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                    onClick={incrementMintAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-white tracking-widest mt-7">
                  Max Mint Amount: {maxMintAmount}
                </p>

          {/* Mint Button && Connect Wallet Button */}
          {walletAddress ? (
            <button
              className={`${
                paused || isMinting || preview
                  ? 'bg-gray-900 cursor-not-allowed mt-10'
                  : 'bg-gradient-to-br from-cyan-400 to-green-400 shadow-lg hover:shadow-blue-400/50'
              } border border-purple-400 mt-5  items-center px-3 py-3 
                    flex bg-gradient-to-r justify-between shadow-lg 
                    text-2xl text-white hover:shadow-white transition duration-500 
                    tracking-wide uppercase mt-10`}
              disabled={paused || isMinting || preview}
              onClick={isPreSale ? presaleMintHandler : publicMintHandler}
            >
              <p className="mt-1 text-lg uppercase">
                {isMinting
                  ? 'Minting...'
                  : 'Mint' +
                    '  ' +
                    Number.parseFloat(config.price * mintAmount).toFixed(4) +
                    ' ' +
                    'ETH + GAS'}
              </p>
            </button>
          ) : (
            <button
              className="border border-purple-400 mt-5 inline-flex items-center px-3 py-3 
                           bg-gradient-to-r  justify-between
                           from-gray-600 to-indigo-400 shadow-lg 
                           text-2xl text-white hover:shadow-white
                           tracking-wide uppercase 
                           transform  transition duration-500 gap-4"
              onClick={connectWalletHandler}
            >
              <p className="mt-1 text-lg uppercase">
                {'CONNECT WALLET' + '  '}
              </p>
              <img className="w-8 h-8" src="/media/metamask.gif"></img>
            </button>
          )}
              </div>
            </div>

            {/* Status */}
            {status && (
              <div
                className={`border ${
                  status.success ? 'border-green-500' : 'border-brand-pink-400 '
                } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
              >
                <p className="flex flex-col space-y-2 text-white text-sm md:text-base break-words ...">
                  {status.message}
                </p>
              </div>
            )}

            {/* Contract Address */}
            <div className="border-t border-gray-800 flex flex-col items-center mt-10 py-2 w-full">
              <h3 className="font-coiny text-2xl text-white uppercase mt-6">
                Contract Address
              </h3>
              <a
                href={`https://etherscan.io/address/${config.contractAddress}#readContract`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white mt-3"
              >
                <span className="break-all ...">{config.contractAddress}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>  
    <div className="flex flex-col md:space-x-16 space-y-10
           items-center mt-7 w-full">
            <div className="flex flex-col items-center justify-center text-center
             text-green-200">
              <h2 className="text-white text-2xl md:text-4xl uppercase">
              Welcome to the The Swampz 
              </h2>

              <p className="text-white mt-7 text-lg uppercase">
                {`
                  Home of the MasterGatorz, Featuring 2222 Unique and animated suspicious looking gatorz. 
                 `}
              </p>
              <p className="text-white text-lg uppercase">
                {`You never know what they'll be up to next. 
                  
                 `}
              </p>
              <p className="text-white text-lg uppercase">
                {`Great prizes, Access to royalties, 
                and priceless Utility awaiting you Gatorz. 
                 `}
              </p>
            </div>
          </div> 
    {/* Copyrights */}
    <div
    className="w-full object-cover bg-cover bg-center bg-black 
     mx-auto px-4 py-6 pt-6 mt-10">
    <h3 className="text-center text-white uppercase mt-2">
      Copyrights © 2023 MasterGatorz
    </h3>
  </div>
  </div>

  )
}