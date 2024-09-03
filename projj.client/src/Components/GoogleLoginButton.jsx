import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoginTrue } from "../ReduxState/loginStatusSlice";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = async (response) => {
    console.log("Google Auth Response:", response); // Debugging
    const authToken = response.credential;
    if (!authToken) {
      console.error("Auth token is empty!");
      return;
    }

    const result = await axios.post(
      "https://localhost:7057/api/User/google-auth",
      {
        Token: authToken, // Make sure the property name matches your backend DTO
      },
      { withCredentials: true }
    );

    if (result.status == 200) {
      dispatch(setLoginTrue());
      console.log(result);
      navigate("/projects");
      toast.success(<div>You are now logged in!</div>);
    }
  };

  const onFailure = (error) => {
    console.log(error);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_APP_CLIENT_ID}>
      <GoogleLogin onSuccess={onSuccess} onFailure={onFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
