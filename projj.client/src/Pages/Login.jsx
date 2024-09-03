import React, { useEffect, useState } from "react";
import InputBox from "../Components/InputBox";
import { getCurrentUser, loginUser } from "../API/UserApi";
import { toast, Flip } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { setLoginTrue } from "../ReduxState/loginStatusSlice";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../ReduxState/currentUserSlice";
import "../styles/Login.css";
import GoogleLoginButton from "../Components/GoogleLoginButton";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginFormData, setLoginFormData] = useState({
    userName: "",
    password: "",
  });

  const handleLoginFormDataChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(loginFormData);
    if (!response.succeeded) {
      toast.error("Invalid login credentials");
      return;
    }
    setTimeout(() => {
      navigate("/projects");
    }, 100);
    dispatch(setLoginTrue());
    const newCurrentUser = await getCurrentUser();
    if (newCurrentUser) {
      dispatch(setCurrentUser(newCurrentUser));
    }
    toast(
      <div>
        Hi, <span className="text-secondary">{newCurrentUser.userName}. </span>
        You are now logged in.
      </div>
    );
    return response;
  };

  return (
    <div className="login-main text-primary h-screen w-screen bg-primary flex justify-between">
      <form className="login-form w-full h-full flex" onSubmit={handleLogin}>
        <div className="login-inner w-full h-96 m-auto text-secondary flex flex-col justify-between">
          <div className="text-7xl w-full h-1/3 text-center flex items-center justify-center text-black font-black">
            Login
          </div>
          <div className="mb-2 w-60 m-auto text-black outline outline-secondary rounded-xl">
            <InputBox
              name="userName"
              inputLabel="Username"
              inputType="text"
              handleChange={handleLoginFormDataChange}
            />
          </div>
          <div className="mb-2 w-60 m-auto text-black outline outline-secondary rounded-xl">
            <InputBox
              name="password"
              inputLabel="Password"
              inputType="password"
              handleChange={handleLoginFormDataChange}
            />
          </div>
          <div className="w-60 m-auto">
            <button
              className="bg-secondary text-primary w-60 mt-2 p-1 rounded hover:opacity-75 hover:bg-yellow-300 hover:text-secondary hover:transition hover:duration-300 hover:shadow-emerald-600 font-semibold active:scale-x-95 active:scale-y-95"
              type="submit"
            >
              LOGIN
            </button>
          </div>
          <div className="m-auto text-secondary text-xs text-center mt-4">
            <div>Or login with Google</div>
            <GoogleLoginButton />
          </div>
          <div className="text-xs w-60 mt-4 flex justify-evenly items-center m-auto">
            Don't have an account?
            <div className="text-yellow-300 flex items-center rounded">
              <Link to={"/signup"}>
                <button
                  className="bg-secondary text-primary w-18 p-1 opacity-50 rounded hover:opacity-75 hover:bg-yellow-300 hover:text-secondary hover:transition hover:duration-300 hover:shadow-emerald-600 font-semibold active:scale-x-95 active:scale-y-95"
                  type="submit"
                >
                  SIGN UP
                </button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
