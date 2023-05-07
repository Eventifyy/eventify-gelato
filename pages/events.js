/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { address, abi } from "../config";
import { ethers } from "ethers";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";
import LocationSvg from "../assets/images/location.png";
import Image from "next/image";
import counter from "../assets/images/counter.png";

export default function Events() {
  const [items, setItems] = useState([]);

  // const [smartAcc, setSmartAcc] = useState();
  const smartAcc = useSelector((state) => state.login.smartAcc);

  useEffect(() => {
    fetchEvents();
  }, []);

  const INFURA_ID = process.env.NEXT_PUBLIC_INFURA;
  const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;

  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`
    // `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`
  );

  async function fetchEvents() {
    const contract = new ethers.Contract(address, abi, provider);
    const data = await contract.activeEvents();
    const itemsFetched = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.uri(i.tokenId.toString());
        console.log(tokenUri);
        const meta = await axios.get(tokenUri + "/");
        // let price = ethers.utils.formatEther(i.price);
        let item = {
          // price,
          name: meta.data.name,
          cover: meta.data.cover,
          description: meta.data.description,
          date: meta.data.date,
          venue: meta.data.venue,
          supply: i.supply.toNumber(),
          tokenId: i.tokenId.toNumber(),
          remaining: i.remaining.toNumber(),
          host: i.host,
        };
        return item;
      })
    );

    setItems(itemsFetched);
    console.log(itemsFetched);
  }

  async function claim(prop) {
    //
    console.log("started");

    const _ticketId = prop.tokenId;
    console.log(_ticketId);

    const erc20Interface = new ethers.utils.Interface([
      "function claimTicket(uint256 _ticketId)",
    ]);

    const data = erc20Interface.encodeFunctionData("claimTicket", [_ticketId]);

    const tx1 = {
      to: address,
      data,
    };

    smartAcc.on("txHashGenerated", (response) => {
      console.log("txHashGenerated event received via emitter", response);
    });
    smartAcc.on("onHashChanged", (response) => {
      console.log("onHashChanged event received via emitter", response);
    });
    smartAcc.on("txMined", (response) => {
      console.log("txMined event received via emitter", response);
    });
    smartAcc.on("error", (response) => {
      console.log("error event received via emitter", response);
    });

    // Sending gasless transaction
    const txResponse = await smartAcc.sendTransaction({
      transaction: tx1,
      // gasLimit: 1000000,
    });
    console.log("userOp hash", txResponse.hash);

    const txReceipt = await txResponse.wait();
    console.log("Tx hash", txReceipt.transactionHash);

    console.log("done");
    //
  }

  function Card(prop) {
    const date = new Date(prop.date);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);

    return (
      <div
        style={{ borderTopLeftRadius: 0 }}
        className="mx-auto bg-violet-800 w-3/4 flex py-10 rounded-[32px] relative right-10"
      >
        <div className="w-full flex gap-8 items-center px-14">
          <div className="flex-1 flex max-w-[650px] items-center">
            <div className=" ">
              <h4 className="font-normal lg:text-[42px] text-[26px] text-white capitalize fancy-font">
                {prop.name}
              </h4>

              <p className="mt-[10px] font-normal lg:text-[20px] text-[14px] text-[#C6C6C6]">
                {prop.description}
              </p>

              <div
                onClick={() => claim(prop)}
                className="mt-4 rounded-3xl inline-flex items-center justify-center border border-transparent bg-[#8A42D8] px-8 py-2 font-semibold text-md shadow-sm hover:bg-indigo-700 bg-white text-black"
              >
                <p>Claim</p>
              </div>
            </div>

            <div className="ml-20">
              <p className="text-sm">Join on-</p>
              <h2 className="tracking-widest text-indigo-xs title-font font-medium text-gray-400 text-6xl uppercase text-white fancy-font">
                {formattedDate}
              </h2>

              <div className="flex gap-2 mt-8 ml-2">
                <div className="rounded-full p-1 border-white border w-8 h-8">
                  <Image src={LocationSvg} />
                </div>
                <a className="text-white inline-flex items-center md:mb-2 lg:mb-0">
                  {prop.venue}
                </a>
              </div>

              <div className="flex gap-2 mt-3 ml-2">
                <div className="rounded-full p-1 border-white border w-8 h-8">
                  <Image src={counter} />
                </div>

                <a className="text-white inline-flex items-center md:mb-2 lg:mb-0">
                  Remaining: {prop.remaining}
                </a>
              </div>
            </div>
          </div>
        </div>
        <img
          src={prop.cover}
          alt=""
          style={{ borderBottomRightRadius: 0 }}
          className="md:w-[270px] w-full h-[250px] rounded-[32px] object-cover relative translate-x-1/2"
        />
      </div>
    );
  }

  function debug1() {
    fetchEvents();
    console.log(items);
  }

  return (
    <div className="b">
        <h2 className="text-center text-4xl my-6 mb-7">Featured Events</h2>
      {/* <p>events</p>
      <button onClick={debug1}>test 1</button> */}
      {items.map((item, i) => (
        <Card
          key={i}
          //   price={item.price}
          name={item.name}
          cover={item.cover}
          description={item.description}
          date={item.date}
          venue={item.venue}
          supply={item.supply}
          tokenId={item.tokenId}
          remaining={item.remaining}
          host={item.host}
        />
      ))}
    </div>
  );
}
