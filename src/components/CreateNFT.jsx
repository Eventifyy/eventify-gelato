//   import { mintNFT } from '../Blockchain.Services'
import {
    useGlobalState,
    setGlobalState,
    setLoadingMsg,
    setAlert,
  } from '../store'
  // import {
  //   PaperEmbeddedWalletSdk,
  //   UserStatus,
  // } from '@paperxyz/embedded-wallet-service-sdk'
  import { useDebugValue, useEffect, useState } from 'react'
  import { FaTimes } from 'react-icons/fa'
  // import { Web3Storage } from 'web3.storage'
  // import web3modal from 'web3modal'
  // import { ethers } from 'ethers'
  // import { EventifyAddress, EventfiyAbi } from '../config'
  
  const CreateNFT = () => {
    const [modal] = useGlobalState('modal')
    const [imgBase64, setImgBase64] = useState(null)
  
    const [formInput, setFormInput] = useState({
      price: '',
      name: '',
      cover: '',
      description: '',
      date: '',
      venue: '',
      supply: '',
    })
  
  
    const [sdk, setSdk] = useState()
    const [user, setUser] = useState({})
  
    // const clientId = process.env.NEXT_PUBLIC_PAPER_KEY
  
    // useEffect(() => {
    //   setSdk(
    //     new PaperEmbeddedWalletSdk({
    //       clientId: clientId,
    //       chain: 'Mumbai',
    //     }),
    //   )
    // }, [])
  
    useEffect(() => {
      getUserInfo()
    }, [sdk])
    
    async function getUserInfo() {
      if (sdk) {
        const result = await sdk.getUser()
        setUser(result)
      }
    }
  
    // -----------
  
    function getAccessToken() {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyMjkyQjQ5YzFjN2ExMzhERWQxQzQ3NGNlNmEyNmM1NURFNWQ0REQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzg2MDc1NDEsIm5hbWUiOiJNZXRhRmkifQ.cwyjEIx8vXtTnn8Y3vctroo_rooHV4ww_2xKY-MT0rs'
    }
  
    function makeStorageClient() {
    //   return new Web3Storage({ token: getAccessToken() })
    }
  
    const uploadToIPFS = async (files) => {
      const client = makeStorageClient()
      const cid = await client.put(files)
      return cid
    }
  
    const changeImage = async (e) => {
      const reader = new FileReader()
      if (e.target.files[0]) reader.readAsDataURL(e.target.files[0])
  
      reader.onload = (readerEvent) => {
        const file = readerEvent.target.result
        setImgBase64(file)
      }
      const inputFile = e.target.files[0]
      const inputFileName = e.target.files[0].name
      const files = [new File([inputFile], inputFileName)]
      const metaCID = await uploadToIPFS(files)
      const url = `https://ipfs.io/ipfs/${metaCID}/${inputFileName}`
      console.log(url)
      setFormInput({ ...formInput, cover: url })
    }
  
    const metadata = async () => {
      const { price, name, cover, description, date, venue, supply } = formInput
      if (!name || !cover || !price || !description || !date || !venue || !supply)
        return
      const data = JSON.stringify({ name, cover, description, date, venue })
      const files = [new File([data], 'data.json')]
      try {
        const metaCID = await uploadToIPFS(files)
        const metaUrl = `https://ipfs.io/ipfs/${metaCID}/data.json`
        console.log(metaUrl)
        return metaUrl
      } catch (error) {
        console.log('Error uploading:', error)
      }
    }
  
    // const mint = async (e) => {
    //   e.preventDefault()
  
    //   // need metamask
    //   const modal = new web3modal({
    //     network: 'mumbai',
    //     cacheProvider: true,
    //   })
    //   const connection = await modal.connect()
    //   const provider = new ethers.providers.Web3Provider(connection)
    //   const signer = provider.getSigner()
    //   const contract = new ethers.Contract(EventifyAddress, EventfiyAbi, signer)
    //   const metadataUrl = await metadata()
    //   const price = ethers.utils.parseEther(formInput.price)
    //   const supply = formInput.supply
    //   const publish = await contract.host(
    //     price,
    //     supply,
    //     metadataUrl,
    //     {
    //       gasLimit: 1000000,
    //     },
    //   )
    //   await publish.wait()
    //   console.log(publish)
    //   closeModal()
    // }
  
    const mint = async (e) => {
      e.preventDefault()
  
      // need metamask
      const { user } = await sdk.auth.loginWithPaperModal()
      const signer = await user.wallet.getEthersJsSigner()
  
    //   const contract = new ethers.Contract(EventifyAddress, EventfiyAbi, signer)
      const metadataUrl = await metadata()
    //   const price = ethers.utils.parseEther(formInput.price)
      const supply = formInput.supply
  
      const params = {
        // contractAddress: EventifyAddress,
        methodInterface:
          'function host(uint _price, uint _supply, string memory _tokenURI, string memory _description) public payable',
        // methodArgs: [price, supply, metadataUrl, ""],
      }
      const {
        transactionHash,
      } = await user.wallet.gasless.callContract(params)
      
  
      console.log('txn completed:', transactionHash)
      closeModal()
    }
  
    // -----------
  
    const closeModal = () => {
      setGlobalState('modal', 'scale-0')
      resetForm()
    }
  
    const resetForm = () => {
      // setFormInput({})
      setImgBase64(null)
    }
  
    return (
      <div
        className={`fixed top-0 left-0 w-screen h-screen flex items-center
            justify-center bg-black bg-opacity-50 transform
            transition-transform duration-300 ${modal}`}
      >
        <div className="bg-[#151c25] shadow-xl shadow-[#8A42D8] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
          <form className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold text-gray-400">Add Event</p>
              <button
                type="button"
                onClick={closeModal}
                className="border-0 bg-transparent focus:outline-none"
              >
                <FaTimes className="text-gray-400" />
              </button>
            </div>
  
            <div className="flex flex-row justify-center items-center rounded-xl mt-5">
              <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
                <img
                  alt="NFT"
                  className="h-full w-full object-cover cursor-pointer"
                  src={imgBase64 || './download.gif'}
                />
              </div>
            </div>
  
            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg, image/webp"
                  className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#19212c] file:text-gray-400
                      hover:file:bg-[#1d2631]
                      cursor-pointer focus:ring-0 focus:outline-none"
                  onChange={changeImage}
                  required
                />
                {/* <button onClick={click}>Debug</button> */}
              </label>
            </div>
  
            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
              <input
                className="block w-full text-sm
                    text-white bg-transparent border-0
                    focus:outline-none focus:ring-0 py-1 ml-2"
                type="text"
                name="title"
                placeholder="Name"
                onChange={(e) =>
                  setFormInput({ ...formInput, name: e.target.value })
                }
                required
              />
            </div>
  
            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
              <textarea
                className="block w-full text-sm resize-none
                    text-white bg-transparent border-0
                    focus:outline-none focus:ring-0 h-19 ml-2 mt-2"
                type="text"
                name="description"
                placeholder="Description"
                onChange={(e) =>
                  setFormInput({ ...formInput, description: e.target.value })
                }
                required
              ></textarea>
            </div>
  
            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
              <input
                className="block w-full text-sm
                    text-white bg-transparent border-0
                    focus:outline-none focus:ring-0 py-1 ml-2"
                type="text"
                name="venue"
                placeholder="Venue"
                onChange={(e) =>
                  setFormInput({ ...formInput, venue: e.target.value })
                }
                required
              />
            </div>
  
            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
              <input
                className="block w-full text-sm
                    text-slate-500 bg-transparent border-0
                    focus:outline-none focus:ring-0 ml-2 py-1"
                type="date"
                name="date"
                placeholder="Date"
                onChange={(e) =>
                  setFormInput({ ...formInput, date: e.target.value })
                }
                required
              />
            </div>
  
            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
              <input
                className="block w-full text-sm
                    text-white bg-transparent border-0
                    focus:outline-none focus:ring-0 py-1 ml-2"
                type="number"
                name="host"
                placeholder="Supply"
                onChange={(e) =>
                  setFormInput({ ...formInput, supply: e.target.value })
                }
                required
              />
            </div>
  
            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
              <input
                className="block w-full text-sm
                    text-white bg-transparent border-0
                    focus:outline-none focus:ring-0 py-1 ml-2"
                type="number"
                step={0.01}
                min={0.01}
                name="price"
                placeholder="Price (MATIC)"
                onChange={(e) =>
                  setFormInput({ ...formInput, price: e.target.value })
                }
                required
              />
            </div>
  
            <button
              onClick={mint}
              className="flex flex-row justify-center items-center
                  w-full text-white text-md bg-[#8A42D8]
                  py-2 px-5 rounded-full
                  drop-shadow-xl border border-transparent
                  hover:bg-transparent hover:text-[#8A42D8]
                  hover:border hover:bg-indigo-700
                  focus:outline-none focus:ring mt-5"
            >
              Host Event
            </button>
          </form>
        </div>
      </div>
    )
  }
  
  export default CreateNFT
  