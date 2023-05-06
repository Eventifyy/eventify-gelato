import { useEffect } from "react"
import { address, abi } from "../config";
import { ethers } from "ethers";

export default function Events() {

    useEffect(() => {
        fetchEvents
    }, [])

    const INFURA_ID = process.env.NEXT_PUBLIC_INFURA

    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`,
    )

    async function fetchEvents() {
        const contract = new ethers.Contract(address, abi, provider)
        setIsLoading(true)
        const data = await contract.activeEvents()
        const itemsFetched = await Promise.all(
          data.map(async (i) => {
            const tokenUri = await contract.uri(i.tokenId.toString())
            console.log(tokenUri)
            const meta = await axios.get(tokenUri + "/")
            let price = ethers.utils.formatEther(i.price)
            let item = {
              price,
              name: meta.data.name,
              cover: meta.data.cover,
              description: meta.data.description,
              date: meta.data.date,
              venue: meta.data.venue,
              supply: i.supply.toNumber(),
              tokenId: i.tokenId.toNumber(),
              remaining: i.remaining.toNumber(),
              host: i.host,
              buyLink: i.buyLink.toString(),
            }
            return item
          }),
        )
    
        setItems(itemsFetched)
        console.log(itemsFetched)
    }

    return (
        <div>
            <p>test</p>
        </div>
    )
}