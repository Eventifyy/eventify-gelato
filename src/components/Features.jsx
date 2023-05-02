'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from "react";
import Lottie from "lottie-web";
import styles from '../styles/style';
import { startingFeatures } from '../constants';
import StartSteps from './StartSteps';
import { TitleText } from './CustomTexts';
import { staggerContainer, fadeIn, planetVariants } from '../utils/motion';

const Features = () => {

  const containerRef = useRef(null);
    const animationRef = useRef(null);
  


    useEffect(() => {
      animationRef.current = Lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        // animationData: require('../public/4429-ticket-scanning.json'),
      });
  
      return () => {
        animationRef.current.destroy();
      };
    }, []);

  
  return(
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-8`}
    >
      <motion.div
        variants={planetVariants('left')}
        className={`flex-1 ${styles.flexCenter}`}
      >
        
      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`} ref={containerRef}/>

      </motion.div>
      <motion.div
        variants={fadeIn('left', 'tween', 0.2, 1)}
        className="flex-[0.75] flex justify-center flex-col"
      >
        {/* <TypingText title="| How Eventify Works" /> */}
        <TitleText title={<>How to use Eventify</>} />
        <div className="mt-[31px] flex flex-col max-w-[370px] gap-[24px]">
          {startingFeatures.map((feature, index) => (
            <StartSteps
              key={feature}
              number={`${index < 10 ? '0' : ''} ${index + 1}`}
              text={feature}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  </section>
  )
}
;

export default Features;
