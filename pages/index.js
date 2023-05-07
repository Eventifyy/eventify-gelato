import Footer from "@/components/Footer";
import Lottie from "react-lottie";
import animationData from "../assets/lottie/animation-1.json";
import { useRouter } from "next/router";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Home() {
  const router = useRouter()
  return (
    <div>
        <div className="hero-wrapper mx-auto rounded-3xl !h-auto pb-0 relative container">
          <div className="relative mt-4 flex flex-1 flex-col justify-end overflow-hidden rounded-[36px] p-8 px-12">
            <div className="hero-bg absolute inset-0 -z-10 rounded-[36px] bg-[#191919] md:block [&>div]:absolute [&>div]:inset-0 [&>div]:rounded-[36px]"></div>
            {/**/}
            <h1 className="hero-title lg:leading[72px] leading-[52px] tracking-[-1.5px] md:leading-[60px] lg:tracking-[-0.5px] pt-4">
              <span className="gel-gradient-text-peach inline-block pr-[4px] pb-1">
                Web3’s
                <br />
                Event{" "}
                <br className="xs:hidden sm:hidden md:inline-block lg:inline-block" />{" "}
                Hosting Dapp
              </span>
            </h1>
            <p className="hero-text mb-4">
              <span>
                
  The Ultimate NFT Ticketing Platform with a User-First Approach! <br /> Purchase Tickets with Ease Using Web2 Login.
              </span>
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 md:flex-row mb-4">
              <button
                onClick={() => router.push("/host")}
                id="mainpage-cover-cta-1"
                className="hero-button px-8 solid-gradient gradient-peach w-full md:w-auto text-black"
              >
                <span className="relative z-10 text-gray-200">
                  Start Hosting
                </span>
              </button>
            </div>
          </div>
          <div className="absolute right-20 top-14">
            <Lottie options={defaultOptions} height={350} width={500} />
          </div>
        </div>
        <div className="py-4">
          <i className="m-auto block w-4">
            <svg
              width={16}
              height={16}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m2 5 6 6 6-6"
                stroke="#EFE0E0"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </i>
        </div>

        <div className="mt-8 pb-10">
          <h2 className="text-5xl text-center leading-[60px]  mb-8 font-bold">Enjot NFT Tickets <br /> without any web3 wallets.</h2>
          <div className="container mx-auto">
            <section
              id="signup"
              className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-12"
            >
              <div className="rounded-3xl bg-gel-black p-8 !bg-[#191919]">
                <div className="text-lg font-bold text-gel-gray-2 hero-text">Secure NFT based authorization</div>
                <div className="mt-2 mb-8 text-3xl font-bold md:text-2xl lg:text-3xl gel-gradient-text-peach">
                  {" "}
                  Tickets are authorized with the help of NFT which can not be forged like traditional system.
                </div>
                {/* <a
                  href="https://discord.gg/ApbA39BKyJ"
                  className="group flex items-center hover:text-white"
                  target="_blank"
                >
                  <span className="font-medium transition-colors duration-500">
                    Host your First Event
                  </span>
                  <i className="relative top-[-4px] ml-1 inline-block align-text-top transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:duration-500 group-active:translate-x-10 group-active:-translate-y-10 group-active:opacity-0">
                    <svg
                      width={9}
                      height={9}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.784 1.333H2.31V.04h6.68v6.68H7.7V2.248L1.906 8.04.99 7.126l5.793-5.793Z"
                      />
                    </svg>
                  </i>
                </a> */}
              </div>
              <div className="rounded-3xl bg-gel-black p-8 !bg-[#191919]">
                <div className="text-lg font-bold text-gel-gray-2 hero-text">Login With web2 accounts.</div>
                <div className="mt-2 mb-8 text-3xl font-bold md:text-2xl lg:text-3xl gel-gradient-text-peach">
                  {" "}
                  No need of a web3 wallet to participate. Eliminates all the hurdle by logging in directly using your Google credentials.
                </div>
                {/* <a
                  href="https://discord.gg/ApbA39BKyJ"
                  className="group flex items-center hover:text-white"
                  target="_blank"
                >
                  <i className="mr-2 inline-block align-text-top transition-colors duration-500">
                    <svg
                      width={17}
                      height={14}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M13.745 1.952a13.194 13.194 0 0 0-3.257-1.01.05.05 0 0 0-.053.025c-.14.25-.296.576-.405.833a12.18 12.18 0 0 0-3.658 0A8.43 8.43 0 0 0 5.96.967a.051.051 0 0 0-.052-.025 13.157 13.157 0 0 0-3.257 1.01.047.047 0 0 0-.021.019C.556 5.07-.013 8.092.266 11.078c.001.014.01.028.02.037a13.268 13.268 0 0 0 3.996 2.02.052.052 0 0 0 .056-.019 9.48 9.48 0 0 0 .818-1.33.05.05 0 0 0-.028-.07 8.747 8.747 0 0 1-1.248-.595.051.051 0 0 1-.005-.085c.084-.063.168-.128.248-.194a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.006c.08.067.164.133.248.195a.051.051 0 0 1-.004.085c-.399.233-.813.43-1.249.595a.051.051 0 0 0-.027.07c.24.466.514.91.816 1.33a.05.05 0 0 0 .057.019 13.224 13.224 0 0 0 4.001-2.02.052.052 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.107a.04.04 0 0 0-.02-.019ZM5.547 9.26c-.789 0-1.438-.724-1.438-1.613s.637-1.612 1.438-1.612c.807 0 1.45.73 1.438 1.612 0 .89-.637 1.613-1.438 1.613Zm5.316 0c-.788 0-1.438-.724-1.438-1.613s.637-1.612 1.438-1.612c.807 0 1.45.73 1.438 1.612 0 .89-.63 1.613-1.438 1.613Z"
                      />
                    </svg>
                  </i>
                  <span className="font-medium transition-colors duration-500">
                    Join the community
                  </span>
                  <i className="relative top-[-4px] ml-1 inline-block align-text-top transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:duration-500 group-active:translate-x-10 group-active:-translate-y-10 group-active:opacity-0">
                    <svg
                      width={9}
                      height={9}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.784 1.333H2.31V.04h6.68v6.68H7.7V2.248L1.906 8.04.99 7.126l5.793-5.793Z"
                      />
                    </svg>
                  </i>
                </a> */}
              </div>
        
            </section>

          </div>
        </div>
        <Footer />
      </div>
  );
}
