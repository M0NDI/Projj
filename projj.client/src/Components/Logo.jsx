import React from "react";
import ProjjLogo from "../assets/ProjjLogo.png";
import { Link } from "@nextui-org/react";

const Logo = () => (
  <>
    <Link href="/">
      <img src={ProjjLogo} className="w-12 rounded-3xl m-2" />
    </Link>
  </>
);

export default Logo;