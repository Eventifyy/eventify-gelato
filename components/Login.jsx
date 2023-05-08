import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import "@biconomy/web3-auth/dist/src/style.css";
import { useEffect, useState, useCallback, memo } from "react";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { setSmartAcc, setUserInfo, setSAddress } from "../store/index.js";
import Middleware from "./Middleware.jsx";

function Login() {
    const dispatch = useDispatch();
    const [sdk, setSdk] = useState();
    const { smartAcc, sAddress, userInfo } = useSelector(
        (state) => state.login
    );
    const [eAddress, setEAddress] = useState();

    const whitelistDomainName = process.env.NEXT_PUBLIC_DomainName;
    const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;
    const BiconomyAPI = process.env.NEXT_PUBLIC_BiconomyAPI;

    //
    // useEffect(() => {
    //     checkLogin();
    // }, []);

    // const checkLogin = async () => {
    //     const socialLoginSDK = new SocialLogin();
    //     const signature = await socialLoginSDK.whitelistUrl(
    //         "http://localhost:3000/"
    //     );
    //     // const signature2 = await socialLoginSDK.whitelistUrl(
    //     //     `${whitelistDomainName}`
    //     // );
    //     await socialLoginSDK.init({
    //         whitelistUrls: {
    //             "http://localhost:3000/": signature,
    //             // whitelistDomainName: signature2,
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
    //

    // const smartAcc = useSelector(state => state.login.smartAcc);
    // const sAddress = useSelector(state => state.login.sAddress);
    // const userInfo = useSelector(state => state.login.userInfo);

    // const [smartAcc, setSmartAcc] = useState(); //this to host, events
    // const [sAddress, setSAddress] = useState(); //this to dashboard
    // const [userInfo, setUserInfo] = useState(null); //this to dashboard

    useEffect(() => {
        initiate();
    }, []);

    useEffect(() => {
        if (sdk?.provider) {
            connect();
        }
    }, [sdk]);

    const initiate = async () =>{
        const socialLoginSDK = new SocialLogin();

        const signature = await socialLoginSDK.whitelistUrl(
            "http://localhost:3000/"
        );
        const signature2 = await socialLoginSDK.whitelistUrl(
            `${whitelistDomainName}`
        );
        await socialLoginSDK.init({
            whitelistUrls: {
                "http://localhost:3000/": signature,
                whitelistDomainName: signature2,
            },
        });
        setSdk(socialLoginSDK);
    }

    // 

    const connect = async () => {
        sdk.showWallet();
        if (!sdk?.provider) return;
        const provider = new ethers.providers.Web3Provider(sdk.provider);
        // const walletProvider = new ethers.providers.Web3Provider(provider);
        const accounts = await provider.listAccounts();
        setEAddress(accounts);
        sdk.hideWallet();
        await getUserInfo();
        if (smartAcc) return;
        
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

        let smartAccount = new SmartAccount(provider, options);
        smartAccount = await smartAccount.init();
        dispatch(setSmartAcc(smartAccount));

        const { data } = await smartAccount.getSmartAccountsByOwner({
            chainId: 80001,
            owner: accounts,
        });
        dispatch(setSAddress(data[0].smartAccountAddress));
        // console.log("smart account", sAddress);
    }

    const disconnect = async () => {
        if (!sdk || !sdk.web3auth) {
            console.error("Web3Modal not initialized.");
            return;
        }
        await sdk.logout();
        setWProvider(null);
        dispatch(setSmartAcc(null));
        setEAddress(null);
        dispatch(setSAddress(null));
        dispatch(setUserInfo(null));
        window.getSocialLoginSDK = null;
        sdk.hideWallet();
        sdk(null);
    }

    const getUserInfo = useCallback(async () => {
        if (sdk) {
            const resUserInfo = await sdk.getUserInfo()
            dispatch(setUserInfo(resUserInfo));
            // console.log("userInfo", userInfo);
        }
    }, [sdk]);

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
            <Middleware />
        </div>
    );
}

export default memo(Login);
