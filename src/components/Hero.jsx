import Lottie from "lottie-web";
import { useEffect, useRef } from "react";
import styles from "../styles/style";
import { Heroelement } from "../assets";
 const Hero = () => {
    const containerRef = useRef(null);
    const animationRef = useRef(null);
  
    useEffect(() => {
      animationRef.current = Lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        // animationData: require('../assets/hero.json'),
      });
  
      return () => {
        animationRef.current.destroy();
      };
    }, []);
  
  


  return (

    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY} ml-10`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>


        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
            The Next <br className="sm:block hidden" />{" "}
            <span className="text-gradient">Generation</span>{" "}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0">
            {/* <GetStarted /> */}
          </div>
        </div>

        <h1 className=" font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full">
          Ticket Booking Dapp
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5  font-normal lg:text-[20px] text-[14px] text-secondary-white`}>
        Eventify is a cutting-edge NFT ticketing platform that prioritizes an exceptional user interface and experience. Like other popular Web2 platforms, users can log in using their Google credentials and purchase NFT tickets with their credit cards or Google Pay. 

        </p>
      </div>

      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`} ref={containerRef}>

        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        {/* <GetStarted /> */}
      </div>
    </section>
    )
}

export default Hero;