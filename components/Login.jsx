import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import "@biconomy/web3-auth/dist/src/style.css";
import { useEffect, useState, useCallback, memo } from "react";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { setSmartAcc, setUserInfo, setSAddress, setEAddress } from "../store/index.js";
import { setEventItems, setDashboardItems } from "../store/index.js";
import axios from "axios";
import { address, abi } from "../config";

function Login() {
    const dispatch = useDispatch();
    const [sdk, setSdk] = useState();
    const { smartAcc, sAddress, userInfo, eAddress } = useSelector(
        (state) => state.login
    );
    const { eventItems, dashboardItems } = useSelector((state) => state.login);
    // const [eAddress, setEAddress] = useState();

    const WhitelistDOMAIN1 = process.env.NEXT_PUBLIC_WhitelistDOMAIN1;
    const WhitelistDOMAIN2 = process.env.NEXT_PUBLIC_WhitelistDOMAIN2;
    const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;
    const BiconomyAPI = process.env.NEXT_PUBLIC_BiconomyAPI;

    const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`
    );

    useEffect(() => {
        initiate();
        fetchEvents();
    }, []);

    useEffect(() => {
        if (sdk?.provider && smartAcc == "") {
            connect();
        }
    }, [sdk]);

    const initiate = async () => {
        const socialLoginSDK = new SocialLogin();

        const signature = await socialLoginSDK.whitelistUrl(
            "http://localhost:3000/"
        );
        const signature2 = await socialLoginSDK.whitelistUrl(
            `${WhitelistDOMAIN1}`
        );
        const signature3 = await socialLoginSDK.whitelistUrl(
            `${WhitelistDOMAIN2}`
        );
        await socialLoginSDK.init({
            whitelistUrls: {
                "http://localhost:3000/": signature,
                WhitelistDOMAIN1: signature2,
                WhitelistDOMAIN2: signature3,
            },
        });
        setSdk(socialLoginSDK);
        if (sdk?.provider) {
            connect();
        }
    };

    //

    const connect = async () => {
        sdk.showWallet();
        if (!sdk?.provider) return;
        const provider = new ethers.providers.Web3Provider(sdk.provider);
        // const walletProvider = new ethers.providers.Web3Provider(provider);
        const accounts = await provider.listAccounts();
        setEAddress(accounts);
        sdk.hideWallet();
    
        if (smartAcc) return;
        const data = [getUserInfo(), getSmartAccount(provider, accounts)]
        await Promise.all(data);

    };

    const getSmartAccount = async (xProvider, xAccounts) => {

        let options = {
            activeNetworkId: ChainId.POLYGON_MUMBAI,
            supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
            networkConfig: [
                {
                    chainId: ChainId.POLYGON_MUMBAI,
                    dappAPIKey: BiconomyAPI,
                    providerUrl: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`,
                },
            ],
        };

        let smartAccount = new SmartAccount(xProvider, options);
        smartAccount = await smartAccount.init();
        dispatch(setSmartAcc(smartAccount));

        const { data } = await smartAccount.getSmartAccountsByOwner({
            chainId: 80001,
            owner: xAccounts,
        });
        dispatch(setSAddress(data[0].smartAccountAddress));
        fetchDashboard(data[0].smartAccountAddress)
        // console.log("smart account", sAddress);
        console.log("sAddr")
        console.log("sAddr")
        console.log("sAddr")
        console.log("sAddr")
        console.log("sAddr")
        console.log("sAddr")
    }

    const disconnect = async () => {
        if (!sdk || !sdk.web3auth) {
            console.error("Web3Modal not initialized.");
            return;
        }
        await sdk.logout();
        dispatch(setEAddress(null));
        dispatch(setSAddress(null));
        dispatch(setSmartAcc(null));
        dispatch(setUserInfo(null));
        window.getSocialLoginSDK = null;
        sdk.hideWallet();
        setSdk(null);
    };

    const getUserInfo = useCallback(async () => {
        if (sdk) {
            const resUserInfo = await sdk.getUserInfo();
            dispatch(setUserInfo(resUserInfo));
            // console.log("userInfo", userInfo);
            console.log("uInfo")
            console.log("uInfo")
            console.log("uInfo")
            console.log("uInfo")
            console.log("uInfo")
            console.log("uInfo")
        }
    }, [sdk]);

    const fetchEvents = async () => {
        const contract = new ethers.Contract(address, abi, provider);
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

        dispatch(setEventItems(itemsFetched));
        console.log("events", eventItems);
    };

    const fetchDashboard = async (sAddr) => {
        const contract = new ethers.Contract(address, abi, provider);
        const data = await contract.inventory(sAddr);
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

        dispatch(setDashboardItems(itemsFetched));
        console.log("dashboard", dashboardItems);
    };

    //
    // async function initiateTx() {
    //     console.log("started");

    //     const recipientAddress = `0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB`;
    //     const calculatedAmount = 10 * Math.pow(10, 18);
    //     const amount = `${calculatedAmount}`;
    //     const usdcAddress = `0xE73305E0727b615592f54432873592792ccdBfFa`;

    //     console.log(amount);

    //     const erc20Interface = new ethers.utils.Interface([
    //         "function transfer(address _to, uint256 _value)",
    //     ]);
    //     // Encode an ERC-20 token transfer to recipient of the specified amount
    //     const data = erc20Interface.encodeFunctionData("transfer", [
    //         recipientAddress,
    //         amount,
    //     ]);

    //     const tx1 = {
    //         to: usdcAddress,
    //         data,
    //     };

    //     smartAcc.on("txHashGenerated", (response) => {
    //         console.log("txHashGenerated event received via emitter", response);
    //     });
    //     smartAcc.on("onHashChanged", (response) => {
    //         console.log("onHashChanged event received via emitter", response);
    //     });

    //     smartAcc.on("txMined", (response) => {
    //         console.log("txMined event received via emitter", response);
    //     });

    //     smartAcc.on("error", (response) => {
    //         console.log("error event received via emitter", response);
    //     });

    //     const txResponse = await smartAcc.sendTransaction({
    //         transaction: tx1,
    //     });
    //     console.log("userOp hash", txResponse.hash);

    //     const txReceipt = await txResponse.wait();
    //     console.log("Tx hash", txReceipt.transactionHash);

    //     console.log("done");
    // }
    //

    return (
        <div>
            {sdk?.provider ? (
                <button onClick={disconnect}>Logout</button>
            ) : (
                <button onClick={connect}>Login</button>
            )}
            {/* <Middleware /> */}
        </div>
    );
}

export default memo(Login);
