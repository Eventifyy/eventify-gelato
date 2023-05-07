/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Web3Storage } from "web3.storage";
import { address } from "../config";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

export default function Host() {
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

  // const [smartAcc, setSmartAcc] = useState();
  const smartAcc = useSelector((state) => state.login.smartAcc);

  //

  function getAccessToken() {
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

  const changeImage = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

    reader.onload = (readerEvent) => {
      const file = readerEvent.target.result;
      setImgBase64(file);
    };
    const inputFile = e.target.files[0];
    const inputFileName = e.target.files[0].name;
    const files = [new File([inputFile], inputFileName)];
    const metaCID = await uploadToIPFS(files);
    const url = `https://ipfs.io/ipfs/${metaCID}/${inputFileName}`;
    console.log(url);
    setFormInput({ ...formInput, cover: url });
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

    const _tokenURI = await metadata();

    const _supply = formInput.supply;

    const erc20Interface = new ethers.utils.Interface([
      "function host(uint _supply, string memory _tokenURI)",
    ]);

    const data = erc20Interface.encodeFunctionData("host", [
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

  //
  async function initiateTx() {
    console.log("started");

    const recipientAddress = `0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB`;
    const calculatedAmount = 10 * Math.pow(10, 18);
    const amount = `${calculatedAmount}`;
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

  return (
    <div>
      <p>test</p>
      <button onClick={initiateTx}>test</button>
      <div className="flex flex-col w-full mx-auto relative eFTMrM !container rounded-3xl overflow-hidden">
        <div class="styles__AuthBlurBackground-sc-17gk2ab-12 kaEhpi "></div>
        <div className="mt-5">
          <input
            className="inputs"
            type="text"
            name="title"
            placeholder="Name"
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
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

          <div className="rounded-sm mt-5 flex-1">
            <input
              className="inputs"
              type="date"
              name="date"
              placeholder="Date"
              onChange={(e) =>
                setFormInput({ ...formInput, date: e.target.value })
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

          <div className="rounded-ms mt-5 flex-1">
            <input
              className="inputs"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              placeholder="Price (MATIC)"
              onChange={(e) =>
                setFormInput({
                  ...formInput,
                  price: e.target.value,
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
                  <span className="font-semibold">Choose profile picture</span>
                </p>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
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
          Host Event
        </button>
      </div>
    </div>
  );
}
