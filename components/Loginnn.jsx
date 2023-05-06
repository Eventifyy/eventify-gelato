import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css";
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

import SmartAccount from "@biconomy/smart-account";
import { IPaymaster, ChainId } from "@biconomy/core-types";
// import { useDispatch } from "react-redux";
// import { setUser } from "./UserSlice";

export default function Login() {
    //   const dispatch=useDispatch();
    const [sdk, setSdk] = useState();
    const [web3State, setWeb3State] = useState({
        provider: null,
        web3Provider: null,
        ethersProvider: null,
        address: "",
        chainId: "80001",
    });
    const [userInfo, setUserInfo] = useState(null);
    const [smartAccountAddr, setSmartAccountAddr] = useState(null);
    const [smartAccountHook, setSmartAccountHook] = useState();

    const [loading, setLoading] = useState(false);

    const { provider, web3Provider, ethersProvider, address, chainId } =
        web3State;

    useEffect(() => {
        initiate();
    }, []);

    useEffect(() => {
        if (sdk && sdk.provider) {
            // console.log("hideWallet");
            connect();
            sdk.hideWallet();
        }
    }, [address, sdk]);

    const initiate = async () => {
        setLoading(true);
        const socialLogin = new SocialLogin();
        await socialLogin.init();
        setSdk(socialLogin);
        // getUserInfo();
        setLoading(false);
    };

    const connect = async () => {
        if (!sdk?.provider) {
            sdk.showWallet();
        }
        setLoading(true);
        // console.info("socialLoginSDK.provider", sdk.provider);
        const web3Provider = new ethers.providers.Web3Provider(sdk.provider);
        const signer = web3Provider.getSigner();
        const gotAccount = await signer.getAddress();
        const network = await web3Provider.getNetwork();
        setWeb3State({
            provider: sdk.provider,
            web3Provider: web3Provider,
            ethersProvider: web3Provider,
            address: gotAccount,
            chainId: Number(network.chainId),
        });

        getSmartAccount();
        getUserInfo();
        setLoading(false);
        return;
    };

    const getUserInfo = useCallback(async () => {
        if (sdk) {
            const userInfo = await sdk.getUserInfo();
            // dispatch(setUser(userInfo));
            console.log("userInfo", userInfo);
            setUserInfo(userInfo);
        }
    }, [sdk]);

    const disconnect = useCallback(async () => {
        if (!sdk || !sdk.web3auth) {
            console.error("Web3Modal not initialized.");
            return;
        }
        await sdk.logout();
        setWeb3State({
            provider: null,
            web3Provider: null,
            ethersProvider: null,
            address: "",
            chainId: "80001",
        });
        setUserInfo(null);
        setSmartAccountAddr(null);
        window.getSocialLoginSDK = null;
        sdk.hideWallet();
        sdk(null);
    }, [sdk]);

    async function getSmartAccount() {
        let options = {
            activeNetworkId: 8001,
            supportedNetworksIds: [80001],
            networkConfig: [
                {
                    chainId: 80001,
                    dappAPIKey: `XgEQygbsd.f88d0281-18a8-400a-a2d3-96feee91df8a`,
                    providerUrl: `https://polygon-mumbai.g.alchemy.com/v2/y-OHK68UTXZAj8NQU8Knz2bTee5IHXqP`,
                },
            ],
        };
        let smartAccount = new SmartAccount(web3Provider, options);
        smartAccount = await smartAccount.init();
        const { data } = await smartAccount.getSmartAccountsByOwner({
            chainId: 80001,
            owner: address,
        });
        setSmartAccountHook(smartAccount);
        setSmartAccountAddr(data[0].smartAccountAddress);

        // console.log("shit", web3Provider);
        // console.log("hook shook", smartAccountHook);

    }

    async function sendTx() {
        const recipientAddress = `0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB`;
        const amount = `10`;
        const usdcAddress = `0x84A96316b05372685c450947d4A3384de635437A`;

        const erc20Interface = new ethers.utils.Interface([
            "function transfer(address _to, uint256 _value)",
        ]);

        const encodedData = erc20Interface.encodeFunctionData("transfer", [
            recipientAddress,
            amount,
        ]);

        const tx = {
            to: usdcAddress, // destination smart contract address
            data: encodedData,
        };

        smartAccountHook.on("txHashGenerated", (response) => {
            console.log("txHashGenerated event received via emitter", response);
        });
        smartAccountHook.on("onHashChanged", (response) => {
            console.log("onHashChanged event received via emitter", response);
        });

        smartAccountHook.on("txMined", (response) => {
            console.log("txMined event received via emitter", response);
        });

        smartAccountHook.on("error", (response) => {
            console.log("error event received via emitter", response);
        });

        const txResponse = await smartAccountHook.sendTransaction({
            transaction: tx,
        });
        console.log("userOp hash", txResponse.hash);

        const txReceipt = await txResponse.wait();
        console.log("Tx hash", txReceipt.transactionHash);
    }

    async function debug() {
        const response = web3Provider.getSigner();
        console.log(response);
    }

    function test1() {
        console.log(web3Provider);
    }

    function test2() {
        connect();
    }

    return (
        <div className="text-white">
            {address ? (
                <button onClick={disconnect}>Logout</button>
            ) : (
                <button onClick={connect}>Login</button>
            )}
            <p>shit below</p>
            <p>{web3State.address}</p>
            <p>{smartAccountAddr}</p>
            <div className="flex gap-2">
                <button onClick={debug}>Debug</button>
                <button onClick={test1}>sdk</button>
                <button onClick={test2}>callConnect</button>
                <button onClick={sendTx}>Send tx</button>
            </div>
        </div>
    );
}
