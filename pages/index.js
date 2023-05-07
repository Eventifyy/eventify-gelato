import Footer from "@/components/Footer";
import Lottie from "react-lottie";
import animationData from "../assets/lottie/animation-1.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Home() {
  return (
    <div>
        <div className="hero-wrapper mx-auto rounded-3xl !h-auto pb-0 relative container">
          <div className="relative mt-4 flex flex-1 flex-col justify-end overflow-hidden rounded-[36px] p-8 px-12">
            <div className="hero-bg absolute inset-0 -z-10 rounded-[36px] bg-[#191919] md:block [&>div]:absolute [&>div]:inset-0 [&>div]:rounded-[36px]"></div>
            {/**/}
            <h1 className="hero-title lg:leading[72px] leading-[52px] tracking-[-1.5px] md:leading-[60px] lg:tracking-[-4.5px] pt-4">
              <span className="gel-gradient-text-peach inline-block pr-[4px] pb-1">
                Web3’s
                <br />
                Event{" "}
                <br className="xs:hidden sm:hidden md:inline-block lg:inline-block" />{" "}
                Hosting
              </span>
            </h1>
            <p className="hero-text mb-4">
              <span>
                Eventify is a plateform for Hosting Events <br /> that are
                only accessible by those you authorize.
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
            <Lottie options={defaultOptions} height={320} width={500} />
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
        <Footer />
      </div>
  );
}
