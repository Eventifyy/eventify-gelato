import { ParticleProvider } from "@particle-network/provider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { address, abi, pn } from "../config";
import {
    setAccount,
    setUser,
    setEventItems,
    setDashboardItems,
} from "../store/index.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchEvents } from "@/functions";

export default function Login() {
    const dispatch = useDispatch();

    const [logged, setLogged] = useState(null);
    const { wAddress, userInfo, eventItems, dashboardItems } = useSelector(
        (state) => state.login
    );

    const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;
    // const provider = new ethers.providers.JsonRpcProvider(
    //     `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`
    // );

    pn.setAuthTheme({
        uiMode: "light",
        displayCloseButton: true,
        displayWallet: true, // display wallet entrance when send transaction.
        modalBorderRadius: 10, // auth & wallet modal border radius. default 10.
    });

    const particleProvider = new ParticleProvider(pn.auth);
    const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
    );

    useEffect(() => {
        checkLogin();
    }, [wAddress, userInfo]);

    useEffect(() => {
        fetchEvents().then((resp) => {
            dispatch(setEventItems(resp));
        });
        const isLogged = checkLogin();
        if (userInfo == "" && isLogged) {
            getUserInfo();
            if (localStorage.getItem("wAddress")) {
                let wAddressLocal = localStorage.getItem("wAddress");
                dispatch(setAccount(wAddressLocal));
                fetchDashboard(wAddressLocal);
            } else {
                fetchAccount();
            }
        }
    }, []);

    const checkLogin = () => {
        let result = pn.auth.isLogin();
        setLogged(result);
        return result;
    };

    const login = async () => {
        await pn.auth.login({
            preferredAuthType: "google",
        });
        console.log("wAddress", wAddress);
        getUserInfo();
        fetchAccount();
    };

    const fetchAccount = async () => {
        const accounts = await ethersProvider.listAccounts();
        dispatch(setAccount(accounts[0]));
        fetchDashboard(accounts[0]);
        localStorage.setItem("wAddress", accounts[0]);
    };

    const logout = async () => {
        pn.auth.logout().then(() => {
            console.log("logout");
            dispatch(setAccount(null));
            dispatch(setUser(null));
        });
    };

    const getUserInfo = () => {
        const info = pn.auth.userInfo();
        dispatch(setUser(info));
        console.log(info);
    };

    // const fetchEvents = async () => {
    //     const contract = new ethers.Contract(address, abi, ethersProvider);
    //     const data = await contract.activeEvents();
    //     const itemsFetched = await Promise.all(
    //         data.map(async (i) => {
    //             const tokenUri = await contract.uri(i.tokenId.toString());
    //             // console.log(tokenUri);
    //             const meta = await axios.get(tokenUri + "/");
    //             // let price = ethers.utils.formatEther(i.price);
    //             let item = {
    //                 // price,
    //                 name: meta.data.name,
    //                 cover: meta.data.cover,
    //                 description: meta.data.description,
    //                 date: meta.data.date,
    //                 venue: meta.data.venue,
    //                 supply: i.supply.toNumber(),
    //                 tokenId: i.tokenId.toNumber(),
    //                 remaining: i.remaining.toNumber(),
    //                 host: i.host,
    //             };
    //             return item;
    //         })
    //     );

    //     dispatch(setEventItems(itemsFetched));
    //     console.log("events", itemsFetched);
    // };

    const fetchDashboard = async (xAddress) => {
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

        dispatch(setDashboardItems(itemsFetched));
        console.log("dashboard", itemsFetched);
    };

    function debug() {}

    return (
        <div>
            {logged ? (
                <button onClick={logout}>logout</button>
            ) : (
                <button onClick={login}>login</button>
            )}
            {/* <button onClick={debug}>check</button> */}
        </div>
    );
}
