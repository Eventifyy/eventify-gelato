import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import "@biconomy/web3-auth/dist/src/style.css";
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { address, abi } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { setSmartAcc, setUserInfo, setSAddress } from "../store/index.js"

export default function Login() {
    const dispatch = useDispatch()
    const [sdk, setSdk] = useState();
    const [wProvider, setWProvider] = useState();
    const smartAcc = useSelector(state => state.login.smartAcc);
    const sAddress = useSelector(state => state.login.sAddress);
    const userInfo = useSelector(state => state.login.userInfo);
    // const [smartAcc, setSmartAcc] = useState(); //this to host, events
    const [eAddress, setEAddress] = useState();

    // const [sAddress, setSAddress] = useState(); //this to dashboard
    // const [userInfo, setUserInfo] = useState(null); //this to dashboard

    useEffect(() => {
        initiate();
    }, []);

    useEffect(() => {
        if(sdk?.provider) {

        }
    }, [])


    async function initiate() {
        const socialLoginSDK = new SocialLogin();
        const signature = await socialLoginSDK.whitelistUrl(
            "http://localhost:3000/"
        );
        await socialLoginSDK.init({
            whitelistUrls: {
                "http://localhost:3000/": signature,
            },
        });
        setSdk(socialLoginSDK);
    }

    async function connect() {
        sdk.showWallet();

        if (!sdk?.provider) return;
        const provider = new ethers.providers.Web3Provider(sdk.provider);
        // const walletProvider = new ethers.providers.Web3Provider(provider);
        const accounts = await provider.listAccounts();
        setWProvider(provider);
        setEAddress(accounts);
        sdk.hideWallet();
        getUserInfo()
        getSmartAccount(provider, accounts)
        console.log("done");
    }

    async function disconnect() {
        if (!sdk || !sdk.web3auth) {
            console.error("Web3Modal not initialized.");
            return;
        }
        await sdk.logout();
        setWProvider(null);
        dispatch(setSmartAcc(null));
        setEAddress(null);
        dispatch(setSAddress(null))
        dispatch(setUserInfo(null))
        window.getSocialLoginSDK = null;
        sdk.hideWallet();
        sdk(null);
    }

    const getUserInfo = useCallback(async () => {
        if (sdk) {
            const userInfo = await sdk.getUserInfo();
            console.log("userInfo", userInfo);
            dispatch(setUserInfo(userInfo))
        }
    }, [sdk]);

    async function getSmartAccount(xProvider, xAddress) {
        console.log("started");

        const INFURA_ID = process.env.NEXT_PUBLIC_INFURA
        const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;
        const biconomyAPI= process.env.NEXT_PUBLIC_BiconomyAPI

        let options = {
            activeNetworkId: ChainId.POLYGON_MUMBAI,
            supportedNetworksIds: [
                // ChainId.GOERLI,
                // ChainId.POLYGON_MAINNET,
                ChainId.POLYGON_MUMBAI,
            ],
            networkConfig: [
                {
                    chainId: ChainId.POLYGON_MUMBAI,
                    // Dapp API Key you will get from new Biconomy dashboard that will be live soon
                    // Meanwhile you can use the test dapp api key mentioned above
                    dappAPIKey: biconomyAPI,
                    providerUrl: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`,
                },
                // {
                //     chainId: ChainId.POLYGON_MAINNET,
                //     // Dapp API Key you will get from new Biconomy dashboard that will be live soon
                //     // Meanwhile you can use the test dapp api key mentioned above
                //     dappAPIKey: `XgEQygbsd.f88d0281-18a8-400a-a2d3-96feee91df8a`,
                //     providerUrl: `https://polygon-mumbai.g.alchemy.com/v2/y-OHK68UTXZAj8NQU8Knz2bTee5IHXqP`,
                // },
            ],
        };

        let smartAccount = new SmartAccount(xProvider, options);
        smartAccount = await smartAccount.init();
        dispatch(setSmartAcc(smartAccount));

        const { data } = await smartAccount.getSmartAccountsByOwner({
            chainId: 80001,
            owner: xAddress,
        });
        dispatch(setSAddress(data[0].smartAccountAddress));

        console.log("done");
    }

    async function initiateTx() {
        console.log("started");

        const recipientAddress = `0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB`;
        const calculatedAmount = 10 * Math.pow(10, 18);
        const amount = `${calculatedAmount}`
        const usdcAddress = `0xE73305E0727b615592f54432873592792ccdBfFa`;

        console.log(amount);

        const erc20Interface = new ethers.utils.Interface([
            "function transfer(address _to, uint256 _value)",
        ]);
        // Encode an ERC-20 token transfer to recipient of the specified amount
        const data = erc20Interface.encodeFunctionData("transfer", [
            recipientAddress,
            amount,
        ]);

        const tx1 = {
            to: usdcAddress,
            data,
        };

        // Transaction subscription. One can subscribe to various transaction states
        // Event listener that gets triggered once a hash is generated
        smartAcc.on("txHashGenerated", (response) => {
            console.log("txHashGenerated event received via emitter", response);
        });
        smartAcc.on("onHashChanged", (response) => {
            console.log("onHashChanged event received via emitter", response);
        });
        // Event listener that gets triggered once a transaction is mined
        smartAcc.on("txMined", (response) => {
            console.log("txMined event received via emitter", response);
        });
        // Event listener that gets triggered on any error
        smartAcc.on("error", (response) => {
            console.log("error event received via emitter", response);
        });

        // Sending gasless transaction
        const txResponse = await smartAcc.sendTransaction({
            transaction: tx1,
        });
        console.log("userOp hash", txResponse.hash);
        // If you do not subscribe to listener, one can also get the receipt like shown below
        const txReceipt = await txResponse.wait();
        console.log("Tx hash", txReceipt.transactionHash);

        // DONE! You just sent a forward transaction
        console.log("done");
    }
    //

    // 
    async function mint() {
        console.log("started");

        const _price = 10;
        const _supply = 40;
        const _tokenURI = `superb!`;

        const erc20Interface = new ethers.utils.Interface([
            "function host(uint _price, uint _supply, string memory _tokenURI)",
        ]);

        const data = erc20Interface.encodeFunctionData("host", [
            _price,
            _supply,
            _tokenURI,
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
    }
    // 

    function debug1() {
        connect();
    }
    function debug2() {
        getSmartAccount();
    }
    function debug3() {
        initiateTx();
    }
    function debug4() {
        mint()
        // getUserInfo();
    }
    //

    return (
        <div>
            {eAddress ? <button onClick={disconnect}>Logout</button> : <button onClick={connect}>Login</button>}
            {/* <div className="flex gap-3">
                <button onClick={debug1}>connect()</button>
                <button onClick={debug2}>getSmartAccount()</button>
                <button onClick={debug3}>transfer()</button>
                <button onClick={debug4}>mint()</button>
            </div>
            <p>e: {eAddress}</p>
            <p>s: {sAddress}</p> */}
        </div>
    );
}
