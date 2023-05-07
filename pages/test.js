import { useState } from "react";
import { Web3Storage } from "web3.storage";
import { address } from "../config";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

export default function Test() {
    const [formInput, setFormInput] = useState({
        ticketId: null,
        shortlistArray: [],
    });
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

    const metadata = async () => {
        const { ticketId, shortlistArray } = formInput;
        if (!ticketId || !shortlistArray) return;
        const data = JSON.stringify({ ticketId, shortlistArray });
        const files = [new File([data], "shortlist.json")];
        try {
            const metaCID = await uploadToIPFS(files);
            const metaUrl = `https://ipfs.io/ipfs/${metaCID}/shortlist.json`;
            console.log(metaUrl);
            return metaUrl;
        } catch (error) {
            console.log("Error uploading:", error);
        }
    };
    //

    async function updateShortlist() {
        console.log("started");

        const _ticketId = parseInt(formInput.ticketId);
        const _shortlistArray = JSON.parse(JSON.stringify(formInput.shortlistArray));
        console.log(formInput)
        console.log(_ticketId, _shortlistArray)

        const erc20Interface = new ethers.utils.Interface([
            "function claimTicket(uint256 _ticketId, string memory _email)",
        ]);

        const data = erc20Interface.encodeFunctionData("claimTicket", [
            _ticketId,
            _shortlistArray,
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

    function debug() {
        const _shortlistArray = JSON.parse(JSON.stringify(formInput.shortlistArray));
        console.log(_shortlistArray)
    }

    return (
        <div>
            <p>upload page</p>
            <button onClick={debug}>debug</button>
            <input
                className="text-black"
                type="number"
                name="ticketId"
                placeholder="Ticket Id"
                onChange={(e) =>
                    setFormInput({ ...formInput, ticketId: e.target.value })
                }
                required
            />
            <input
                className="text-black"
                type="text"
                name="shortlistArray"
                placeholder="Shortlist"
                onChange={(e) =>{
                    console.log("event is", e.target.value)
                    let ar = []
                    
                    setFormInput({
                        ...formInput,
                        shortlistArray: e.target.value?.split(","),
                    })
                }
                }
                required
            />
            <button onClick={updateShortlist}>Upload</button>
        </div>
    );
}
