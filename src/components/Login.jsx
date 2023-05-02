/* eslint-disable no-unused-vars */
// import SocialLogin from "@biconomy/web3-auth";
// import "@biconomy/web3-auth/dist/src/style.css";
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import { useDispatch } from "react-redux";
import { setUser } from "./UserSlice";

export default function Login() {
  const dispatch=useDispatch();
    const [sdk, setSdk] = useState();
    const [web3State, setWeb3State] = useState({
      provider: null,
      web3Provider: null,
      ethersProvider: null,
      address: "",
      chainId: "80001",
    });
    const [userInfo, setUserInfo] = useState(null);
    const [smartAccountAddr, setSmartAccountAddr] = useState(null)
    
    const [loading, setLoading] = useState(false);

    const { provider, web3Provider, ethersProvider, address, chainId } =
        web3State;


    useEffect(() => {
        initiate();
    }, []);

    useEffect(() => {
        if (sdk && sdk.provider) {
            // console.log("hideWallet");
            connect()
            sdk.hideWallet();
        }
    }, [address, sdk]);


    const initiate = async () => {
        setLoading(true);
        const socialLogin = new SocialLogin();
        await socialLogin.init();
        setSdk(socialLogin);
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

        
        getSmartAccount()
        getUserInfo()
        setLoading(false);
        return;
    };

    const getUserInfo = useCallback(async () => {
        if (sdk) {
            const userInfo = await sdk.getUserInfo();
            dispatch(setUser(userInfo));
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
        setSmartAccountAddr(null)
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
            providerUrl: `https://polygon-mumbai.infura.io/v3/eec39d04a1064883bf94ec917264ce9a`
          }
        ],
    };
    let smartAccount = new SmartAccount(web3Provider, options);
    smartAccount = await smartAccount.init();
        // console.log('smartAccount', smartAccount);
        const { data } = await smartAccount.getSmartAccountsByOwner({
          chainId: 80001,
          owner: address,
        });
        // console.log('data', data)
        setSmartAccountAddr(data[0].smartAccountAddress)
    }

    return (
        <div>
          {address ? <button onClick={disconnect}>Logout</button> : <button onClick={connect}>Login</button>}
          <p>shit below</p>
            <p>{web3State.address}</p>
            <p>{smartAccountAddr}</p>
        </div>
    );
}
