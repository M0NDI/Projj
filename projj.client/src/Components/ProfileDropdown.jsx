import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";

import { getCurrentUser } from "../API/UserApi";
import { logoutUser } from "../API/UserApi";

import { setCurrentUser } from "../ReduxState/currentUserSlice";
import { setLoginFalse } from "../ReduxState/loginStatusSlice";

export default function ProfileDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.currentUser.value);

  const fetchCurrentUser = async () => {
    const user = await getCurrentUser();
    if (user) {
      dispatch(setCurrentUser(user));
    }
  };

  const logout = async () => {
    const result = await logoutUser();

    if (result) {
      navigate("/");
      dispatch(setLoginFalse());
      toast.success("You have been logged out!", {
        position: "top-right",
        transition: Slide,
      });
    }

    return result;
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end" className="bg-secondary text-primary mt-2">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            name={currentUser.userName}
            className="transition-transform bg-primary outline-red-200"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="light" disabledKeys={["profile"]}>
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <div className="font-semibold">{currentUser && <p>{currentUser.userName}</p>}</div>
          </DropdownItem>
          <DropdownItem
            key="settings"
            className="hover:text-zinc-300 ml-2 mb-2 pr-0 pt-0 pb-0 pl-0"
          >
            <div className="hover:text-zinc-300">My Account</div>
          </DropdownItem>
          <DropdownItem
            key="help_and_feedback"
            className="hover:text-zinc-300 ml-2 pr-0 pt-0 pb-0 pl-0"
          >
            <div className="hover:text-zinc-300">Help & Feedback</div>
          </DropdownItem>
          <DropdownItem key="logout" color="warning" onClick={logout}>
            <div className="hover:text-orange-300">Log Out</div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
