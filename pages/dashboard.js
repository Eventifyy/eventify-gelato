/* eslint-disable @next/next/no-img-element */
import { useSelector } from "react-redux";
import Image from "next/image";
import LocationSvg from "../assets/images/location.png"

export default function Dashboard() {
  
    const { wAddress, userInfo, dashboardItems } = useSelector(
      (state) => state.login
  );

    function Card(prop) {
        const date = new Date(prop.date);
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = date.toLocaleDateString(undefined, options);
    
        return (
          <div
            style={{ borderTopLeftRadius: 0 }}
            className="mx-auto bg-violet-800 w-3/4 flex py-10 rounded-[32px] relative left-10 mb-20"
          >
            <img
              src={prop.cover}
              alt=""
              style={{ borderBottomRightRadius: 0 }}
              className="md:w-[220px] w-full h-[200px] rounded-[32px] object-cover relative -translate-x-1/3"
            />
            <div className="w-full flex gap-8 items-center px-14 -ml-24">
              <div className="flex-1 flex max-w-[650px] items-center">
                <div className=" ">
                  <h4 className="font-normal lg:text-[42px] text-[26px] text-white capitalize fancy-font">
                    {prop.name}
                  </h4>
    
                  <p className="mt-[10px] font-normal lg:text-[20px] text-[14px] text-[#C6C6C6]">
                    {prop.description}
                  </p>
    
                </div>
    
                <div className="ml-20">
                  <p className="text-sm">Join on-</p>
                  <h2 className="tracking-widest text-indigo-xs title-font font-medium text-6xl uppercase text-white fancy-font">
                    {formattedDate}
                  </h2>
    
                  <div className="flex gap-2 mt-8 ml-2">
                    <div className="rounded-full p-1 border-white border w-8 h-8">
                      <Image src={LocationSvg} alt=""/>
                    </div>
                    <a className="text-white inline-flex items-center md:mb-2 lg:mb-0">
                      {prop.venue}
                    </a>
                  </div>
    
                </div>
              </div>
            </div>
            
          </div>
        );
      }

    function debug1() {
        console.log(userInfo)
    }

    return (
        <div>
           
            <div className="flex border-t border-t-gray-500">
            <div className=" flex-1 py-14 overflow-scroll"> 
                <h2 className="text-white text-3xl text-center mb-7 mt-3">
                            Dashboard
                </h2>
                {dashboardItems.map((item, i) => (
                    <Card
                        key={i}
                        // loading={loading}
                        //   price={item.price}
                        name={item.name}
                        cover={item.cover}
                        description={item.description}
                        date={item.date}
                        venue={item.venue}
                        supply={item.supply}
                        tokenId={item.tokenId}
                        remaining={item.remaining}
                        host={item.host}
                    />
                ))}
            </div>

            <div className="w-[450px] p-8 py-20 ">
                <img className="w-20 h-20 rounded-full" src={userInfo?.avatar} alt="" />
                <p className="mt-3 text-lg capitalize ml-1">{userInfo?.name}</p>
                <p className="mt-1 text-lg ml-1">{userInfo?.google_email}</p>
                <p style={{overflowWrap: "anywhere"}} className="mt-1 text-lg ml-1 whitespace-break-spaces ">{wAddress}</p>
                {/* <button onClick={debug1}>test</button> */}
            </div>
        


            </div>
        </div>
    );
}
