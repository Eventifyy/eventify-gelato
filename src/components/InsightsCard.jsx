'use client';

import { motion } from 'framer-motion';
// import Link from 'next/link';
import { Link } from 'react-router-dom';

const InsightCard = (props) => {
  console.log(props.cover)
  const date = new Date(props.date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString(undefined, options);  


  return(
    

  <motion.div
    className="flex md:flex-row flex-col gap-4"
  >
    
    
    <img
      src={props.cover}
      className="md:w-[270px] w-full h-[250px] rounded-[32px] object-cover"
    />
    <div className="w-full flex justify-between items-center">
    <div className="flex-1 md:ml-[62px] flex flex-col max-w-[650px]">

      <h4 className="font-normal lg:text-[42px] text-[26px] text-white">
        {props.name}
      </h4>

      <h2 className="tracking-widest text-indigo-xs title-font font-medium text-gray-400">{formattedDate}</h2>

      <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">{props.venue}
      </a>
      
      <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Remaining: {props.remaining}</a>
      
      <p className="mt-[10px] font-normal lg:text-[20px] text-[14px] text-[#C6C6C6]">
        {props.description}
      </p>
      
     
      <Link href={props.buyLink}  className=" inline-flex items-center justify-center rounded-md border border-transparent bg-[#8A42D8] px-2 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">

      <button >Buy Now</button> 
      </Link>

    </div>
  </div>

  </motion.div>
  )
}


export default InsightCard;
