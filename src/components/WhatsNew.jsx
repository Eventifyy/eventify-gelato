'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from "react";
import Lottie from "lottie-web";
import styles from '../styles/style'; 
import { newFeatures } from '../constants';
import NewFeatures from './NewFeatures';
import { TitleText } from './CustomTexts';
import { planetVariants, staggerContainer, fadeIn } from '../utils/motion';

const WhatsNew = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = Lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      // animationData: require('../public/140193-tickets.json'),
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
        variants={fadeIn('right', 'tween', 0.2, 1)}
        className="flex-[0.95] flex justify-center flex-col"
      >
        {/* <TypingText title="| Whats new?" /> */}
        <TitleText title={<>Revolutionize your event experience with Eventify</>} />
        <div className="mt-[48px] flex flex-wrap justify-between gap-[24px]">
          {newFeatures.map((feature) => (
            <NewFeatures key={feature.title} {...feature} />
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={planetVariants('right')}
        className={`flex-1 ${styles.flexCenter}`}
      >
       
              <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`} ref={containerRef}/>
      </motion.div>
    </motion.div>
  </section>
  )
}


export default WhatsNew;
