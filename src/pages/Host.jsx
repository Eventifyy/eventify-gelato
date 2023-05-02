import { useEffect, useState } from 'react';
// import { PaperEmbeddedWalletSdk, UserStatus } from "@paperxyz/embedded-wallet-service-sdk";
import CreateNFT from '../components/CreateNFT';
import WhatsNew from '../components/WhatsNew';
import Footer from '../components/Footer';
import Features from '../components/Features';
import HostComponent from '../components/HostComponents';

export default function Host() {

    // const [ status, setStatus ] = useState()
    // const [userAddr, setUserAddr] = useState();
    // const [sdk, setSdk] = useState()
    
    // const clientId = process.env.NEXT_PUBLIC_PAPER_KEY
    
    // useEffect(()=> {
    //     fetchAddr()
    // }, [])

    // useEffect(() => {
    //     setSdk(new PaperEmbeddedWalletSdk({
    //         clientId: clientId,
    //         chain: 'Mumbai',
    //     }))
    // }, [])
    
    // async function fetchAddr() {
    //     if (sdk) {
    //         const result = await sdk.getUser();
    //         setUserAddr(result?.walletAddress)
    //     }
	// }

    
    

    return (


        <div className="bg-[#00040f] overflow-hidden">
                    {/* <div className="gradient-03 z-0" /> */}


        {/* <HostComponent /> */}
        <HostComponent/>

      <div className="relative">
        <div className="gradient-03 z-0" />
          <Features />
          <div className="gradient-03 z-0" />
          <WhatsNew/>
          <Footer/>
          <CreateNFT/>
        </div>
        </div>

    )
}