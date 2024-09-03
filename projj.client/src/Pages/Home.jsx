import React from "react";
import LaptopStockImage from "../assets/laptop-stock-image1.jpeg";
import ButtonGhostStyle from "../Components/ButtonGhostStyle";
import { Link } from "@nextui-org/react";
import { useSelector } from "react-redux";

const Home = () => {
  const loginStatus = useSelector((state) => state.loginStatus.value);
  return (
    <>
      <div className="bg-white pt-18 text-zinc-100 flex justify-between font-semibold h-full">
        <div className="flex justify-evenly">
          <div className="flex justify-evenly flex-col text-center h-1/2 m-auto">
            <h1 className="flex items-center justify-center text-5xl text-black font-black m-2">
              Turn Ideas Into Action
            </h1>
            <h2 className="text-zinc-500 text-xl m-2">
              Simplify your workflow—create, manage, and complete your projects with seamless task
              management.
            </h2>
            <div className="m-2">
              <Link href={loginStatus ? "/projects" : "/signup"}>
                <ButtonGhostStyle />
              </Link>
            </div>
          </div>
          <img src={LaptopStockImage} className="w-5/12 object-cover" />
        </div>
      </div>
      <div className="bg-white outline-secondary outline outline-dotted text-5xl text-black font-black flex justify-center h-full">
        <div className="mt-8">Features</div>
      </div>
    </>
  );
};

export default Home;
