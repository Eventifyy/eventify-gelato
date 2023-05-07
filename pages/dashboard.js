/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { address, abi } from "../config";
import { ethers } from "ethers";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Dashboard() {
    const [items, setItems] = useState([]);

    const sAddress = useSelector(state => state.login.sAddress);
    const userInfo = useSelector(state => state.login.userInfo);

    useEffect(() => {
        fetchDashboard();
    });

    const INFURA_ID = process.env.NEXT_PUBLIC_INFURA;
    const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;

    const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`
        // `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`
    );

    async function fetchDashboard() {
        const contract = new ethers.Contract(address, abi, provider);
        const data = await contract.inventory();
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
        console.log(items);
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

                        <button>Claim</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <p>test</p>
            {/* <img src={userInfo.profileImage} alt="" />
            <p>{userInfo.name}</p>
            <p>{userInfo.email}</p> */}
            <p>smart contract account : {sAddress}</p>

            <div>
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
        </div>
    );
}
