import { ParticleProvider } from "@particle-network/provider";
import { ethers } from "ethers";
import axios from "axios";
import { address, abi, pn } from "./config";

export const getEthersProvider = () => {
    const particleProvider = new ParticleProvider(pn.auth);
    const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
    );
    return ethersProvider
};

    // const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;
    // const provider = new ethers.providers.JsonRpcProvider(
    //     `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`
    // );

export const fetchEvents = async () => {
    const ethersProvider = getEthersProvider()
    const contract = new ethers.Contract(address, abi, ethersProvider);
    const data = await contract.activeEvents();
    const itemsFetched = await Promise.all(
        data.map(async (i) => {
            const tokenUri = await contract.uri(i.tokenId.toString());
            // console.log(tokenUri);
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

    console.log("events", itemsFetched);

    return itemsFetched;
};

export const fetchDashboard = async (xAddress) => {
    const ethersProvider = getEthersProvider()
    const contract = new ethers.Contract(address, abi, ethersProvider);
    const data = await contract.inventory(xAddress);
    // const data = await contract.activeEvents();
    const itemsFetched = await Promise.all(
        data.map(async (i) => {
            const tokenUri = await contract.uri(i.tokenId.toString());
            // console.log(tokenUri);
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

    console.log("dashboard", itemsFetched);

    return itemsFetched;
};
