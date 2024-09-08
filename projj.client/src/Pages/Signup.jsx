import React from "react";
import InputBox from "../Components/InputBox";
import { Link } from "@nextui-org/react";
import GoogleLoginButton from "../Components/GoogleLoginButton";
import { useState } from "react";
import { registerUser } from "../API/UserApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import questionMarkIcon from "../assets/question-mark-icon.svg";
import GoogleLoginQuestionMarkHover from "../Components/GoogleLoginQuestionMarkHover";


const Signup = () => {
  const navigate = useNavigate();

  const [isQuestionMarkHovered, setIsQuestionMarkHovered] = useState(false);
  const handleQuestionMarkHover = () => {
    setIsQuestionMarkHovered(!isQuestionMarkHovered);
  };

  const [signupFormData, setSignupFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleSignupFormDataChange = (e) => {
    const { name, value } = e.target;
    setSignupFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(signupFormData);
    const registerData = {
      UserName: signupFormData.username,
      Password: signupFormData.password,
      Email: signupFormData.email,
    };
    if (!signupFormData.username || !signupFormData.password || !signupFormData.email) {
      toast.error("Please fill in all fields");
      return;
    }
    const response = await registerUser(registerData);
    if (response) {
      console.log(response);
      toast.success("You have successfully signed up");
      navigate("/login");
    }
    return response;
  };

  return (
    <div className="login-main text-primary h-screen w-screen bg-primary flex justify-between">
      <form className="login-form w-full h-full flex" onSubmit={handleSignup}>
        <div className="login-inner w-full h-96 m-auto text-secondary flex flex-col justify-between">
          <div className="text-7xl w-full h-1/3 text-center flex items-center justify-center text-black font-black">
            Signup
          </div>
          <div className="mb-2 mt-4 w-60 m-auto text-black outline outline-secondary rounded-xl">
            <InputBox
              name="username"
              inputLabel="Username"
              inputType="text"
              handleChange={handleSignupFormDataChange}
            />
          </div>
          <div className="mb-2 w-60 m-auto text-black outline outline-secondary rounded-xl">
            <InputBox
              name="password"
              inputLabel="Password"
              inputType="password"
              handleChange={handleSignupFormDataChange}
            />
          </div>
          <div className="mb-2 w-60 m-auto text-black outline outline-secondary rounded-xl">
            <InputBox
              name="email"
              inputLabel="Email"
              inputType="text"
              handleChange={handleSignupFormDataChange}
            />
          </div>
          <div className="w-60 m-auto">
            <button
              className="bg-secondary text-primary w-60 mt-2 p-1 rounded hover:opacity-75 hover:bg-yellow-300 hover:text-secondary hover:transition hover:duration-300 hover:shadow-emerald-600 font-semibold active:scale-x-95 active:scale-y-95"
              type="submit"
            >
              SIGN UP
            </button>
          </div>
          <div className="m-auto text-secondary text-xs text-center mt-4">
            <div
              className="mb-2 flex justify-center items-center h-8 hover:outline hover:outline-1 hover:rounded"
              onMouseEnter={handleQuestionMarkHover}
              onMouseLeave={handleQuestionMarkHover}
            >
              Or login with Google
              <div className="w-5 ml-2">
                <img src={questionMarkIcon} />
              </div>
            </div>
            <div className="mb-2"> {isQuestionMarkHovered ? <GoogleLoginQuestionMarkHover /> : <></>}</div>{" "}
            <div className="flex justify-center">
              <GoogleLoginButton />
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
};

export default Signup;
