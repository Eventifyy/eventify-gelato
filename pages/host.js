/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Web3Storage } from "web3.storage";
import { address, pn } from "../config";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    GelatoRelay,
    SponsoredCallERC2771Request,
} from "@gelatonetwork/relay-sdk";
import { ParticleProvider } from "@particle-network/provider";
import { fetchEvents } from "@/functions";

import { setEventItems } from "../store/index.js";
import { useDispatch } from "react-redux";

export default function Host() {
    
    const dispatch = useDispatch();

    const { wAddress } = useSelector((state) => state.login);

    const [formInput, setFormInput] = useState({
        // price: "",
        name: "",
        cover: "",
        description: "",
        date: "",
        venue: "",
        supply: "",
    });
    const [imgBase64, setImgBase64] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [tabValue, setTabValue] = useState("upload");

    // const [smartAcc, setSmartAcc] = useState();
    // const smartAcc = useSelector((state) => state.login.smartAcc);
    const relay = new GelatoRelay();
    const GELATO_API = process.env.NEXT_PUBLIC_GELATO_API;

    // const pn = new ParticleNetwork({
    //     projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    //     clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
    //     appId: process.env.NEXT_PUBLIC_APP_ID,
    //     chainName: "polygon", //optional: current chain name, default Ethereum.
    //     chainId: 80001, //optional: current chain id, default 1.
    //     wallet: {
    //         //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
    //         displayWalletEntry: true, //show wallet entry when connect particle.
    //         defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
    //         uiMode: "dark", //optional: light or dark, if not set, the default is the same as web auth.
    //         supportChains: [{ id: 1, name: "Ethereum" }, {id: 80001, name: "Mumbai"}], // optional: web wallet support chains.
    //         customStyle: {}, //optional: custom wallet style
    //     },
    // });

    //
    const web3StorageKey = process.env.NEXT_PUBLIC_WEB3STORAGE;

    function getAccessToken() {
        return web3StorageKey;
    }

    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() });
    }

    const uploadToIPFS = async (files) => {
        const client = makeStorageClient();
        const cid = await client.put(files);
        return cid;
    };

    const changeImage = async (e) => {
        setImageLoading(true);
        try {
            const reader = new FileReader();
            if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

            reader.onload = (readerEvent) => {
                const file = readerEvent.target.result;
                setImgBase64(file);
            };
            //
            const inputFile = e.target.files[0];
            const inputFileName = e.target.files[0].name;
            const files = [new File([inputFile], inputFileName)];
            const metaCID = await uploadToIPFS(files);
            const url = `https://ipfs.io/ipfs/${metaCID}/${inputFileName}`;
            //
            console.log(url);
            setFormInput({ ...formInput, cover: url });
            setImageLoading(false);
        } catch (e) {
            setImageLoading(false);
            toast.error(e, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    const metadata = async () => {
        const { name, cover, description, date, venue, supply } = formInput;
        if (
            !name ||
            !cover ||
            // !price ||
            !description ||
            !date ||
            !venue ||
            !supply
        )
            return;
        const data = JSON.stringify({ name, cover, description, date, venue });
        const files = [new File([data], "data.json")];
        try {
            const metaCID = await uploadToIPFS(files);
            const metaUrl = `https://ipfs.io/ipfs/${metaCID}/data.json`;
            console.log(metaUrl);
            return metaUrl;
        } catch (error) {
            console.log("Error uploading:", error);
        }
    };

    //

    async function mint() {
        console.log("started");
        try {
            setButtonLoading(true);

            const _tokenURI = await metadata();
            const _supply = formInput.supply;

            const abi = [
                "function host(uint _supply, string memory _tokenURI)",
            ];

            const particleProvider = new ParticleProvider(pn.auth);
            const ethersProvider = new ethers.providers.Web3Provider(
                particleProvider,
                "any"
            );
            const signer = ethersProvider.getSigner();

            const contract = new ethers.Contract(address, abi, signer);
            const { data } = await contract.host(_supply, _tokenURI);

            const request = {
                chainId: "80001",
                target: address,
                data: data,
                user: wAddress,
            };

            const relayResponse = await relay.sponsoredCallERC2771(
                request,
                ethersProvider,
                GELATO_API
            );

            relayResponse.wait();
            console.log(relayResponse);

            fetchEvents().then((resp) => {
                dispatch(setEventItems(resp));
            });

            toast.success("Event hosted successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setButtonLoading(false);
        } catch (e) {
            setButtonLoading(false);
            toast.error(e, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

        console.log("done");
    }
    //

    //
    async function updateShortlist() {
        console.log("started");
        setButtonLoading(true);

        // const contractAddress = "0xAE7e2aD4aAAc74810da24A0E87557304Fe689867";
        const abi = [
            "function updatShortlist(uint256 _ticketId, string[] memory _shortlist)",
        ];

        const particleProvider = new ParticleProvider(pn.auth);
        const ethersProvider = new ethers.providers.Web3Provider(
            particleProvider,
            "any"
        );
        const signer = ethersProvider.getSigner();

        const contract = new ethers.Contract(address, abi, signer);
        const { data } = await contract.updatShortlist(
            formInput.ticketId,
            formInput.shortlistArray
        );

        const request = {
            chainId: "80001",
            target: address,
            data: data,
            user: wAddress,
        };

        const relayResponse = await relay.sponsoredCallERC2771(
            request,
            ethersProvider,
            GELATO_API
        );

        relayResponse.wait();
        console.log(relayResponse);

        setButtonLoading(false);
        toast.success("Participants shortlisted successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

        console.log("done");
    }
    //

    function renderHost() {
        return (
            <div>
                <div className="flex flex-col w-full mx-auto relative eFTMrM !container rounded-3xl overflow-hidden">
                    <div class="styles__AuthBlurBackground-sc-17gk2ab-12 kaEhpi "></div>
                    <div className="mt-5">
                        <input
                            className="inputs"
                            type="text"
                            name="title"
                            placeholder="Name"
                            onChange={(e) =>
                                setFormInput({
                                    ...formInput,
                                    name: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div className=" mt-5 pt-2">
                        <textarea
                            className="inputs !min-h-[80px] !pt-3"
                            type="text"
                            name="description"
                            placeholder="Description"
                            onChange={(e) =>
                                setFormInput({
                                    ...formInput,
                                    description: e.target.value,
                                })
                            }
                            required
                        ></textarea>
                    </div>

                    <div className="flex gap-5">
                        <div className="rounded-sm mt-5 flex-1">
                            <input
                                className="inputs"
                                type="text"
                                name="venue"
                                placeholder="Venue"
                                onChange={(e) =>
                                    setFormInput({
                                        ...formInput,
                                        venue: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="rounded-xsm mt-5 flex-1">
                            <input
                                className="inputs"
                                type="number"
                                name="host"
                                placeholder="Supply"
                                onChange={(e) =>
                                    setFormInput({
                                        ...formInput,
                                        supply: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="rounded-sm mt-5 flex-1">
                            <input
                                className="inputs"
                                type="date"
                                name="date"
                                placeholder="Date"
                                onChange={(e) =>
                                    setFormInput({
                                        ...formInput,
                                        date: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="flex mt-6">
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full capa h-64 border-2 border-[#fffef11a] border-dashed rounded-lg cursor-pointer bg-[#fffef10d] hover:bg-gray-800"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        aria-hidden="true"
                                        className="w-10 h-10 mb-3 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">
                                            Choose profile picture
                                        </span>
                                    </p>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                                    </p>
                                </div>
                                <input
                                    onChange={changeImage}
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="ml-6 flex-shrink-0 overflow-hidden rounded-md">
                            <div className="shrink-0 rounded-xl overflow-hidden ">
                                <img
                                    alt="NFT"
                                    className="h-64 w-auto  cursor-pointer"
                                    src={imgBase64 || "./download.gif"}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={mint}
                        className="flex flex-row justify-center items-center
                  w-full text-white text-md bg-[#8A42D8]
                  py-2 px-5 rounded-full
                  drop-shadow-xl border border-transparent
                  hover:bg-transparent hover:text-[#8A42D8]
                  hover:border hover:bg-indigo-700
                  focus:outline-none focus:ring mt-5"
                    >
                        {buttonLoading ? (
                            <svg
                                aria-hidden="true"
                                role="status"
                                class="inline w-4 h-4 mr-3 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor"
                                />
                            </svg>
                        ) : null}
                        Host Event
                    </button>
                    {imageLoading ? <Loader /> : null}
                </div>
            </div>
        );
    }
    function renderShortlist() {
        return (
            <div>
                <div className="flex gap-5 flex-col w-full mx-auto relative eFTMrM !container rounded-3xl overflow-hidden">
                    <div class="styles__AuthBlurBackground-sc-17gk2ab-12 kaEhpi "></div>
                    <div>
                        <input
                            className="inputs"
                            type="number"
                            name="ticketId"
                            placeholder="Ticket Id"
                            onChange={(e) =>
                                setFormInput({
                                    ...formInput,
                                    ticketId: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div>
                        <input
                            className="inputs"
                            type="text"
                            name="shortlistArray"
                            placeholder="Shortlist"
                            onChange={(e) => {
                                setFormInput({
                                    ...formInput,
                                    shortlistArray: e.target.value?.split(","),
                                });
                            }}
                            required
                        />
                    </div>

                    <button
                        onClick={updateShortlist}
                        className="flex flex-row justify-center items-center
                  w-full text-white text-md bg-[#8A42D8]
                  py-2 px-5 rounded-full
                  drop-shadow-xl border border-transparent
                  hover:bg-transparent hover:text-[#8A42D8]
                  hover:border hover:bg-indigo-700
                  focus:outline-none focus:ring mt-5"
                    >
                        {buttonLoading ? (
                            <svg
                                aria-hidden="true"
                                role="status"
                                class="inline w-4 h-4 mr-3 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor"
                                />
                            </svg>
                        ) : null}
                        Upload
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {/* <p>test</p>
      <button onClick={initiateTx}>test</button> */}
            {/* <h2 className="text-white text-3xl text-center mb-7 mt-3">
                    User 
                </h2> */}
            <div className="tabs !mx-auto !mb-4 !mt-14">
                <button
                    onClick={() => setTabValue("upload")}
                    className={tabValue === "upload" ? "active" : ""}
                >
                    Host
                </button>
                <button
                    onClick={() => setTabValue("shortlist")}
                    className={tabValue === "shortlist" ? "active" : ""}
                >
                    Shortlist
                </button>
            </div>

            {tabValue === "upload" ? renderHost() : renderShortlist()}
        </div>
    );
}
