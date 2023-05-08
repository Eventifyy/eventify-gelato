import { ethers } from "ethers";
import axios from "axios";
import { address, abi } from "../config";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import "@biconomy/web3-auth/dist/src/style.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEventItems, setDashboardItems } from "../store/index.js";

export default function Middleware() {
    const dispatch = useDispatch();

    const { sAddress } = useSelector((state) => state.login);
    const { eventItems, dashboardItems } = useSelector((state) => state.login);
    // const [eAddress, setEAddress] = useState();

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (sAddress) {
            fetchDashboard();
        }
    }, [sAddress]);

    const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;
    // const BiconomyAPI = process.env.NEXT_PUBLIC_BiconomyAPI;
    // const whitelistDomainName = process.env.NEXT_PUBLIC_DomainName;

    const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`
    );

    // const checkLogin = async () => {
    //     const socialLoginSDK = new SocialLogin();
    //     const signature = await socialLoginSDK.whitelistUrl(
    //         "http://localhost:3000/"
    //     );
    //     const signature2 = await socialLoginSDK.whitelistUrl(
    //         `${whitelistDomainName}`
    //     );
    //     await socialLoginSDK.init({
    //         whitelistUrls: {
    //             "http://localhost:3000/": signature,
    //             whitelistDomainName: signature2,
    //         },
    //     });
    //     setSdk(socialLoginSDK);

    //     if (sdk?.provider) {
    //         connect();
    //     }
    // };

    // const connect = async () => {
    //     sdk.showWallet();
    //     if (!sdk?.provider) return;
    //     const provider = new ethers.providers.Web3Provider(sdk.provider);

    //     const accounts = await provider.listAccounts();
    //     setEAddress(accounts);
    //     sdk.hideWallet();
    //     await getUserInfo();
    //     if (smartAcc) return;

    //     let options = {
    //         activeNetworkId: ChainId.POLYGON_MUMBAI,
    //         supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
    //         networkConfig: [
    //             {
    //                 chainId: ChainId.POLYGON_MUMBAI,
    //                 dappAPIKey: BiconomyAPI,
    //                 providerUrl: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`,
    //             },
    //         ],
    //     };

    //     let smartAccount = new SmartAccount(provider, options);
    //     smartAccount = await smartAccount.init();
    //     dispatch(setSmartAcc(smartAccount));

    //     const { data } = await smartAccount.getSmartAccountsByOwner({
    //         chainId: 80001,
    //         owner: accounts,
    //     });
    //     dispatch(setSAddress(data[0].smartAccountAddress));
    //     console.log("Smart Account", sAddress);
    // };

    // const getUserInfo = async () => {
    //     if (sdk) {
    //         const userInfo = await sdk.getUserInfo();
    //         console.log("userInfo", userInfo);
    //         dispatch(setUserInfo(userInfo));
    //     }
    // };

    // const disconnect = async () => {
    //     if (!sdk || !sdk.web3auth) {
    //         console.error("Web3Modal not initialized.");
    //         return;
    //     }
    //     await sdk.logout();
    //     setWProvider(null);
    //     dispatch(setSmartAcc(null));
    //     setEAddress(null);
    //     dispatch(setSAddress(null));
    //     dispatch(setUserInfo(null));
    //     window.getSocialLoginSDK = null;
    //     sdk.hideWallet();
    //     sdk(null);
    // };

    const fetchEvents = async () => {
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

        dispatch(setEventItems(itemsFetched));
        console.log("events", eventItems);
    };

    const fetchDashboard = async () => {
        const contract = new ethers.Contract(address, abi, provider);
        const data = await contract.inventory(sAddress);
        // const data = await contract.activeEvents();
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

        dispatch(setDashboardItems(itemsFetched));
        console.log("dashboard", dashboardItems);
    };
}
