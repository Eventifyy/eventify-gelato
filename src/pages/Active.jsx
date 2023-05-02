/* eslint-disable jsx-a11y/alt-text */
import { motion } from 'framer-motion'
import styles from '../styles/style'
import { staggerContainer } from '../utils/motion'
import InsightCard from '../components/InsightsCard'
import { TitleText } from '../components/CustomTexts'
// import { PaperEmbeddedWalletSdk } from '@paperxyz/embedded-wallet-service-sdk'
// import Image from 'next/image'
import { useEffect, useState } from 'react'
// import { EventifyAddress, EventfiyAbi } from '../config'
// import { ethers } from 'ethers'
// import axios from 'axios'
import { socials } from '../constants'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { footerVariants } from '../utils/motion'
// import Link from 'next/link'
import { Link } from 'react-router-dom'
const Active = () => {
//   const [items, setItems] = useState([])
//   const [loaded, setLoaded] = useState(false)
//   const [sdk, setSdk] = useState()
//   const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)

//   console.log(items, 'items loaded')
//   useEffect(() => {
//     fetch()
//   }, [])

//   const clientId = process.env.NEXT_PUBLIC_PAPER_KEY

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
//       setUser(result?.walletAddress || '')
//     }
//   }

//   const INFURA_ID = process.env.NEXT_PUBLIC_INFURA

//   const provider = new ethers.providers.JsonRpcProvider(
//     `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`,
//   )


//   async function fetch() {
//     const contract = new ethers.Contract(EventifyAddress, EventfiyAbi, provider)
//     setIsLoading(true)
//     const data = await contract.activeEvents()
//     const itemsFetched = await Promise.all(
//       data.map(async (i) => {
//         const tokenUri = await contract.uri(i.tokenId.toString())
//         console.log(tokenUri)
//         const meta = await axios.get(tokenUri + "/")
//         let price = ethers.utils.formatEther(i.price)
//         let item = {
//           price,
//           name: meta.data.name,
//           cover: meta.data.cover,
//           description: meta.data.description,
//           date: meta.data.date,
//           venue: meta.data.venue,
//           supply: i.supply.toNumber(),
//           tokenId: i.tokenId.toNumber(),
//           remaining: i.remaining.toNumber(),
//           host: i.host,
//           buyLink: i.buyLink.toString(),
//         }
//         return item
//       }),
//     )

    // setItems(itemsFetched)
    // console.log(itemsFetched);
    // setLoaded(true)
    // setIsLoading(false)
//   }

//   function click() {}

  return (
    <div className="overflow-hidden w-100vh">
      <div className="absolute z-[0] w-[40%] h-[35%] top-[20] pink__gradient" />
      <section
        className={`bg-[#151c25] sm:p-16 xs:p-8 px-10 py-12 relative z-10 w-100vh`}
      >


                
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className={`${styles.innerWidth} mx-auto flex flex-col`}
        >
          <div className="gradient-03 z-[-1]" />
          {/* <div className="gradient-04 z-0" /> */}

          {/* <TypingText title="| Insight" textStyles="text-center" /> */}
          <TitleText
            title={<>Insight about Featured events</>}
            textStyles="text-center"
          />
          <div className="mt-[50px] flex flex-col gap-[60px] h-[100vh]">
            {isLoading ? (
              <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <motion.div className="flex md:flex-row flex-col gap-4">
                  <div className="md:w-[270px] w-full h-[250px] rounded-[32px] object-cover">
                    <Skeleton width={250} height={250} />
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex-1 md:ml-[62px] flex flex-col max-w-[650px]">
                      <h4 className="font-normal lg:text-[42px] text-[26px] text-white">
                        <Skeleton />
                      </h4>
                      <h2 className="tracking-widest text-xs title-font font-medium text-gray-400">
                        {' '}
                        <Skeleton />
                      </h2>
                      <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                        <Skeleton />{' '}
                      </a>

                      <p className="mt-[10px] font-normal lg:text-[20px] text-[14px] text-[#C6C6C6]">
                        <Skeleton />{' '}
                      </p>

                      {/* <button className=" inline-flex items-center justify-center rounded-md border border-transparent px-2 py-2 text-base font-medium text-black shadow-sm hover:bg-indigo-700">
                        {' '}
                        <Skeleton />
                      </button> */}
                      <Skeleton height={40}/>
                    </div>
                  </div>
                </motion.div>
             
              </SkeletonTheme>
            ) :
             (
            //   items.map((item, i) => {
            //     return (
            //       <InsightCard
            //         key={i}
            //         price={item.price}
            //         name={item.name}
            //         cover={item.cover}
            //         date={item.date}
            //         venue={item.venue}
            //         theme={item.theme}
            //         tokenId={item.supply}
            //         supply={item.supply}
            //         remaining={item.remaining}
            //         description={item.description}
            //         host={item.host}
            //         buyLink={item.buyLink}
            //       />
            //     )
            //   })
            console.log('hi')
            )}
          </div>
        </motion.div>
      </section>
      <div className="bg-[#151c25] ">
      <motion.footer
    variants={footerVariants}
    initial="hidden"
    whileInView="show"
    className={`${styles.xPaddings} py-8 relative`}
  >
    <div className="footer-gradient" />
    <div className={`${styles.innerWidth} mx-auto flex flex-col gap-8`}>
      <div className="flex items-center justify-between flex-wrap gap-5">
        <h4 className="font-bold md:text-[64px] text-[44px] text-white">
          {/* Book your Tickets */}
        </h4>
        <Link href="/host">
        <button type="button" className="flex items-center h-fit py-4 px-6 bg-[#8A42D8] rounded-[32px] gap-[12px]" >
          <img
            src="/headset.svg"
            alt="headset"
            className="w-[24px] h-[24px] object-contain"
          />
          
          <span className="font-normal text-[16px] text-white">
            Book Now
          </span>
        </button>
        </Link>
      </div>

      <div className="flex flex-col">
        <div className="mb-[50px] h-[2px] bg-white opacity-10" />

        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* <h4 className="font-extrabold text-[24px] text-white">
            EVENTIFY
          </h4> */}
          <img
          width={120}
          height={40}
          src='/logo.svg'
          />
          <p className="font-normal text-[14px] text-white opacity-50">
            Copyright © 2023 Eventify. All rights reserved.
          </p>

          <div className="flex gap-4">
            {socials.map((social) => (
              <img
                key={social.name}
                src={social.url}
                alt={social.name}
                className="w-[24px] h-[24px] object-contain cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.footer>
      </div>
    </div>
  )
}

export default Active
