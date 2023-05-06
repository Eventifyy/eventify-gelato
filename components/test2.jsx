import styles from "@/styles/Home.module.scss";
import { useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import { Web3Storage } from "web3.storage";
import web3modal from "web3modal";
import { ethers } from "ethers";
import Lottie from "react-lottie";
import animationData from "../assets/lottie/animation-1.json";
import { Tab } from "@headlessui/react";

export default function Host() {
  
  const [loading, setLoading] = useState(false);
  const [hostInput, setHostInput] = useState({
    logoLink: null,
    commName: "",
    entryContract: "",
    entryTokenId: "",
    entryTokenId: "",
    discordLink: "",
  });

  const [mintInput, setMintInput] = useState({
    image: null,
    name: "",
    supply: "",
    price: "",
  });

  const [imgBase64, setImgBase64] = useState(null);

  function getAccessToken() {
    // return process.env.NEXT_PUBLIC_IpfsToken
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyMjkyQjQ5YzFjN2ExMzhERWQxQzQ3NGNlNmEyNmM1NURFNWQ0REQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzg2MDc1NDEsIm5hbWUiOiJNZXRhRmkifQ.cwyjEIx8vXtTnn8Y3vctroo_rooHV4ww_2xKY-MT0rs";
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  const uploadToIPFS = async (files) => {
    const client = makeStorageClient();
    const cid = await client.put(files);
    return cid;
  };

  async function changeImage(prop) {
    const reader = new FileReader();
    if (prop) reader.readAsDataURL(prop);

    reader.onload = (readerEvent) => {
      const file = readerEvent.target.result;
      setImgBase64(file);
    };
    const inputFile = prop;
    const inputFileName = prop.name;
    const files = [new File([inputFile], inputFileName)];
    setLoading(true);
    // Start loader
    const metaCID = await uploadToIPFS(files);
    const url = `https://ipfs.io/ipfs/${metaCID}/${inputFileName}`;
    setLoading(false);
    // End loader
    console.log(url);
    return url;
  }

  async function hostImage(e) {
    const file = e.target.files[0];
    setLoading(true)
    const url = await changeImage(file);
    setLoading(false)
    setHostInput({ ...hostInput, logoLink: url });
  }

  async function mintImage(e) {
    const file = e.target.files[0];
    const url = await changeImage(file);
    setMintInput({ ...mintInput, image: url });
  }

  const nftMetadata = async () => {
    const { image, name, supply, price } = mintInput;
    if (!image || !name || !supply || !price) return;
    const data = JSON.stringify({ image, name });
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

  async function getFvmContract() {
    const modal = new web3modal({
      // network: "mumbai",
      cacheProvider: true,
    });
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fvmAddress, gatifyAbi, signer);
    return contract;
  }

  async function hostComm() {
    const contract = await getFvmContract();
    const host = await contract.host(
      hostInput.logoLink,
      hostInput.commName,
      hostInput.entryContract,
      hostInput.entryTokenId,
      hostInput.discordLink,
      {
        gasLimit: 1000000,
      }
    );
    await host.wait();
    console.log(host);
  }

  async function mintNft() {
    setLoading(true);
    try {
      const contract = await getFvmContract();
      const url = await nftMetadata();
      const price = ethers.utils.parseEther(mintInput.price);
      const supply = mintInput.supply;
      const mint = await contract.mintNft(url, supply, price, {
        gasLimit: 10000000,
      });
      await mint.wait();
      setLoading(false);
      setMintInput({
        image: null,
        name: "",
        supply: "",
        price: "",
      });

      console.log(mint);
    } catch (e) {
      setLoading(false);

      alert(e);
    }
  }

  function debugMint() {
    console.log("debug", mintInput);
  }

  function debugHost() {
    console.log("debug", hostInput);
  }

  // function RenderHost() {
  //   return (
  //     <div className="">
  //       <button onClick={debugHost}>click</button>
  //       <img src={imgBase64 || "./download.gif"} alt="" width="100px" />
  //       <input name="logo" type="file" required onChange={hostImage} />
  //       <input
  //         name="commName"
  //         type="text"
  //         placeholder="Event Name"
  //         required
  //         onChange={(e) =>
  //           setHostInput({
  //             ...hostInput,
  //             commName: e.target.value,
  //           })
  //         }
  //       />
  //       <input
  //         name="entryContract"
  //         type="text"
  //         placeholder="Contract Address"
  //         required
  //         onChange={(e) =>
  //           setHostInput({
  //             ...hostInput,
  //             entryContract: e.target.value,
  //           })
  //         }
  //       />
  //       <input
  //         name="entryTokenId"
  //         type="number"
  //         placeholder="Token Id"
  //         required
  //         onChange={(e) =>
  //           setHostInput({
  //             ...hostInput,
  //             entryTokenId: e.target.value,
  //           })
  //         }
  //       />
  //       <input
  //         name="discordLink"
  //         type="text"
  //         placeholder="Discord Server Link"
  //         required
  //         onChange={(e) =>
  //           setHostInput({
  //             ...hostInput,
  //             discordLink: e.target.value,
  //           })
  //         }
  //       />
  //       <button onClick={hostComm}>Host</button>
  //     </div>
  //   );
  // }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={styles.host}>
      <div className="hero-wrapper pb-10 relative">
        <div className="relative mt-8 flex flex-1 flex-col justify-end overflow-hidden rounded-[36px] p-8 px-12">
          <div className="hero-bg absolute inset-0 -z-10 rounded-[36px] bg-gel-black md:block [&>div]:absolute [&>div]:inset-0 [&>div]:rounded-[36px]"></div>
          {/**/}
          <h1 className="hero-title lg:leading[72px] leading-[52px] tracking-[-1.5px] md:leading-[60px] lg:tracking-[-4.5px] pt-40">
            <span className="gel-gradient-text-blue inline-block pr-[4px] pb-1">
              Host
              <br />
              your{" "}
              <br className="xs:hidden sm:hidden md:inline-block lg:inline-block" />{" "}
              community
            </span>
          </h1>
          <p className="hero-text mb-8">
            <span>
              Reliable, secure &amp; easy <br /> way to host gated community
            </span>
          </p>
        </div>
        <div className="absolute right-20 top-14">
          <Lottie options={defaultOptions} height={500} width={550} />
        </div>
      </div>
      <OurTabs
        imgBase64={imgBase64}
        mintImage={mintImage}
        mintInput={mintInput}
        setMintInput={setMintInput}
        RenderHost={RenderHost}
        RenderMint={RenderMint}
        loading={loading}
        mintNft={mintNft}
        setHostInput={setHostInput}
        hostInput={hostInput}
        hostImage={hostImage}
        hostComm={hostComm}
      />
    </div>
  );
}

function RenderHost({
  setHostInput,
  hostInput,
  hostImage,
  loading,
  imgBase64,
  hostComm,
}) {
  console.log(hostInput);
  console.log("Loading is", loading)


  function onSubmit(e) {
    e.preventDefault();
    hostComm();
  }
  return (
    <div className="relative px-10 py-10">
      <div>
        <form onSubmit={onSubmit} noValidate="" className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="ml-2 mb-2 block text-sm font-semibold"
            >
              Community Name
            </label>
            <div className="relative">
              <input
                id="commName"
                onChange={(e) =>
                  setHostInput({
                    ...hostInput,
                    commName: e.target.value,
                  })
                }
                value={hostInput.commName}
                className="border-gel-background border px-6 py-3 form-input"
                name="commName"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="ml-2 mb-2 block text-sm font-semibold"
            >
              Discord Server Link
            </label>
            <div className="relative">
              <input
                id="discordLink"
                className="input-error border-gel-accent border px-6 py-3 form-input"
                name="discordLink"
                onChange={(e) =>
                  setHostInput({
                    ...hostInput,
                    discordLink: e.target.value,
                  })
                }
                value={hostInput.discordLink}
              />
            </div>
            {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                  This field is required
                </div> */}
          </div>
          <div className="flex w-full gap-6">
            <div className="flex-1">
              <label
                htmlFor="email"
                className="ml-2 mb-2 block text-sm font-semibold"
              >
                Contract Address
              </label>
              <div className="relative">
                <input
                  id="entryContract"
                  className="input-error border-gel-accent border px-6 py-3 form-input"
                  name="entryContract"
                  onChange={(e) =>
                    setHostInput({
                      ...hostInput,
                      entryContract: e.target.value,
                    })
                  }
                  value={hostInput.entryContract}
                />
              </div>
              {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                  This field is required
                </div> */}
            </div>
            <div className="flex-1">
              <label
                htmlFor="email"
                className="ml-2 mb-2 block text-sm font-semibold"
              >
                Token Id
              </label>
              <div className="relative">
                <input
                  id="entryTokenId"
                  type="number"
                  className="input-error border-gel-accent border px-6 py-3 form-input"
                  name="entryTokenId"
                  value={hostInput.entryTokenId}
                  onChange={(e) =>
                    setHostInput({
                      ...hostInput,
                      entryTokenId: e.target.value,
                    })
                  }
                />
              </div>
              {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                  This field is required
                </div> */}
            </div>
          </div>

          <div>
            <p className="ml-2 mb-2 block text-sm font-semibold">Choose File</p>
            <div className="flex ">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full capa h-64 border-2 border-dashed rounded-lg cursor-pointer bg-[#191919] hover:bg-gray-800"
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    onChange={hostImage}
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                  />
                </label>
              </div>
              <div className="ml-6 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  className="h-64 w-auto"
                  src={imgBase64 || "./download.gif"}
                  alt=""
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="text-white mt-5 gradient-blue w-40 bg-[#4b507a] hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-3 mr-2 mb-2 dark:bg-[#4b507a] dark:hover:bg-slate-800 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Host
          </button>
        </form>
      </div>
      {loading ? <Loader /> : null}
    </div>
  );
}

function RenderMint({
  loading,
  mintImage,
  mintInput,
  setMintInput,
  imgBase64,
  mintNft,
}) {
  function onSubmit(e) {
    e.preventDefault();
    mintNft();
  }

  return (
    <div className="relative px-10 py-10">
      <div>
        <div>
          <h1 className="mb-6 block text-md font-semibold">
            Deployer Contract Address: {fvmAddress}
          </h1>
          <form
            onSubmit={onSubmit}
            noValidate=""
            className="flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="name"
                className="ml-2 mb-2 block text-sm font-semibold"
              >
                Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  onChange={(e) =>
                    setMintInput({
                      ...mintInput,
                      name: e.target.value,
                    })
                  }
                  value={mintInput.name}
                  className="border-gel-background border px-6 py-3 form-input"
                  name="name"
                />
              </div>
            </div>
            <div className="flex w-full gap-6">
              <div className="flex-1">
                <label
                  htmlFor="email"
                  className="ml-2 mb-2 block text-sm font-semibold"
                >
                  Price
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    className="input-error border-gel-accent border px-6 py-3 form-input"
                    name="price"
                    onChange={(e) =>
                      setMintInput({
                        ...mintInput,
                        price: e.target.value,
                      })
                    }
                    value={mintInput.price}
                  />
                </div>
                {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                  This field is required
                </div> */}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="email"
                  className="ml-2 mb-2 block text-sm font-semibold"
                >
                  Supply
                </label>
                <div className="relative">
                  <input
                    id="supply"
                    type="number"
                    className="input-error border-gel-accent border px-6 py-3 form-input"
                    name="supply"
                    value={mintInput.supply}
                    onChange={(e) =>
                      setMintInput({
                        ...mintInput,
                        supply: e.target.value,
                      })
                    }
                  />
                </div>
                {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                  This field is required
                </div> */}
              </div>
            </div>

            <div>
              <p className="ml-2 mb-2 block text-sm font-semibold">
                Choose File
              </p>
              <div className="flex ">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full capa h-64 border-2 border-dashed rounded-lg cursor-pointer bg-[#191919] hover:bg-gray-800"
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
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      onChange={mintImage}
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="ml-6 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    className="h-64 w-auto"
                    src={imgBase64 || "./download.gif"}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="text-white mt-5 gradient-blue w-40 bg-[#4b507a] hover:bg-slate-400 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-3 mr-2 mb-2 dark:bg-[#4b507a] dark:hover:bg-slate-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Mint
            </button>
          </form>
        </div>
      </div>
      {loading ? <Loader /> : null}
    </div>
  );
}

function OurTabs({
  imgBase64,
  mintImage,
  RenderMint,
  RenderHost,
  setMintInput,
  mintInput,
  loading,
  mintNft,
  setHostInput,
  hostInput,
  hostImage,
  hostComm,
}) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="w-fullpx-2 py-10 pt-0 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1  max-w-md  rounded-2xl bg-[#202020] p-2">
          <Tab
            key={"Host"}
            className={({ selected }) =>
              classNames(
                "w-full rounded-2xl py-4 px-1 font-bold leading-5 text-[#efe0e0] text-md",
                "focus:outline-none",
                selected ? "bg-[#4b507a] shadow" : "hover:bg-[#2c2f36]"
              )
            }
          >
            {"Host"}
          </Tab>
          <Tab
            key={"Mint NFT"}
            className={({ selected }) =>
              classNames(
                "w-full rounded-2xl py-4 px-1 font-bold leading-5 text-[#efe0e0] text-md",
                "focus:outline-none",
                selected ? "bg-[#4b507a] shadow" : "hover:bg-[#2c2f36]"
              )
            }
          >
            {"Mint NFT"}
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-8">
          <Tab.Panel
            key={0}
            className={classNames("rounded-xl bg-[#202020] p-3")}
          >
            <RenderHost
              setHostInput={setHostInput}
              hostInput={hostInput}
              hostImage={hostImage}
              hostComm={hostComm}
              loading={loading}
              imgBase64={imgBase64}
            />
          </Tab.Panel>
          <Tab.Panel
            key={1}
            className={classNames("rounded-xl bg-[#202020] p-3")}
          >
            <RenderMint
              imgBase64={imgBase64}
              mintImage={mintImage}
              mintInput={mintInput}
              setMintInput={setMintInput}
              loading={loading}
              mintNft={mintNft}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

function Loader() {
  return (
    <div
      role="status"
      className="absolute top-0 right-0 bottom-0 flex items-center justify-center left-0 bg-black bg-opacity-40 rounded-2xl "
    >
      <svg
        aria-hidden="true"
        className="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}