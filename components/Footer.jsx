/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Footer() {
    return (
        <div className="hero-wrapper bg-[#191919] mx-auto container rounded-3xl !h-auto  relative mt-4">
            <div className="relative mt-8 flex justify-between items-center overflow-hidden rounded-[36px] p-8 ">
                <div>
                    <img src="./logo.png" alt="" width="140px" />
                </div>

                <div className=" -ml-8">
                    <p>Next gen Ticketing solution</p>
                </div>
                <Link href="https://github.com/Eventifyy/backend">
                    <div className="flex flex-row gap-2">
                        <img src="./github.svg" alt="" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
