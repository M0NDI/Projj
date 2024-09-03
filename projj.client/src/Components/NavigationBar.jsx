import React, { useEffect, useState } from "react";
import { isLoggedIn } from "../API/UserApi.js";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import ProfileDropdown from "./ProfileDropdown.jsx";
import Logo from "./Logo.jsx";
import ProjjLogo from "../assets/ProjjLogo.png";
import { useSelector, useDispatch } from "react-redux";
import { setLoginStatus } from "../ReduxState/loginStatusSlice.js";

export default function NavigationBar() {
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loginStatus = useSelector((state) => state.loginStatus.value);

  const checkLoggedInStatus = async () => {
    const result = await isLoggedIn();
    // Only dispatch if the login status has changed
    if (result !== loginStatus) {
      dispatch(setLoginStatus(result));
    }
  };

  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  const loggedInMobileMenuItems = [
    { title: "Features", link: "/features" },
    { title: "Projects", link: "/projects" },
    { title: "Tasks", link: "/tasks" },
    { title: "Help", link: "/help" },
  ];

  const loggedOutMobileMenuItems = [
    { title: "Features", link: "/features" },
    { title: "Help", link: "/help" },
  ];

  const menuItemsToDisplay = loginStatus ? loggedInMobileMenuItems : loggedOutMobileMenuItems;

  return (
    <div className="w-screen">
      <Navbar isMenuOpen={isMenuOpen} isBordered className="flex fixed flex-wrap bg-secondary inter-font">
        <NavbarContent className="xl:hidden">
          <NavbarMenuToggle
            className="text-primary"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          />
        </NavbarContent>

        <NavbarContent className="xl:hidden" justify="center">
          <NavbarBrand>
            <Logo />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden xl:flex gap-4" justify="between">
          <NavbarBrand>
            <Logo />
          </NavbarBrand>

          {menuItemsToDisplay.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link className="text-primary" href={item.link} size="xl">
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarContent>

        {loginStatus ? (
          <NavbarContent justify="end">{loginStatus ? <ProfileDropdown /> : null}</NavbarContent>
        ) : (
          <NavbarContent justify="end">
            <NavbarItem className="xl:flex">
              <Link
                href="/login"
                className="h-8 w-16 flex justify-center items-center hover:bg-primary rounded hover:text-secondary hover:transition hover:duration-300"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                href="/signup"
                className="outline-1 h-8 w-20 flex justify-center items-center rounded bg-red-400 hover:bg-yellow-300 hover:text-secondary hover:transition hover:duration-300"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Sign Up
              </Link>
            </NavbarItem>
          </NavbarContent>
        )}

        {/* Mobile menu */}
        <NavbarMenu className="bg-secondary overflow-x-hidden">
          {menuItemsToDisplay.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className={
                  "text-primary text-4xl mb-2 mt-2 outline p-8 hover:opacity-75 hover:scale-y-95 hover:scale-x-95 hover:duration-150 transition-transform ease-in-out duration-150"
                }
                href={item.link}
                size="lg"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}
          <div className="w-full mb-12">
            <Link
              href="/"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              className="flex flex-col text-secondary text-black text-4xl"
            >
              <img src={ProjjLogo} className="w-24 m-auto rounded-full" />
            </Link>
          </div>
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
