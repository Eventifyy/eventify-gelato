/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
// import {
//   PaperEmbeddedWalletSdk,
//   UserStatus,
// } from '@paperxyz/embedded-wallet-service-sdk'
// import { EventifyAddress, EventfiyAbi } from '../config'
// import { ethers } from 'ethers'
// import axios from 'axios'
import Footer from '../components/Footer'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useSelector } from 'react-redux'

export default function Dashboard() {
  // const [sdk, setSdk] = useState()
  // const [user, setUser] = useState({})
  const {user:userData}=useSelector(state=>state)
  console.log(userData)
  console.log("bruh")
  // const clientId = process.env.NEXT_PUBLIC_PAPER_KEY
  const date = new Date()
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const formattedDate = date.toLocaleDateString(undefined, options)
  const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     setSdk(
//       new PaperEmbeddedWalletSdk({
//         clientId: clientId,
//         chain: 'Mumbai',
//       }),
//     )
//   }, [])

//   useEffect(() => {
//     getUserInfo()
//   }, [sdk])
  
//   async function getUserInfo() {
//     if (sdk) {
//       const result = await sdk.getUser()
//       setUser(result)
//       fetch()
//     }
//   }

//   const [items, setItems] = useState([])
  // const [loaded, setLoaded] = useState(false)

//   useEffect(() => {}, [])

//   const INFURA_ID = process.env.NEXT_PUBLIC_INFURA

//   async function fetch() {
//     const provider = new ethers.providers.JsonRpcProvider(
//       `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`
//     );

//     setIsLoading(true)

//     const contract = new ethers.Contract(EventifyAddress, EventfiyAbi, provider)
//     const addr =  user.walletAddress
//     const data = await contract.inventory(`${addr}`)
//     const itemsFetched = await Promise.all(
//       data.map(async (i) => {
//         const tokenUri = await contract.uri(i.tokenId.toString())
//         const meta = await axios.get(tokenUri)
//         let price = ethers.utils.formatEther(i.price)
//         let item = {
//           price,
//           name: meta.data.name,
//           cover: meta.data.cover,
//           date: meta.data.date,
//           venue: meta.data.venue,
//           theme: meta.data.theme,
//           description: meta.data.description,
//           tokenId: i.tokenId.toNumber(),
//           supply: i.supply.toNumber(),
//           remaining: i.remaining.toNumber(),
//           buyLink: i.buyLink,
//         }
//         return item
//       }),
//     )

//     console.log(items)
//     setItems(itemsFetched)
//     setIsLoading(false)
//     setLoaded(true)
//   }

  function Card(prop) {
    return (
      <button className="w-[300px] flex flex-col justify-start p-3 ml-3 rounded-md bg-gray-200">
        <img
          className="h-40 rounded w-full object-cover object-center mb-3"
          src={prop.cover}
          alt="content"
        />
        <h4 className="font-semibold text-2xl text-black">{prop.name}</h4>
        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400">
          {formattedDate}
        </h2>
        <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
          {prop.venue}
        </a>
        <p className="mt-[10px] font-normal lg:text-[20px] text-[14px] text-gray-500">
          {prop.description}
        </p>{' '}
        <button
          className=" inline-flex items-center justify-center rounded-md border border-transparent bg-[#8A42D8] w-full px-2 py-2 text-base font-medium text-black shadow-sm hover:bg-indigo-700"
          onClick={prop.buyLink}
        >
          Buy Now
        </button>
      </button>
    )
  }

  function click() {
    console.log(user)
  }

  return (
    <section className="text-white body-font  bg-[#151c25] overflow-hidden">
      <div className="absolute z-[0] w-[40%] h-[35%] top-[20] pink__gradient" />
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-20">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
              Dashboard
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
          <div className="lg:w-1/2 w-full leading-relaxed text-white ">
            <div className="h-full flex items-center sm:justify-center justify-center text-center sm:text-left">
              <img
                alt="team"
                className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4"
                src="/people-01.png"
              />
              <div className="flex-grow sm:pl-8 ">
                <h2 className="title-font font-medium text-lg text-white">
                  {/* Rahul Kathuria */}
                </h2>
                <h2 className="title-font font-medium text-lg text-white">
                  {user?.authDetails?.email || ''}
                </h2>
                <h3 className="text-gray-500 mb-3">{user?.walletAddress || ''}</h3>
                <p className="mb-4">{user?.status || ''}</p>
                {/* <button onClick={click}>debug</button> */}
                <span className="inline-flex">
                  <a className="text-gray-500">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  </a>
                  <a className="ml-2 text-gray-500">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                    </svg>
                  </a>
                  <a className="ml-2 text-gray-500">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                    </svg>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 items-start h-[100vh] ">
          {loaded == true && !items.length ? (
            <h1 className="p-10 m-10 items-center font-semibold text-3xl ">
              No tickets bought!
            </h1>
          ) : (
            items.map((item, i) => (
              <Card
                key={1}
                price={item.price}
                name={item.name}
                cover={item.cover}
                date={item.date}
                venue={item.venue}
                theme={item.theme}
                tokenId={item.supply}
                supply={item.supply}
                remaining={item.remaining}
                host={item.host}
                buyLink={item.buyLink}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </section>
  )
}
