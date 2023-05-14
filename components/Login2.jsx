import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { address, abi } from "../config";
import {
    GelatoRelay,
    SponsoredCallERC2771Request,
} from "@gelatonetwork/relay-sdk";

export default function Login() {
    const [user, setUser] = useState(null);
    const [wAddress, setAccount] = useState(null);
    const [logged, setLogged] = useState(null);
    const [wProvider, setProvider] = useState(null);
    const [eventItems, setEventItems] = useState(null);
    const [dashboardItems, setDashboardItems] = useState(null);

    useEffect(() => {
        checkLogin();
        fetchEvents();
    }, [wAddress, user]);

    

    const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;
    const GELATO_API = process.env.NEXT_PUBLIC_GELATO_API
    const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`
    );

    const pn = new ParticleNetwork({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
        appId: process.env.NEXT_PUBLIC_APP_ID,
        chainName: "polygon", //optional: current chain name, default Ethereum.
        chainId: 80001, //optional: current chain id, default 1.
        wallet: {
            //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
            displayWalletEntry: true, //show wallet entry when connect particle.
            defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
            uiMode: "dark", //optional: light or dark, if not set, the default is the same as web auth.
            supportChains: [{ id: 1, name: "Ethereum" }, {id: 80001, name: "Mumbai"}], // optional: web wallet support chains.
            customStyle: {}, //optional: custom wallet style
        },
    });

    pn.setAuthTheme({
        uiMode: "light",
        displayCloseButton: true,
        displayWallet: true, // display wallet entrance when send transaction.
        modalBorderRadius: 10, // auth & wallet modal border radius. default 10.
    });

    const checkLogin = async () => {
        let result = pn.auth.isLogin();
        if (result) {
            console.log("User info is", pn.auth.userInfo());
        }
        setLogged(result);
    };

    const login = async () => {
        await pn.auth.login({
            preferredAuthType: "google",
        });
        // await pn.auth.login()
        const particleProvider = new ParticleProvider(pn.auth);
        const ethersProvider = new ethers.providers.Web3Provider(
            particleProvider,
            "any"
        );

        setProvider(ethersProvider);

        const accounts = await ethersProvider.listAccounts();

        setAccount(accounts);
        getUserInfo();
        await fetchDashboard(accounts);
    };

    const logout = async () => {
        pn.auth.logout().then(() => {
            console.log("logout");
            setAccount(null);
            setUser(null);
        });
    };

    const getUserInfo = async () => {
        const info = pn.auth.userInfo();
        setUser(info);
        console.log(info);
    };

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

        setEventItems(itemsFetched);
        console.log("events", eventItems);
    };

    const fetchDashboard = async (wAddr) => {
        const contract = new ethers.Contract(address, abi, provider);
        const data = await contract.inventory(wAddr);
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

        setDashboardItems(itemsFetched);
        console.log("dashboard", dashboardItems);
    };


    // 

    const relay = new GelatoRelay();

    async function host() {

        const _tokenURI = await metadata();
        const _supply = formInput.supply;
 
        const contractAddress = "0xAE7e2aD4aAAc74810da24A0E87557304Fe689867";
        const abi = ["function host(uint _supply, string memory _tokenURI)"];

        const particleProvider = new ParticleProvider(pn.auth);
        const ethersProvider = new ethers.providers.Web3Provider(
            particleProvider,
            "any"
        );
        const signer = ethersProvider.getSigner();
        
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const { data } = await contract.host(_supply, _tokenURI);

        const request = {
            chainId: "80001",
            target: contractAddress,
            data: data,
            user: wAddress,
        };

        const relayResponse = await relay.sponsoredCallERC2771(
            request,
            ethersProvider,
            GELATO_API
        );

        relayResponse.wait()
        console.log(relayResponse)
    }

    async function claim() {

        const _ticketId = prop.tokenId;
        const _email = userInfo.email;

        const contractAddress = "0xAE7e2aD4aAAc74810da24A0E87557304Fe689867";
        const abi = ["function claimTicket(uint256 _ticketId, string memory _email)"];

        const particleProvider = new ParticleProvider(pn.auth);
        const ethersProvider = new ethers.providers.Web3Provider(
            particleProvider,
            "any"
        );
        const signer = ethersProvider.getSigner();
        
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const { data } = await contract.claimTicket(_ticketId, _email);

        const request = {
            chainId: "80001",
            target: contractAddress,
            data: data,
            user: wAddress,
        };

        const relayResponse = await relay.sponsoredCallERC2771(
            request,
            ethersProvider,
            GELATO_API
        );

        relayResponse.wait()
        console.log(relayResponse)
    }

    async function shortlist() {

        const _ticketId = prop.tokenId;
        const _email = userInfo.email;

        const contractAddress = "0xAE7e2aD4aAAc74810da24A0E87557304Fe689867";
        const abi = ["function updatShortlist(uint256 _ticketId, string[] memory _shortlist)"];

        const particleProvider = new ParticleProvider(pn.auth);
        const ethersProvider = new ethers.providers.Web3Provider(
            particleProvider,
            "any"
        );
        const signer = ethersProvider.getSigner();
        
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const { data } = await contract.claimTicket(formInput.ticketId, formInput.shortlistArray);

        const request = {
            chainId: "80001",
            target: contractAddress,
            data: data,
            user: wAddress,
        };

        const relayResponse = await relay.sponsoredCallERC2771(
            request,
            ethersProvider,
            GELATO_API
        );

        relayResponse.wait()
        console.log(relayResponse)
    }

    function debug() {
        // console.log(wProvider);
        sendTx();
    }

    function debug1() {
        logout()
    }

    return (
        <div>
            {logged ? (
                <button onClick={logout}>logout</button>
            ) : (
                <button onClick={login}>login</button>
            )}
            <p>{address}</p>
            <button onClick={debug}>check</button>
            <button onClick={debug1}>check</button>
        </div>
    );
}
