/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { address, abi } from "../config";
import { ethers } from "ethers";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Events() {
    const [items, setItems] = useState([]);

    // const [smartAcc, setSmartAcc] = useState();
    const smartAcc = useSelector(state => state.login.smartAcc);
    console.log("smart acc", smartAcc)

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
                // const meta = await axios.get(tokenUri + "/");
                let price = ethers.utils.formatEther(i.price);
                let item = {
                    price,
                    // name: meta.data.name,
                    // cover: meta.data.cover,
                    // description: meta.data.description,
                    // date: meta.data.date,
                    // venue: meta.data.venue,
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

        const erc20Interface = new ethers.utils.Interface([
            "function claimTicket(uint256 _ticketId)",
        ]);

        const data = erc20Interface.encodeFunctionData("claimTicket", [
            _ticketId,
        ]);

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
            <div>
                <img
                    src={prop.cover}
                    alt=""
                    className="md:w-[270px] w-full h-[250px] rounded-[32px] object-cover"
                />
                <div className="w-full flex justify-between items-center">
                    <div className="flex-1 md:ml-[62px] flex flex-col max-w-[650px]">
                        <h4 className="font-normal lg:text-[42px] text-[26px] text-white">
                            {prop.name}
                        </h4>

                        <h2 className="tracking-widest text-indigo-xs title-font font-medium text-gray-400">
                            {formattedDate}
                        </h2>

                        <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                            {prop.venue}
                        </a>

                        <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                            Remaining: {prop.remaining}
                        </a>

                        <p className="mt-[10px] font-normal lg:text-[20px] text-[14px] text-[#C6C6C6]">
                            {prop.description}
                        </p>

                        <div
                            onClick={() => claim(prop)}
                            className=" inline-flex items-center justify-center rounded-md border border-transparent bg-[#8A42D8] px-2 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            <p>Claim</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function debug1() {
        fetchEvents();
        console.log(items);
    }

    return (
        <div>
            <p>events</p>
            <button onClick={debug1}>test 1</button>
            {items.map((item, i) => (
                <Card
                    key={i}
                    price={item.price}
                    // name={item.name}
                    // cover={item.cover}
                    // description={item.description}
                    // date={item.date}
                    // venue={item.venue}
                    supply={item.supply}
                    tokenId={item.supply}
                    remaining={item.remaining}
                    host={item.host}
                />
            ))}
        </div>
    );
}
